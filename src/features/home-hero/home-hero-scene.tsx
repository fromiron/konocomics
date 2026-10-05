"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties } from "react";

import { Button } from "@/components/design-system/button";
import { landingStrings } from "@/lib/strings";

import { HeroStage } from "./hero-stage";
import { createScenePlayer, whenSceneDecoded, type ScenePlayer } from "./scene-playback";
import type { SceneDefinition, SceneId } from "./scene-types";
import { battleScene } from "./scenes/battle";
import { romanceScene } from "./scenes/romance";

const scenes: Readonly<Record<SceneId, SceneDefinition>> = {
  battle: battleScene,
  romance: romanceScene,
};
const SCENE_ORDER: readonly SceneId[] = ["battle", "romance"];
/** Server-rendered pages (`?landing=1`) need one stable scene to hydrate against. */
const DEFAULT_SCENE: SceneId = "battle";

/** The scene shown last in this tab, so a reload always turns to a different genre. */
const SCENE_MARKER = "homeHeroScene";
/** A visitor's pause holds across reloads in the tab and is never lifted automatically. */
const PAUSE_MARKER = "homeHeroMotion";
/** Past this, a late intro would start under a visitor who is already reading. */
const DECODE_BUDGET_MS = 1500;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotionPreference(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => undefined;
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Motion runs only with Web Animations and without a reduced-motion preference. */
function sceneMotionAvailable() {
  return (
    typeof Element.prototype.animate === "function" &&
    typeof window.matchMedia === "function" &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

/** A random genre for this load, never the one the previous load in this tab showed. */
function drawScene(): SceneId {
  let previous: string | null = null;
  try {
    previous = window.sessionStorage.getItem(SCENE_MARKER);
  } catch {
    // Without storage every load is simply random.
  }
  const choices = SCENE_ORDER.filter((scene) => scene !== previous);
  const scene = choices[Math.floor(Math.random() * choices.length)] ?? DEFAULT_SCENE;
  try {
    window.sessionStorage.setItem(SCENE_MARKER, scene);
  } catch {
    // The scene still plays; only the no-repeat memory is lost.
  }
  return scene;
}

/** Drawn once per document load, so client-side returns to home keep the same page. */
let sceneOfThisLoad: SceneId | null = null;

function nextScene() {
  sceneOfThisLoad ??= drawScene();
  return sceneOfThisLoad;
}

function readPaused() {
  try {
    return window.sessionStorage.getItem(PAUSE_MARKER) === "paused";
  } catch {
    return false;
  }
}

function writePaused(paused: boolean) {
  try {
    if (paused) window.sessionStorage.setItem(PAUSE_MARKER, "paused");
    else window.sessionStorage.removeItem(PAUSE_MARKER);
  } catch {
    // The choice still holds for this page; only its persistence is lost.
  }
}

/** Development review hook: `?heroScene=romance&heroSeek=1500` freezes one exact frame. */
function reviewParameters(): { scene: SceneId | null; seek: number | null } | null {
  if (!import.meta.env.DEV || typeof window === "undefined") return null;
  const search = new URLSearchParams(window.location.search);
  const scene = search.get("heroScene");
  const seek = Number(search.get("heroSeek") ?? Number.NaN);
  return {
    scene: scene === "battle" || scene === "romance" ? scene : null,
    seek: Number.isFinite(seek) ? seek : null,
  };
}

function sceneForThisLoad(storageFree: boolean) {
  return scenes[reviewParameters()?.scene ?? (storageFree ? DEFAULT_SCENE : nextScene())];
}

type PlayingStageProps = Readonly<{
  scene: SceneDefinition;
  motion: boolean;
  paused: boolean;
}>;

function PlayingStage({ scene, motion, paused }: PlayingStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ScenePlayer | null>(null);
  const pausedRef = useRef(paused);
  const readyRef = useRef(false);
  const visibleRef = useRef(true);
  const reviewHoldRef = useRef(false);

  const sync = useCallback(() => {
    const player = playerRef.current;
    if (player === null || reviewHoldRef.current) return;
    if (readyRef.current && visibleRef.current && !pausedRef.current) player.play();
    else player.pause();
  }, []);

  // Builds the player before paint, so the first frame is already the intro's opening pose. A
  // paused visitor opens on the settled page instead.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (stage === null || !motion) return;
    const playIntro = !pausedRef.current;
    const player = createScenePlayer(scene, stage, playIntro ? 0 : scene.introMs);
    playerRef.current = player;
    readyRef.current = false;
    let active = true;

    const review = reviewParameters();
    if (review?.seek != null) {
      reviewHoldRef.current = true;
      player.seek(review.seek);
    }
    if (import.meta.env.DEV) {
      Object.assign(window, {
        __homeHero: {
          scene: scene.id,
          introMs: scene.introMs,
          seek: (ms: number) => player.seek(ms),
          play: () => player.play(),
          pause: () => player.pause(),
        },
      });
    }

    const start = () => {
      if (!active) return;
      readyRef.current = true;
      sync();
    };
    if (playIntro) {
      void whenSceneDecoded(stage, DECODE_BUDGET_MS).then((decoded) => {
        if (active && !decoded) player.seek(scene.introMs);
        start();
      });
    } else {
      start();
    }

    return () => {
      active = false;
      player.cancel();
      playerRef.current = null;
    };
  }, [motion, scene, sync]);

  useEffect(() => {
    pausedRef.current = paused;
    sync();
  }, [paused, sync]);

  // Off-screen or in a background tab nothing runs; it resumes where it stopped.
  useEffect(() => {
    const stage = stageRef.current;
    if (stage === null || !motion) return;
    let inView = true;
    const apply = () => {
      visibleRef.current = inView && document.visibilityState !== "hidden";
      sync();
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            apply();
          });
    observer?.observe(stage);
    document.addEventListener("visibilitychange", apply);
    apply();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, [motion, sync]);

  return <HeroStage ref={stageRef} scene={scene} />;
}

/** The scene this load shows: drawn once per document load, stable for `?landing=1`. */
export function useHeroScene(storageFree = false): SceneDefinition {
  const [scene] = useState(() => sceneForThisLoad(storageFree));
  return scene;
}

/** The hero's art panel shape: the scene panel's width over its height. */
export function sceneWindowStyle(scene: SceneDefinition) {
  const [, , width, height] = scene.window;
  return { "--hh-art-ratio": width / height } as CSSProperties;
}

type HomeHeroSceneProps = Readonly<{
  scene: SceneDefinition;
  /** `?landing=1`: no storage reads or writes. */
  storageFree?: boolean;
}>;

/**
 * The hero's art panel: a living genre scene cut to its own panel, with whatever breaks out of
 * the panel (the battle scene's hand) free to cross into the panels around it. Each load draws a
 * genre at random, never repeating the previous one, and plays its intro.
 */
export function HomeHeroScene({ scene, storageFree = false }: HomeHeroSceneProps) {
  const motion = useSyncExternalStore(subscribeMotionPreference, sceneMotionAvailable, () => false);
  const [paused, setPaused] = useState(() => !storageFree && readPaused());

  return (
    <div className="hh-art" data-scene={scene.id}>
      <PlayingStage motion={motion} paused={paused} scene={scene} />
      {motion ? (
        <Button
          aria-label={paused ? landingStrings.hero.motionPlay : landingStrings.hero.motionPause}
          className="hh-art__control"
          onClick={() => {
            const next = !paused;
            setPaused(next);
            if (!storageFree) writePaused(next);
          }}
          title={paused ? landingStrings.hero.motionPlay : landingStrings.hero.motionPause}
          variant="ghost"
        >
          {paused ? (
            <PlayIcon aria-hidden="true" className="size-4" />
          ) : (
            <PauseIcon aria-hidden="true" className="size-4" />
          )}
        </Button>
      ) : null}
    </div>
  );
}
