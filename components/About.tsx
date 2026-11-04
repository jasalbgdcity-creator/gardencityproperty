"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { dictionary, language } = useLanguage();
  const copy = dictionary.about;

  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;

    const tryPlay = () => {
      if (!isIntersectingRef.current || isManuallyStopped) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay prevented until user interaction
            setIsPlaying(false);
          });
      }
    };

    const stopAudio = () => {
      audio.pause();
      setIsPlaying(false);
    };

    // IntersectionObserver ensures audio only plays when viewing the About section
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current =
          entry.isIntersecting && entry.intersectionRatio >= 0.2;

        if (isIntersectingRef.current) {
          tryPlay();
        } else {
          stopAudio();
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.4, 0.6],
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Unlock on first user gesture if currently intersecting
    const handleFirstGesture = () => {
      if (isIntersectingRef.current && !isManuallyStopped && audio.paused) {
        tryPlay();
      }
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("scroll", handleFirstGesture, { passive: true });

    // Handle tab switching / backgrounding
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAudio();
      } else if (isIntersectingRef.current && !isManuallyStopped) {
        tryPlay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAudio();
    };
  }, [isManuallyStopped]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsManuallyStopped(true);
    } else {
      setIsManuallyStopped(false);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-24 border-t border-white/5 py-24"
    >
      {/* Background Audio element for About section */}
      <audio
        ref={audioRef}
        src="/adio.mpeg"
        preload="auto"
        loop
        playsInline
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.28em] text-sky-400 uppercase">
            {copy.eyebrow}
          </p>

          <h2 className="mt-3 font-[family-name:var(--font-outfit)] text-3xl font-semibold text-white sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-6 font-sans text-base leading-8 text-slate-300">{copy.body}</p>
          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-4">
            {copy.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-2.5 py-3.5 sm:px-3 sm:py-4 text-center sm:text-start backdrop-blur-md"
              >
                <p className="font-[family-name:var(--font-outfit)] text-base sm:text-lg font-semibold text-sky-300">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.7rem] sm:text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="group relative h-full min-h-[380px] lg:min-h-[440px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_0_36px_rgba(56,189,248,0.2)]"
        >
          {/* Background Looping Video */}
          <video
            src="/ani.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Bottom-Right Audio Control Badge */}
          <div className="absolute bottom-4 right-4 z-20 rtl:right-auto rtl:left-4">
            <button
              type="button"
              onClick={toggleAudio}
              className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-medium shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                isPlaying
                  ? "border-sky-400/60 bg-slate-950/85 text-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                  : "border-white/20 bg-slate-950/80 text-slate-300 hover:border-white/40 hover:bg-slate-950 hover:text-white"
              }`}
              aria-label={isPlaying ? "Mute audio" : "Play audio"}
              title={isPlaying ? "Mute / Pause Audio" : "Play Background Audio"}
            >
              {isPlaying ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
                  </span>
                  <Volume2 className="h-4 w-4 text-sky-300" />
                  <span className="font-semibold tracking-wide">
                    {language === "ar" ? "الصوت يعمل" : "Audio Playing"}
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 text-slate-400" />
                  <span className="font-medium tracking-wide">
                    {language === "ar" ? "تشغيل الصوت" : "Play Audio"}
                  </span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
