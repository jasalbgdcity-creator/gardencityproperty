"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: string | number;
  className?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  className = "",
  duration = 1.8,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const strValue = String(value);
  // Match first number in string (e.g., 360 in "360°", 8 in "8 - 10%", 2027 in "2027")
  const match = strValue.match(/(\d+)/);
  const targetNumber = match ? parseInt(match[0], 10) : null;

  const [displayNumber, setDisplayNumber] = useState<number | null>(
    targetNumber !== null && !shouldReduceMotion ? 0 : null
  );

  useEffect(() => {
    if (!isInView || shouldReduceMotion || targetNumber === null) return;

    const startTime = performance.now();
    const durationMs = duration * 1000;
    let animationFrameId: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Luxury ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetNumber);

      setDisplayNumber(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayNumber(targetNumber);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, shouldReduceMotion, targetNumber, duration]);

  if (!match || shouldReduceMotion || displayNumber === null) {
    return <span ref={ref} className={className}>{strValue}</span>;
  }

  const animatedText = strValue.replace(match[0], displayNumber.toLocaleString());

  return (
    <span ref={ref} className={className}>
      {animatedText}
    </span>
  );
}
