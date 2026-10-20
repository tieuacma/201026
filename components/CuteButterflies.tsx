"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Butterfly {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  scale: number;
  duration: number;
  delay: number;
  color: string;
}

export function CuteButterflies() {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  useEffect(() => {
    // Tạo 3 cánh bướm dễ thương bay lượn ngẫu nhiên
    const colors = [
      { wing: "#fda4af", border: "#f43f5e" }, // hồng thắm
      { wing: "#fef08a", border: "#f59e0b" }, // vàng nắng
      { wing: "#e9d5ff", border: "#c084fc" }, // tím mộng mơ
    ];

    const items: Butterfly[] = [
      {
        id: 1,
        startX: -50,
        startY: 200,
        targetX: typeof window !== "undefined" ? window.innerWidth + 50 : 1200,
        targetY: 150,
        scale: 0.85,
        duration: 18,
        delay: 1,
        color: colors[0].wing,
      },
      {
        id: 2,
        startX: typeof window !== "undefined" ? window.innerWidth + 40 : 1200,
        startY: 400,
        targetX: -60,
        targetY: 300,
        scale: 0.7,
        duration: 22,
        delay: 5,
        color: colors[1].wing,
      },
      {
        id: 3,
        startX: 100,
        startY: typeof window !== "undefined" ? window.innerHeight + 50 : 900,
        targetX: typeof window !== "undefined" ? window.innerWidth * 0.8 : 800,
        targetY: -50,
        scale: 0.75,
        duration: 20,
        delay: 9,
        color: colors[2].wing,
      },
    ];

    setButterflies(items);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          initial={{
            x: b.startX,
            y: b.startY,
            opacity: 0,
          }}
          animate={{
            x: [b.startX, b.startX + (b.targetX - b.startX) * 0.5, b.targetX],
            y: [b.startY, b.startY - 60, b.targetY],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transform: `scale(${b.scale})` }}
          className="absolute"
        >
          {/* Cặp cánh bướm SVG vỗ cánh 3D */}
          <div className="relative flex items-center justify-center w-10 h-10">
            {/* Cánh trái */}
            <div className="butterfly-wing-left w-5 h-8 flex justify-end">
              <svg viewBox="0 0 30 50" className="w-full h-full drop-shadow-xs">
                <path
                  d="M30,25 C10,5 0,15 5,30 C10,42 25,48 30,25 Z"
                  fill={b.color}
                  stroke="#fb7185"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              </svg>
            </div>

            {/* Thân bướm nhỏ xíu */}
            <div className="w-1 h-5 bg-rose-800 rounded-full z-10 -mx-0.5" />

            {/* Cánh phải */}
            <div className="butterfly-wing-right w-5 h-8 flex justify-start">
              <svg viewBox="0 0 30 50" className="w-full h-full drop-shadow-xs">
                <path
                  d="M0,25 C20,5 30,15 25,30 C20,42 5,48 0,25 Z"
                  fill={b.color}
                  stroke="#fb7185"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
