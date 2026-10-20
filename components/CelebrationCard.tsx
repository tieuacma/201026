"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Sun,
  Gift,
  Play,
  ArrowLeft,
  Image as ImageIcon,
  Star,
  Flower2,
  Plus,
  Eye,
  Camera,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { UploadedPhoto } from "@/components/UploadScreen";
import { Typewriter } from "@/components/Typewriter";
import { Lightbox, LightboxItem } from "@/components/Lightbox";
import { FooterSection } from "@/components/FooterSection";
import { BloomingFlower } from "@/components/BloomingFlower";
import { playBubblePop, playSparkleSound } from "@/lib/soundEffects";
import confetti from "canvas-confetti";

interface CelebrationCardProps {
  photos: UploadedPhoto[];
  recipientName?: string;
  senderName?: string;
  onBackToUpload: () => void;
}

/* =========================================================================
   CÁC LOẠI KẸP / GHIM / BĂNG DÍNH DỄ THƯƠNG (CUTE PHOTO FASTENERS)
   0: Kẹp gỗ đính tim hồng (Cute Wooden Peg with Heart)
   1: Ghim kẹp kim loại vàng hồng (Rose Gold Paperclip)
   2: Băng dính hoa anh đào mờ (Sakura Washi Tape)
   3: Ghim ngọc trai 3D (Pastel Pearl Pin)
   4: Nơ ruy băng lụa xinh xắn (Silk Ribbon Bow)
   5: Băng dính hoa mint chấm bi (Mint Heart Washi Tape)
   ========================================================================= */

function FastenerWoodenPeg() {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-10 pointer-events-none z-30 drop-shadow-md">
      <svg viewBox="0 0 28 42" className="w-full h-full">
        <ellipse cx="14" cy="40" rx="9" ry="2" fill="rgba(0,0,0,0.2)" />
        <rect x="7" y="2" width="6" height="34" rx="2" fill="#d4a373" stroke="#b08968" strokeWidth="0.8" />
        <rect x="15" y="2" width="6" height="34" rx="2" fill="#e6b88a" stroke="#b08968" strokeWidth="0.8" />
        <line x1="14" y1="2" x2="14" y2="36" stroke="#9c6644" strokeWidth="1" />
        <ellipse cx="14" cy="18" rx="8" ry="3.5" fill="none" stroke="#64748b" strokeWidth="2.2" />
        <rect x="11" y="16" width="6" height="4" rx="1" fill="#94a3b8" />
        <path d="M 14 7 C 12.5 4.5, 9.5 5.5, 9.5 8 C 9.5 10.5, 14 13.5, 14 13.5 C 14 13.5, 18.5 10.5, 18.5 8 C 18.5 5.5, 15.5 4.5, 14 7 Z" fill="#fb7185" />
      </svg>
    </div>
  );
}

function FastenerGoldClip() {
  return (
    <div className="absolute -top-3.5 left-5 w-6 h-10 pointer-events-none z-30 -rotate-12 drop-shadow-md">
      <svg viewBox="0 0 24 40" className="w-full h-full">
        <path
          d="M 6 12 L 6 30 C 6 36 18 36 18 30 L 18 8 C 18 2 10 2 10 8 L 10 26 C 10 29 14 29 14 26 L 14 12"
          fill="none"
          stroke="url(#goldClipGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="8" r="2.5" fill="#f43f5e" />
        <defs>
          <linearGradient id="goldClipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function FastenerSakuraWashi() {
  return (
    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-6 bg-gradient-to-r from-rose-200/90 via-pink-100/95 to-rose-200/90 backdrop-blur-xs border-y border-dashed border-rose-300/90 -rotate-2 pointer-events-none z-30 rounded-xs shadow-2xs flex items-center justify-around px-2">
      <Flower2 className="w-3 h-3 text-rose-500" />
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
      <Flower2 className="w-3 h-3 text-rose-500" />
    </div>
  );
}

function FastenerPearlPin() {
  return (
    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 pointer-events-none z-30 drop-shadow-md">
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <ellipse cx="12" cy="22" rx="4" ry="1.5" fill="rgba(0,0,0,0.2)" />
        <circle cx="12" cy="11" r="8" fill="url(#pearlPinGrad)" stroke="#f472b6" strokeWidth="0.8" />
        <circle cx="9.5" cy="8.5" r="2.5" fill="#ffffff" opacity="0.9" />
        <defs>
          <radialGradient id="pearlPinGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f43f5e" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function FastenerRibbonBow() {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 pointer-events-none z-30 drop-shadow-md">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <path d="M 18 16 C 10 10 6 18 16 19 Z" fill="#fb7185" stroke="#f43f5e" strokeWidth="0.8" />
        <path d="M 18 16 C 26 10 30 18 20 19 Z" fill="#fb7185" stroke="#f43f5e" strokeWidth="0.8" />
        <path d="M 17 19 Q 12 28 9 32" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 19 19 Q 24 28 27 32" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="18" cy="17" r="3.5" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1" />
      </svg>
    </div>
  );
}

function FastenerMintWashi() {
  return (
    <div className="absolute -top-3.5 right-5 w-18 h-6 bg-gradient-to-r from-emerald-100/90 via-teal-50/95 to-emerald-100/90 backdrop-blur-xs border-y border-dashed border-emerald-300/90 rotate-3 pointer-events-none z-30 rounded-xs shadow-2xs flex items-center justify-around px-2">
      <Heart className="w-2.5 h-2.5 text-emerald-500 fill-emerald-300" />
      <span className="w-1 h-1 rounded-full bg-emerald-400" />
      <Heart className="w-2.5 h-2.5 text-emerald-500 fill-emerald-300" />
    </div>
  );
}

function RenderFastener({ index }: { index: number }) {
  const type = index % 6;
  switch (type) {
    case 0:
      return <FastenerWoodenPeg />;
    case 1:
      return <FastenerGoldClip />;
    case 2:
      return <FastenerSakuraWashi />;
    case 3:
      return <FastenerPearlPin />;
    case 4:
      return <FastenerRibbonBow />;
    case 5:
    default:
      return <FastenerMintWashi />;
  }
}

/* =========================================================================
   DÂY ĐÈN ĐOM ĐÓM FAIRY LIGHTS LUNG LINH TRANG TRÍ ALBUM SCRAPBOOK
   ========================================================================= */

function FairyLightsGarland() {
  return (
    <div className="w-full overflow-hidden pointer-events-none mb-4 -mt-2">
      <svg viewBox="0 0 1000 60" className="w-full h-auto drop-shadow-sm" preserveAspectRatio="none">
        {/* Dây điện mảnh uốn lượn mềm mại */}
        <path
          d="M 0 14 Q 125 42, 250 14 Q 375 42, 500 14 Q 625 42, 750 14 Q 875 42, 1000 14"
          fill="none"
          stroke="#fbcfe8"
          strokeWidth="1.6"
          strokeDasharray="4 2.5"
        />

        {/* Các bóng đèn đom đóm fairy lights phát sáng ấm áp */}
        {[
          { x: 55, y: 28, color: "#fb7185", glow: "#f43f5e" },
          { x: 125, y: 42, color: "#fef08a", glow: "#fbbf24" },
          { x: 195, y: 28, color: "#f472b6", glow: "#ec4899" },
          { x: 250, y: 14, color: "#a7f3d0", glow: "#34d399" },
          { x: 310, y: 28, color: "#fde047", glow: "#f59e0b" },
          { x: 375, y: 42, color: "#fda4af", glow: "#fb7185" },
          { x: 440, y: 28, color: "#c084fc", glow: "#a855f7" },
          { x: 500, y: 14, color: "#fef08a", glow: "#fbbf24" },
          { x: 560, y: 28, color: "#f472b6", glow: "#f43f5e" },
          { x: 625, y: 42, color: "#a7f3d0", glow: "#10b981" },
          { x: 690, y: 28, color: "#fde047", glow: "#f59e0b" },
          { x: 750, y: 14, color: "#fda4af", glow: "#fb7185" },
          { x: 810, y: 28, color: "#c084fc", glow: "#a855f7" },
          { x: 875, y: 42, color: "#fef08a", glow: "#fbbf24" },
          { x: 945, y: 28, color: "#fb7185", glow: "#f43f5e" },
        ].map((bulb, i) => (
          <g key={i}>
            <rect x={bulb.x - 2} y={bulb.y - 5} width="4" height="4" rx="1" fill="#94a3b8" />
            <circle
              cx={bulb.x}
              cy={bulb.y + 1}
              r="9"
              fill={bulb.glow}
              opacity="0.35"
              className="animate-pulse"
              style={{ animationDuration: `${2.2 + (i % 3) * 0.6}s`, animationDelay: `${(i % 5) * 0.25}s` }}
            />
            <ellipse cx={bulb.x} cy={bulb.y + 2} rx="3.5" ry="5.5" fill={bulb.color} />
            <circle cx={bulb.x - 1} cy={bulb.y} r="1.2" fill="#ffffff" opacity="0.85" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* =========================================================================
   CÁC MẪU KHUNG ẢNH PASTEL SIÊU CUTE (CHỈ HIỆN ẢNH THUẦN TÚY)
   Style 0: Sweet Sakura Polaroid (Hồng dâu ngọt ngào)
   Style 1: Baby Lavender Photocard (Tím kẹo bông mơ màng)
   Style 2: Butter Daisy Sunshine (Vàng bơ & Hoa cúc tươi tắn)
   Style 3: Minty Clover & Heart (Bạc hà may mắn & Kẹo ngọt)
   ========================================================================= */

interface PhotoCardViewProps {
  photo: UploadedPhoto;
  index: number;
  tilt: number;
  onOpen: () => void;
}

function PhotoCardView({ photo, index, tilt, onOpen }: PhotoCardViewProps) {
  const frameStyle = index % 4;
  const photoAlt = `Kỷ niệm #${index + 1}`;

  const handleMiniHeartReaction = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBubblePop(1.3);
    confetti({
      particleCount: 16,
      spread: 50,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ["#fda4af", "#fb7185", "#f43f5e", "#fbcfe8", "#fbbf24"],
    });
  };

  // Style 0: Sweet Sakura Polaroid (Hồng dâu kem sữa)
  if (frameStyle === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: tilt }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
        whileHover={{ scale: 1.06, rotate: 0, y: -8, zIndex: 30 }}
        whileTap={{ scale: 0.97 }}
        className="group relative bg-gradient-to-b from-white via-[#fffbfa] to-[#fff3f5] p-2.5 sm:p-3 pb-3 sm:pb-3.5 rounded-3xl border-2 border-rose-200/90 shadow-md shadow-rose-200/40 hover:shadow-2xl hover:shadow-rose-300/50 cursor-pointer transition-all"
        onClick={onOpen}
      >
        <RenderFastener index={index} />

        {/* Khung ảnh chính */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-rose-50 shadow-inner group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photoAlt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />

          {/* Vệt ánh kim lướt qua khi hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-in-out pointer-events-none z-10" />

          {/* Lớp phủ khi hover với nút xem ảnh xinh xắn */}
          <div className="absolute inset-0 bg-rose-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-rose-600 text-xs font-bold shadow-lg shadow-rose-200/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5 text-rose-500" />
              <span>Xem ảnh ✨</span>
            </span>
          </div>

          {/* Sticker góc ảnh dễ thương */}
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs pointer-events-none group-hover:scale-110 transition-transform">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>

          {/* Nút thả tim trực tiếp trên ảnh */}
          <button
            type="button"
            onClick={handleMiniHeartReaction}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-rose-500 flex items-center justify-center shadow-md hover:scale-115 active:scale-90 transition-all z-20 cursor-pointer opacity-0 group-hover:opacity-100"
            title="Thả tim cho bức ảnh 💕"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </button>
        </div>

        {/* Chân polaroid trắng tinh tế với biểu tượng dập chìm */}
        <div className="flex items-center justify-center pt-2 pb-0.5">
          <Heart className="w-3.5 h-3.5 text-rose-300/80 fill-rose-200/60" />
        </div>
      </motion.div>
    );
  }

  // Style 1: Baby Lavender Photocard (Tím kẹo bông mơ màng)
  if (frameStyle === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: tilt }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
        whileHover={{ scale: 1.06, rotate: 0, y: -8, zIndex: 30 }}
        whileTap={{ scale: 0.97 }}
        className="group relative bg-gradient-to-b from-[#fefcff] via-[#faf5ff] to-[#f5eeff] p-2.5 sm:p-3 pb-3 sm:pb-3.5 rounded-3xl border-2 border-purple-200/80 shadow-md shadow-purple-200/35 hover:shadow-2xl hover:shadow-purple-300/50 cursor-pointer transition-all"
        onClick={onOpen}
      >
        <RenderFastener index={index} />

        {/* Khung ảnh chính */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-purple-50 shadow-inner group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photoAlt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />

          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-in-out pointer-events-none z-10" />

          <div className="absolute inset-0 bg-purple-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-purple-700 text-xs font-bold shadow-lg shadow-purple-200/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>Xem ảnh ✨</span>
            </span>
          </div>

          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs pointer-events-none group-hover:scale-110 transition-transform">
            <Sparkles className="w-3.5 h-3.5 fill-purple-400 text-purple-500" />
          </div>

          <button
            type="button"
            onClick={handleMiniHeartReaction}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-purple-500 flex items-center justify-center shadow-md hover:scale-115 active:scale-90 transition-all z-20 cursor-pointer opacity-0 group-hover:opacity-100"
            title="Thả tim cho bức ảnh 💕"
          >
            <Heart className="w-3.5 h-3.5 fill-purple-500 text-purple-500" />
          </button>
        </div>

        <div className="flex items-center justify-center pt-2 pb-0.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-300/80 fill-purple-200/60" />
        </div>
      </motion.div>
    );
  }

  // Style 2: Butter Daisy Sunshine (Vàng bơ & Hoa cúc tươi tắn)
  if (frameStyle === 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: tilt }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
        whileHover={{ scale: 1.06, rotate: 0, y: -8, zIndex: 30 }}
        whileTap={{ scale: 0.97 }}
        className="group relative bg-gradient-to-b from-[#fffefc] via-[#fffdf5] to-[#fef8eb] p-2.5 sm:p-3 pb-3 sm:pb-3.5 rounded-3xl border-2 border-amber-200/80 shadow-md shadow-amber-200/35 hover:shadow-2xl hover:shadow-amber-300/50 cursor-pointer transition-all"
        onClick={onOpen}
      >
        <RenderFastener index={index} />

        {/* Khung ảnh chính */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-amber-50 shadow-inner group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photoAlt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />

          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-in-out pointer-events-none z-10" />

          <div className="absolute inset-0 bg-amber-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-amber-700 text-xs font-bold shadow-lg shadow-amber-200/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Xem ảnh ✨</span>
            </span>
          </div>

          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs pointer-events-none group-hover:scale-110 transition-transform">
            <Flower2 className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <button
            type="button"
            onClick={handleMiniHeartReaction}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-amber-500 flex items-center justify-center shadow-md hover:scale-115 active:scale-90 transition-all z-20 cursor-pointer opacity-0 group-hover:opacity-100"
            title="Thả tim cho bức ảnh 💕"
          >
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          </button>
        </div>

        <div className="flex items-center justify-center pt-2 pb-0.5">
          <Flower2 className="w-3.5 h-3.5 text-amber-300/80" />
        </div>
      </motion.div>
    );
  }

  // Style 3: Minty Clover & Heart (Bạc hà may mắn & Kẹo ngọt)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ scale: 1.06, rotate: 0, y: -8, zIndex: 30 }}
      whileTap={{ scale: 0.97 }}
      className="group relative bg-gradient-to-b from-[#fcfffd] via-[#f5fbf7] to-[#eef9f2] p-2.5 sm:p-3 pb-3 sm:pb-3.5 rounded-3xl border-2 border-emerald-200/80 shadow-md shadow-emerald-200/35 hover:shadow-2xl hover:shadow-emerald-300/50 cursor-pointer transition-all"
      onClick={onOpen}
    >
      <RenderFastener index={index} />

      {/* Khung ảnh chính */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-emerald-50 shadow-inner group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photoAlt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />

        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-in-out pointer-events-none z-10" />

        <div className="absolute inset-0 bg-emerald-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-emerald-700 text-xs font-bold shadow-lg shadow-emerald-200/50 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xem ảnh ✨</span>
          </span>
        </div>

        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs pointer-events-none group-hover:scale-110 transition-transform">
          <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-500" />
        </div>

        <button
          type="button"
          onClick={handleMiniHeartReaction}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-emerald-500 flex items-center justify-center shadow-md hover:scale-115 active:scale-90 transition-all z-20 cursor-pointer opacity-0 group-hover:opacity-100"
          title="Thả tim cho bức ảnh 💕"
        >
          <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
        </button>
      </div>

      <div className="flex items-center justify-center pt-2 pb-0.5">
        <Heart className="w-3.5 h-3.5 text-emerald-300/80 fill-emerald-200/60" />
      </div>
    </motion.div>
  );
}

/* =========================================================================
   COMPONENT CHÍNH: CELEBRATION CARD
   ========================================================================= */

export function CelebrationCard({
  photos,
  recipientName,
  senderName,
  onBackToUpload,
}: CelebrationCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Danh sách ảnh cho Lightbox trình chiếu
  const lightboxItems: LightboxItem[] = photos.map((p) => ({
    id: p.id,
    url: p.url,
    name: "",
    timestamp: p.timestamp || 0,
  }));

  const getTiltAngle = (index: number) => {
    const tilts = [-2.5, 2.2, -1.8, 2.6, -2.1, 1.7, -2.4, 1.9];
    return tilts[index % tilts.length];
  };

  const handleOpenPhoto = (index: number) => {
    playBubblePop(1.1);
    setLightboxIndex(index);
  };

  const handleStartSlideshow = () => {
    if (photos.length === 0) return;
    playSparkleSound();
    setLightboxIndex(0);
  };

  return (
    <div className="relative min-h-screen py-16 px-4 max-w-6xl mx-auto z-20">
      {/* Thanh điều hướng nhanh phía trên */}
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <motion.button
          type="button"
          onClick={() => {
            playBubblePop(0.9);
            onBackToUpload();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-700 bg-white/95 hover:bg-white backdrop-blur-md px-4 py-2.5 rounded-full border border-rose-200/90 shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>Quay lại đổi tên & chọn thêm ảnh</span>
        </motion.button>

        {photos.length > 0 && (
          <motion.button
            type="button"
            onClick={handleStartSlideshow}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 px-5 py-2.5 rounded-full shadow-lg shadow-rose-300/60 transition-all cursor-pointer ring-4 ring-rose-200"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Trình chiếu kỷ niệm ({photos.length} ảnh)</span>
          </motion.button>
        )}
      </div>

      {/* 1. TẤM THIỆP CHÚC MỪNG CHÍNH (CELEBRATION CARD) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-12 border-2 border-rose-200 shadow-2xl shadow-rose-300/40 text-center max-w-4xl mx-auto overflow-hidden"
      >
        {/* Ánh sáng trang trí lãng mạn */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-300/30 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-300/30 to-transparent rounded-tr-full pointer-events-none" />

        {/* Đóa hoa nhỏ trang trí ở đỉnh thiệp */}
        <div className="flex justify-center -mt-4 mb-2">
          <BloomingFlower size="sm" autoBloom={true} showBadge={false} />
        </div>

        {/* Huy hiệu 20/10 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold mb-4 border border-rose-300 shadow-xs">
          <Gift className="w-4 h-4 text-rose-500" />
          <span>{siteConfig.event.date} • {recipientName ? `Dành tặng ${recipientName}` : siteConfig.event.tag}</span>
        </div>

        {/* Tiêu đề viết tay lấp lánh ánh kim */}
        <h1 className="font-handwriting text-4xl sm:text-6xl md:text-7xl font-bold mb-3 drop-shadow-xs shimmer-text">
          {siteConfig.event.title}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-rose-900/80 max-w-2xl mx-auto mb-8 font-sans">
          {recipientName
            ? `Dành tặng ${recipientName} — đóa hoa ngát hương và rạng rỡ nhất trong cuộc đời`
            : siteConfig.event.subtitle}
        </p>

        {/* Khung lời chúc gõ chữ (Typewriter Box) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/70 to-rose-50/90 border-2 border-rose-200/90 shadow-inner max-w-2xl mx-auto mb-10 relative">
          <div className="text-xs uppercase tracking-widest text-rose-500 font-bold mb-3 flex items-center justify-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>Thông điệp yêu thương</span>
            <Star className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          </div>
          <Typewriter wishes={siteConfig.typewriterWishes} />
        </div>

        {/* 3 Thẻ phẩm chất tôn vinh phái đẹp */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto mb-6">
          {siteConfig.cards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-rose-200 hover:border-rose-400 transition-all shadow-sm group cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 mb-3 shadow-inner group-hover:scale-110 transition-transform">
                {idx === 0 && <Sparkles className="w-5 h-5 text-rose-500" />}
                {idx === 1 && <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />}
                {idx === 2 && <Sun className="w-5 h-5 text-rose-500" />}
              </div>
              <h4 className="font-bold text-rose-900 text-base mb-1">{card.title}</h4>
              <p className="text-xs text-rose-800/80 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 2. GÓC KỶ NIỆM YÊU THƯƠNG: BẢNG SCRAPBOOK KỶ NIỆM LÃNG MẠN */}
      <div className="mt-20 relative">
        {/* Khung Bảng Kỷ Niệm Scrapbook bo tròn siêu xinh xắn */}
        <div className="relative bg-white/85 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-10 md:p-12 border-2 border-rose-200/90 shadow-2xl shadow-rose-300/30 overflow-hidden text-center">
          {/* 4 Miếng băng dính Washi Tape đính 4 góc bảng */}
          <div className="washi-tape-pink absolute -top-3.5 -left-3.5 w-20 h-6 -rotate-45 pointer-events-none z-10" />
          <div className="washi-tape-gold absolute -top-3.5 -right-3.5 w-20 h-6 rotate-45 pointer-events-none z-10" />
          <div className="washi-tape-gold absolute -bottom-3.5 -left-3.5 w-20 h-6 rotate-45 pointer-events-none z-10" />
          <div className="washi-tape-pink absolute -bottom-3.5 -right-3.5 w-20 h-6 -rotate-45 pointer-events-none z-10" />

          {/* Vầng sáng êm dịu góc bảng */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-pink-200/30 via-rose-100/20 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-rose-200/30 via-pink-100/20 to-transparent rounded-tr-full pointer-events-none" />

          {/* Dây đèn đom đóm Fairy Lights lung linh */}
          <FairyLightsGarland />

          {/* Huy hiệu Góc Kỷ Niệm */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 text-rose-700 text-xs sm:text-sm font-bold mb-3 border border-rose-300 shadow-xs">
            <Camera className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Góc Kỷ Niệm Yêu Thương 🌸</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          {/* Tiêu đề viết tay lấp lánh */}
          <h2 className="font-handwriting text-4xl sm:text-5xl md:text-6xl text-rose-800 font-bold mb-3 shimmer-text">
            {siteConfig.gallery.title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-rose-900/80 max-w-xl mx-auto mb-8 leading-relaxed font-sans">
            {photos.length > 0
              ? `Nơi lưu giữ ${photos.length} khoảnh khắc rạng rỡ và ngọt ngào nhất ${recipientName ? `của ${recipientName}` : ""}. Chạm vào ảnh để phóng to hoặc thưởng thức trình chiếu kỷ niệm nhé 💕`
              : "Chưa có ảnh nào được tải lên. Hãy chọn những bức ảnh xinh xắn để tạo nên album kỷ niệm đáng yêu nhé!"}
          </p>

          {/* Thanh công cụ Album */}
          {photos.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
              <motion.button
                type="button"
                onClick={handleStartSlideshow}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-300/60 hover:shadow-rose-400/80 transition-all cursor-pointer ring-4 ring-rose-200"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu trình chiếu ({photos.length} ảnh) ✨</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  playBubblePop(0.9);
                  onBackToUpload();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-xs sm:text-sm text-rose-700 bg-white/95 hover:bg-white border border-rose-300 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-rose-500" />
                <span>Thêm ảnh mới 🌸</span>
              </motion.button>
            </div>
          )}

          {/* LƯỚI ẢNH PASTEL DỄ THƯƠNG */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 max-w-6xl mx-auto px-2">
              {photos.map((photo, index) => {
                const tilt = getTiltAngle(index);

                return (
                  <PhotoCardView
                    key={photo.id}
                    photo={photo}
                    index={index}
                    tilt={tilt}
                    onOpen={() => handleOpenPhoto(index)}
                  />
                );
              })}

              {/* THẺ "+ THÊM KỶ NIỆM MỚI" Ở CUỐI LƯỚI */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.06, y: -6 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playBubblePop(0.9);
                  onBackToUpload();
                }}
                className="relative p-5 rounded-3xl border-2 border-dashed border-rose-300/90 hover:border-rose-400 bg-white/80 hover:bg-rose-50/80 backdrop-blur-xs transition-all cursor-pointer flex flex-col items-center justify-center text-center aspect-square shadow-sm hover:shadow-lg hover:shadow-rose-200/40 group"
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                  <FastenerRibbonBow />
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200 shadow-inner flex items-center justify-center text-rose-500 mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Plus className="w-7 h-7 text-rose-500" />
                </div>
                <h4 className="font-handwriting text-2xl text-rose-800 font-bold mb-1">
                  Thêm Ảnh Mới 🌸
                </h4>
                <p className="text-[11px] text-rose-500/80 font-medium">
                  Gửi thêm khoảnh khắc đáng yêu
                </p>
              </motion.div>
            </div>
          ) : (
            /* Khối hiển thị mời tải ảnh siêu cute khi chưa có ảnh */
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative max-w-lg mx-auto p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-rose-200/90 shadow-xl shadow-rose-200/30 text-center"
            >
              {/* Biểu tượng camera & trái tim lung linh */}
              <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-rose-200 to-pink-200 animate-pulse blur-sm" />
                <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-300/50">
                  <Camera className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              <h3 className="font-handwriting text-3xl sm:text-4xl text-rose-800 font-bold mb-2">
                Góc Kỷ Niệm Đang Chờ Bạn 🌸
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
                Hãy tải lên những tấm hình rạng rỡ của người phụ nữ bạn yêu thương để cùng nhau lưu giữ khoảnh khắc ngọt ngào nhé!
              </p>

              <motion.button
                type="button"
                onClick={() => {
                  playBubblePop(1);
                  onBackToUpload();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-300/50 hover:shadow-rose-400/70 transition-all cursor-pointer ring-4 ring-rose-200"
              >
                <Camera className="w-4 h-4" />
                <span>Tải ảnh kỷ niệm ngay ✨</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox xem ảnh lớn & Trình chiếu điện ảnh */}
      <Lightbox
        items={lightboxItems}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      {/* Lời kết trang web */}
      <FooterSection senderName={senderName} />
    </div>
  );
}
