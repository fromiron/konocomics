"use client";

import { useCallback, useEffect, useRef } from "react";

import { burstConfirmSparks } from "./confirm-spark";
import { useConfirmStamp } from "./use-confirm-stamp";

/**
 * Stamp and sparks for a positive choice (04 §6 D·G). `confirmed` must flip only after the
 * choice is saved; sparks come from the control the reader actually pressed, so copies of the
 * same work elsewhere on the page (other shelves, carousel clones) only stamp quietly.
 */
export function useSaveConfirmation<Element extends HTMLElement>(confirmed: boolean) {
  const stamping = useConfirmStamp(confirmed);
  const elementRef = useRef<Element | null>(null);
  const pressedRef = useRef(false);

  useEffect(() => {
    if (!stamping || !pressedRef.current) return;
    pressedRef.current = false;
    burstConfirmSparks(elementRef.current);
  }, [stamping]);

  /** Callback ref for the control the sparks start from. */
  const attach = useCallback((element: Element | null) => {
    elementRef.current = element;
  }, []);
  /** Call from the press handler before asking to save. */
  const markPressed = useCallback(() => {
    pressedRef.current = !confirmed;
  }, [confirmed]);

  return { stamping, attach, markPressed };
}
