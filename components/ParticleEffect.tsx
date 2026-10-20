"use client";

import React from "react";
import { PetalRain } from "@/components/PetalRain";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Sparkles } from "@/components/Sparkles";
import { CursorTrail } from "@/components/CursorTrail";
import { CuteButterflies } from "@/components/CuteButterflies";

export function ParticleEffect() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
        {/* 1. Hạt ánh sao & bokeh nhẹ ở nền */}
        <Sparkles />
        {/* 2. Cánh hoa anh đào rơi bồng bềnh toàn trang */}
        <PetalRain />
        {/* 3. Những cánh bướm dễ thương vỗ cánh lượn qua bầu trời hoa */}
        <CuteButterflies />
        {/* 4. Trái tim lơ lửng và hiệu ứng chạm bung chùm tim */}
        <FloatingHearts />
      </div>

      {/* 5. Vệt sao lấp lánh & trái tim mini theo ngón tay / con trỏ chuột */}
      <CursorTrail />
    </>
  );
}
