/**
 * Confirmation sparks (04 §6 G, React Bits ClickSpark as reference). Particles live in one
 * fixed, `aria-hidden` layer on `document.body`, so a burst survives a route change started by
 * the same click. Call only after a positive choice succeeded; reduced motion skips it.
 */

const PARTICLE_COUNT = 12;
const LAYER_ATTRIBUTE = "data-confirm-sparks";

function reducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

function sparkLayer() {
  const existing = document.querySelector<HTMLElement>(`[${LAYER_ATTRIBUTE}]`);
  if (existing !== null) return existing;
  const layer = document.createElement("div");
  layer.setAttribute(LAYER_ATTRIBUTE, "");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "80",
    overflow: "hidden",
  });
  document.body.append(layer);
  return layer;
}

/** Bursts from a viewport point, or from the centre of an element. */
export function burstConfirmSparks(origin: Readonly<{ x: number; y: number }> | Element | null) {
  if (origin === null || typeof document === "undefined" || reducedMotion()) return;
  if (typeof HTMLElement.prototype.animate !== "function") return;
  const point =
    origin instanceof Element
      ? (() => {
          const rect = origin.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()
      : origin;
  const layer = sparkLayer();
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const particle = document.createElement("span");
    const size = 6 + Math.random() * 4;
    Object.assign(particle.style, {
      position: "absolute",
      left: `${String(point.x)}px`,
      top: `${String(point.y)}px`,
      width: `${String(size)}px`,
      height: `${String(size)}px`,
      borderRadius: "999px",
      background: index % 3 === 0 ? "var(--accent-hover)" : "var(--accent)",
      // A dark rim and glow keep sparks visible over bright covers as well as the dark page.
      boxShadow:
        "0 0 0 1px color-mix(in oklch, var(--canvas) 55%, transparent), 0 0 8px color-mix(in oklch, var(--accent) 70%, transparent)",
    });
    layer.append(particle);
    // Even spread with a little jitter, so every burst reads as one ring.
    const angle = (index / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 36 + Math.random() * 54;
    const animation = particle.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${String(Math.cos(angle) * distance)}px), calc(-50% + ${String(Math.sin(angle) * distance)}px)) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 480 + Math.random() * 320, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
    animation.onfinish = () => particle.remove();
    animation.oncancel = () => particle.remove();
  }
}
