"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { playFlowerBloomSound, playCuteChime } from "@/lib/soundEffects";

interface BloomingFlowerProps {
  autoBloom?: boolean;
  size?: "sm" | "md" | "lg";
  onBloomComplete?: () => void;
  showBadge?: boolean;
}

export function BloomingFlower({
  autoBloom = true,
  size = "md",
  onBloomComplete,
  showBadge = false,
}: BloomingFlowerProps) {
  const [bloomed, setBloomed] = useState(!autoBloom);
  const [pulseKey, setPulseKey] = useState(0);
  const [floatingPetals, setFloatingPetals] = useState<
    { id: number; x: number; y: number; rotate: number; scale: number; color: string }[]
  >([]);

  useEffect(() => {
    if (autoBloom) {
      const timer = setTimeout(() => {
        setBloomed(true);
        playFlowerBloomSound();

        // Tạo chùm cánh hoa anh đào bung tỏa nhẹ nhàng
        const petals = Array.from({ length: 8 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.3;
          const dist = 38 + Math.random() * 32;
          const colors = ["#fda4af", "#fb7185", "#f43f5e", "#ffe4e6", "#fbcfe8"];
          return {
            id: i,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 8,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.35 + 0.5,
            color: colors[i % colors.length],
          };
        });
        setFloatingPetals(petals);

        if (onBloomComplete) {
          setTimeout(onBloomComplete, 1200);
        }
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [autoBloom, onBloomComplete]);

  const handleFlowerTap = () => {
    playCuteChime();
    setPulseKey((k) => k + 1);

    // Thả thêm cánh hoa mini khi chạm vào bông hoa
    const extra = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 6;
      const dist = 32 + Math.random() * 28;
      const colors = ["#fbcfe8", "#fda4af", "#fb7185", "#ffe4e6"];
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 10,
        rotate: Math.random() * 360,
        scale: Math.random() * 0.3 + 0.5,
        color: colors[i % colors.length],
      };
    });
    setFloatingPetals((prev) => [...prev.slice(-6), ...extra]);
  };

  const scaleSize = {
    sm: "w-20 h-20 sm:w-24 sm:h-24",
    md: "w-28 h-28 sm:w-32 sm:h-32",
    lg: "w-36 h-36 sm:w-40 sm:h-40",
  }[size];

  return (
    <div className="relative flex flex-col items-center select-none my-1">
      {/* Vầng hào quang lung linh lãng mạn phía sau hoa */}
      <motion.div
        animate={
          bloomed
            ? {
                scale: [1, 1.16, 1],
                opacity: [0.35, 0.6, 0.35],
              }
            : { scale: 0.3, opacity: 0 }
        }
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-2 rounded-full bg-gradient-to-tr from-rose-300/30 via-pink-200/35 to-amber-200/25 blur-lg pointer-events-none"
      />

      {/* Cánh hoa bay bung tỏa xung quanh */}
      <AnimatePresence>
        {floatingPetals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.2, rotate: 0 }}
            animate={{
              opacity: [1, 0.85, 0],
              x: petal.x,
              y: petal.y - 18,
              scale: petal.scale,
              rotate: petal.rotate + 180,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute pointer-events-none z-20"
            style={{ width: 14, height: 18 }}
          >
            <svg viewBox="0 0 20 28" className="w-full h-full drop-shadow-xs">
              <path
                d="M10,0 C17,7 20,16 10,28 C0,16 3,7 10,0 Z"
                fill={petal.color}
                opacity="0.9"
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Đóa hoa nở rộ tương tác SVG siêu cute & mềm mại */}
      <motion.div
        key={pulseKey}
        onClick={handleFlowerTap}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={
          bloomed
            ? {
                scale: [1, 1.03, 1],
              }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`relative ${scaleSize} cursor-pointer group flex items-center justify-center`}
        role="button"
        tabIndex={0}
        aria-label="Chạm vào đóa hoa yêu thương để tương tác"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible drop-shadow-md"
        >
          <defs>
            {/* Gradient lá xanh bạc hà nhẹ nhàng thanh tú */}
            <linearGradient id="softLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Gradient cánh hoa ngoài - hồng phấn viền đào ngọt ngào */}
            <radialGradient id="rosePetalOuter" cx="50%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#ffe4e8" />
              <stop offset="65%" stopColor="#fda4af" />
              <stop offset="90%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </radialGradient>

            {/* Gradient cánh hoa giữa - hồng thắm tươi vui */}
            <radialGradient id="rosePetalMid" cx="48%" cy="36%" r="64%">
              <stop offset="0%" stopColor="#fff1f4" />
              <stop offset="30%" stopColor="#fecdd3" />
              <stop offset="75%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </radialGradient>

            {/* Gradient lớp cánh nụ trong - mềm mại ngọt ngào */}
            <radialGradient id="rosePetalCore" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fda4af" />
              <stop offset="80%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </radialGradient>

            {/* Nhụy hoa vàng kim mật ong lấp lánh */}
            <radialGradient id="roseStamenGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="75%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>

          {/* 1. HAI CHIẾC LÁ XANH BẠC HÀ TƯƠI TẮN ĐÍNH HẠT SƯƠNG */}
          <g>
            {/* Lá bên trái */}
            <g transform="rotate(-38 100 100)">
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={bloomed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.3, 0.64, 1] }}
                style={{ transformOrigin: "100px 100px", transformBox: "view-box" }}
              >
                <path
                  d="M 100 100 C 72 108, 42 94, 36 68 C 52 68, 76 78, 100 100 Z"
                  fill="url(#softLeafGrad)"
                  stroke="#059669"
                  strokeWidth="0.6"
                />
                <path
                  d="M 100 100 Q 68 86 40 70"
                  fill="none"
                  stroke="#d1fae5"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <circle cx="56" cy="74" r="2.2" fill="#ffffff" opacity="0.85" />
              </motion.g>
            </g>

            {/* Lá bên phải */}
            <g transform="rotate(38 100 100)">
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={bloomed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.34, 1.3, 0.64, 1] }}
                style={{ transformOrigin: "100px 100px", transformBox: "view-box" }}
              >
                <path
                  d="M 100 100 C 128 108, 158 94, 164 68 C 148 68, 124 78, 100 100 Z"
                  fill="url(#softLeafGrad)"
                  stroke="#059669"
                  strokeWidth="0.6"
                />
                <path
                  d="M 100 100 Q 132 86 160 70"
                  fill="none"
                  stroke="#d1fae5"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <circle cx="144" cy="74" r="2.2" fill="#ffffff" opacity="0.85" />
              </motion.g>
            </g>
          </g>

          {/* 2. LỚP CÁNH HOA THỨ NHẤT: 5 CÁNH LỚN HÌNH TRÁI TIM NỞ XÒE RỘNG */}
          <g>
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <g key={`outer-${idx}`} transform={`rotate(${angle} 100 100)`}>
                <motion.path
                  d="M 100 100 C 66 84, 46 50, 72 32 C 86 22, 96 26, 100 29 C 104 26, 114 22, 128 32 C 154 50, 134 84, 100 100 Z"
                  fill="url(#rosePetalOuter)"
                  stroke="#fda4af"
                  strokeWidth="0.8"
                  opacity="0.96"
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={
                    bloomed
                      ? {
                          scale: 1,
                          opacity: 0.96,
                        }
                      : { scale: 0.1, opacity: 0 }
                  }
                  transition={{
                    duration: 0.75,
                    delay: 0.12 + idx * 0.04,
                    ease: [0.34, 1.4, 0.64, 1],
                  }}
                  style={{ transformOrigin: "100px 100px", transformBox: "view-box" }}
                />
              </g>
            ))}
          </g>

          {/* 3. LỚP CÁNH HOA THỨ HAI: 5 CÁNH XẾP SO LE, MÀU HOA HỒNG THẮM */}
          <g>
            {[36, 108, 180, 252, 324].map((angle, idx) => (
              <g key={`mid-${idx}`} transform={`rotate(${angle} 100 100)`}>
                <motion.path
                  d="M 100 100 C 74 86, 58 58, 78 44 C 90 36, 97 40, 100 42 C 103 40, 110 36, 122 44 C 142 58, 126 86, 100 100 Z"
                  fill="url(#rosePetalMid)"
                  stroke="#fff1f4"
                  strokeWidth="0.6"
                  opacity="0.98"
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={
                    bloomed
                      ? {
                          scale: 0.86,
                          opacity: 0.98,
                        }
                      : { scale: 0.1, opacity: 0 }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + idx * 0.03,
                    ease: [0.34, 1.4, 0.64, 1],
                  }}
                  style={{ transformOrigin: "100px 100px", transformBox: "view-box" }}
                />
              </g>
            ))}
          </g>

          {/* 4. LỚP CÁNH HOA THỨ BA: 5 CÁNH CUỘN XOẮN NỤ HỒNG MỀM MẠI */}
          <g>
            {[18, 90, 162, 234, 306].map((angle, idx) => (
              <g key={`inner-${idx}`} transform={`rotate(${angle} 100 100)`}>
                <motion.path
                  d="M 100 100 C 80 88, 70 66, 84 54 C 92 48, 98 51, 100 53 C 102 51, 108 48, 116 54 C 130 66, 120 88, 100 100 Z"
                  fill="url(#rosePetalCore)"
                  stroke="#fecdd3"
                  strokeWidth="0.6"
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={
                    bloomed
                      ? {
                          scale: 0.68,
                          opacity: 1,
                        }
                      : { scale: 0.1, opacity: 0 }
                  }
                  transition={{
                    duration: 0.65,
                    delay: 0.45 + idx * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: "100px 100px", transformBox: "view-box" }}
                />
              </g>
            ))}
          </g>

          {/* 5. TÂM NHỤY HOA VÀNG KIM TỎA SÁNG VỚI HẠT PHẤN HOA LUNG LINH */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={
              bloomed
                ? {
                    scale: [0.95, 1.1, 1],
                    opacity: 1,
                  }
                : { scale: 0, opacity: 0 }
            }
            transition={{
              scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
              opacity: { duration: 0.5, delay: 0.65 },
            }}
            style={{ transformOrigin: "100px 100px", transformBox: "view-box" }}
          >
            {/* Nhụy hoa tỏa nhánh vàng kim */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 100 100)`}>
                <line x1="100" y1="100" x2="100" y2="88" stroke="#f59e0b" strokeWidth="0.8" opacity="0.75" />
                <circle cx="100" cy="87" r="1.6" fill="#fef08a" stroke="#f59e0b" strokeWidth="0.4" />
              </g>
            ))}

            {/* Vòng nhụy trung tâm */}
            <circle cx="100" cy="100" r="9" fill="url(#roseStamenGold)" className="drop-shadow-xs" />
            <circle cx="100" cy="100" r="4.5" fill="#ffffff" opacity="0.7" />

            {/* Ánh sao lấp lánh nhẹ */}
            <path
              d="M 100 95 Q 100 100 95 100 Q 100 100 100 105 Q 100 100 105 100 Q 100 100 100 95 Z"
              fill="#ffffff"
              opacity="0.95"
            />
          </motion.g>
        </svg>

        {/* Trái tim hồng mini bay lên nhẹ nhàng từ tâm hoa */}
        <motion.div
          animate={
            bloomed
              ? {
                  y: [0, -6, 0],
                  scale: [1, 1.15, 1],
                  opacity: [0.85, 1, 0.85],
                }
              : { opacity: 0 }
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-30 pointer-events-none"
        >
          <Heart className="w-3.5 h-3.5 text-white fill-white drop-shadow-xs" />
        </motion.div>
      </motion.div>

      {/* Huy hiệu nhỏ nếu được kích hoạt */}
      {showBadge && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={bloomed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-rose-200 text-rose-700 text-xs font-semibold shadow-xs"
        >
          <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
          <span>Đóa hoa tươi thắm 🌸</span>
        </motion.div>
      )}
    </div>
  );
}
