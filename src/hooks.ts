import { useEffect, useRef, useState } from "react";

/**
 * Reveal children as they enter the viewport. Returns a ref for the container.
 *
 * The container is watched for added nodes, not read once. Filtering and
 * searching unmount cards and mount fresh ones, and a node that appears after
 * this effect ran was never handed to the observer. Without the MutationObserver
 * below those cards keep `.reveal`'s opacity: 0 forever, so clearing a search
 * left most of the grid present in the DOM but invisible.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const pending = () => root.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const showAll = () => pending().forEach((t) => t.classList.add("is-visible"));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    // Observing an element twice is a no-op, so rescanning is safe.
    const watch = () => pending().forEach((t) => io.observe(t));
    watch();

    // Typing in the search box mutates the grid on every keystroke. Coalesce
    // the rescans into one per frame.
    let frame = 0;
    const mo = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        watch();
      });
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

/** Scroll progress through the first viewport, clamped 0 to 1. */
export function useHeroProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const h = window.innerHeight || 1;
        setP(Math.min(1, Math.max(0, window.scrollY / h)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return p;
}

/** Mount flag, used to trigger the hero fade-in. */
export function useMounted(delay = 60) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}


/**
 * Swap the tab title once the reader looks away, and restore it when they
 * come back. Small, quiet, and only ever seen by someone who left and
 * returned, which is exactly the reader worth rewarding.
 */
export function useAwayTitle(awayTitle: string) {
  useEffect(() => {
    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? awayTitle : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, [awayTitle]);
}

/** One note for anyone who opens developer tools. */
export function useConsoleNote(note: string) {
  useEffect(() => {
    console.log(
      "%c" + note,
      "color:#c9d1da;font-family:ui-monospace,monospace;font-size:12px;line-height:1.6"
    );
  }, [note]);
}
