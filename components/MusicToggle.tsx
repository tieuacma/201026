"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music, Disc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { getAssetPath } from "@/lib/utils";

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const audioSrc = getAssetPath(siteConfig.music.src);

  // Bộ phát nhạc hộp nhạc dự phòng (Web Audio API Synth Fallback) khi file mp3 chưa được thêm vào
  const playRomanticChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Các nốt nhạc lãng mạn hộp nhạc (Pentatonic / C major arpeggio)
      const notes = [261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 261.63];
      let noteIndex = 0;

      const scheduleNote = () => {
        if (!audioContextRef.current || ctx.state === "closed") return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(notes[noteIndex % notes.length], ctx.currentTime);

        // Hiệu ứng âm vang dịu nhẹ (soft bell envelope)
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.8);

        noteIndex++;
        synthTimerRef.current = setTimeout(scheduleNote, 1200);
      };

      scheduleNote();
    } catch (e) {
      console.warn("Web Audio synth không khả dụng:", e);
    }
  };

  const stopSynth = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend();
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (isPlaying) {
      if (audio) {
        audio.pause();
      }
      stopSynth();
      setIsPlaying(false);
    } else {
      if (audio) {
        try {
          await audio.play();
          setIsPlaying(true);
          setHasError(false);
        } catch {
          if (siteConfig.music.synthFallback) {
            playRomanticChime();
            setIsPlaying(true);
          } else {
            setHasError(true);
          }
        }
      } else if (siteConfig.music.synthFallback) {
        playRomanticChime();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play()
      .then(() => {
        setIsPlaying(true);
        setHasError(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          return;
        }

        console.warn("Không thể tự phát nhạc nền:", error);
        setHasError(true);
      });
  }, []);

  useEffect(() => {
    return () => {
      stopSynth();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Thẻ audio ẩn */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="none"
        onError={() => {
          setHasError(true);
        }}
      />

      {/* Các nốt nhạc và biểu tượng hoa bay lên khi đang phát nhạc */}
      <AnimatePresence>
        {isPlaying && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none flex gap-2">
            {["♪", "🌸", "♫", "♡"].map((sym, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-5, -35 - i * 8],
                  x: [(i - 1.5) * 8, (i - 1.5) * 14],
                  scale: [0.6, 1.1, 0.8],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
                className="text-xs font-bold text-rose-500 drop-shadow-xs"
              >
                {sym}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggleMusic}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all duration-300 backdrop-blur-md border cursor-pointer ${
          isPlaying
            ? "bg-rose-500/95 text-white border-rose-300 shadow-rose-300/50 hover:bg-rose-600 ring-4 ring-rose-200"
            : "bg-white/90 text-rose-700 border-rose-200/80 shadow-rose-100 hover:bg-rose-50"
        }`}
      >
        {isPlaying ? (
          <>
            <Disc className="w-5 h-5 animate-spin text-white" style={{ animationDuration: "3s" }} />
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-semibold hidden sm:inline">Giai điệu yêu thương</span>
          </>
        ) : (
          <>
            <Music className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
            <VolumeX className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-medium hidden sm:inline">Bật nhạc</span>
          </>
        )}

        {hasError && !isPlaying && (
          <span className="sr-only">Chưa có file mp3, hãy thêm vào thư mục public/music.mp3</span>
        )}
      </motion.button>
    </div>
  );
}
