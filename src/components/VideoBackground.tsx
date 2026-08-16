import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  VIDEO,
  VIDEO_PLAYBACK_RATE,
  PORTRAIT_QUERY,
  VIDEO_ON_PORTRAIT,
} from "../config";

type Props = { progress: number };

/** Subscribe to a media query and re-render when it flips. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default function VideoBackground({ progress }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const isPortrait = useMediaQuery(PORTRAIT_QUERY);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const source = isPortrait ? VIDEO.portrait : VIDEO.landscape;

  // Reduced motion gets the still frame. A looping background is motion, and
  // someone who asked for less of it should not be handed ten seconds on a loop.
  const stillOnly = reduceMotion || (isPortrait && !VIDEO_ON_PORTRAIT);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduceMotion) return;
    // Pointer parallax is meaningless on touch, and the listener would never fire.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 20;
      targetY = ((e.clientY - cy) / cy) * 20;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      gsap.set(el, { x: currentX, y: currentY });
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduceMotion]);

  // The footage carries the hero. Past it the video becomes atmosphere, so it
  // dims to keep the reference text legible over moving imagery.
  const veil = 0.42 + progress * 0.52;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <div ref={wrapRef} className="absolute inset-0 origin-center scale-[1.08]">
        {stillOnly ? (
          <img
            src={source.poster}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            // Remounting on orientation change is what makes the browser pick
            // up the new file. Setting src alone would not reload the element.
            key={source.src}
            className="h-full w-full object-cover"
            src={source.src}
            poster={source.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = VIDEO_PLAYBACK_RATE;
            }}
          />
        )}
      </div>

      {/* Legibility stack: flat veil, then a floor gradient under the copy */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: veil }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85" />
    </div>
  );
}
