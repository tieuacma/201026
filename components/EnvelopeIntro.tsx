"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Send, ArrowDown } from "lucide-react";
import { siteConfig } from "@/config/site";

interface EnvelopeIntroProps {
  onOpenLetter?: () => void;
}

export function EnvelopeIntro({ onOpenLetter }: EnvelopeIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const triggerConfetti = () => {
    // Bắn confetti pháo giấy tông màu hồng pastel, vàng kim và trắng
    const colors = ["#f43f5e", "#fb7185", "#fda4af", "#fbbf24", "#ffffff", "#e11d48"];

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors,
      });
    }, 250);
  };

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    triggerConfetti();

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      if (onOpenLetter) onOpenLetter();
    }, 900);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-12 select-none overflow-hidden">
      {/* Huy hiệu nhỏ phía trên */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-300/80 shadow-xs text-rose-700 text-xs sm:text-sm font-medium backdrop-blur-xs"
      >
        <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: "6s" }} />
        <span>{siteConfig.event.tag}</span>
      </motion.div>

      {/* Vỏ bọc Phong bì thư tương tác */}
      <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/3] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.6 }}
              onClick={handleOpen}
              className="relative w-full h-full cursor-pointer group"
              role="button"
              tabIndex={0}
              aria-label="Nhấn để mở phong bì thư chúc mừng 20/10"
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
            >
              {/* Thân phong bì */}
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 envelope-shadow border-2 border-rose-200/80 overflow-hidden flex flex-col justify-between p-6 transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Họa tiết tem thư cổ điển */}
                <div className="flex justify-between items-start">
                  <div className="border border-dashed border-rose-300/80 rounded-lg p-2.5 bg-white/70 shadow-xs backdrop-blur-xs">
                    <p className="text-[10px] text-rose-500 font-semibold tracking-wider uppercase">VIETNAM POST</p>
                    <p className="text-xs font-bold text-rose-700 font-mono">{siteConfig.letter.stampText}</p>
                    <p className="text-[9px] text-rose-400">Special 20.10</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-rose-300/60 bg-rose-200/40 flex items-center justify-center">
                    <Send className="w-5 h-5 text-rose-500 transform -rotate-12" />
                  </div>
                </div>

                {/* Dòng chữ gửi người nhận */}
                <div className="text-center my-auto px-4">
                  <p className="text-xs uppercase tracking-widest text-rose-500 font-medium mb-1">
                    Trân trọng gửi đến
                  </p>
                  <h2 className="font-handwriting text-3xl sm:text-4xl text-rose-800 font-bold drop-shadow-xs">
                    {siteConfig.recipient.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-600/90 mt-1 italic">
                    {siteConfig.sender.name}
                  </p>
                </div>

                {/* Con dấu sáp niêm phong trái tim ở giữa nắp thư */}
                <div className="flex flex-col items-center justify-center mt-2">
                  <motion.div
                    animate={isOpening ? { scale: [1, 1.3, 0], rotate: 45 } : { scale: [1, 1.08, 1] }}
                    transition={isOpening ? { duration: 0.5 } : { repeat: Infinity, duration: 2.2 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 shadow-lg flex items-center justify-center border-2 border-amber-200/80 cursor-pointer group-hover:shadow-rose-400/50"
                  >
                    <Heart className="w-7 h-7 text-white fill-white drop-shadow-xs" />
                  </motion.div>
                  <p className="text-xs sm:text-sm text-rose-700 font-medium mt-3 flex items-center gap-1.5 animate-pulse">
                    <span>{siteConfig.letter.callToAction}</span>
                  </p>
                </div>

                {/* Đường gập nắp phong bì mô phỏng */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-1/2 border-b border-rose-200/70 pointer-events-none origin-top"
                  animate={isOpening ? { rotateX: -160, opacity: 0 } : { rotateX: 0 }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            </motion.div>
          ) : (
            /* Lá thư đã mở bung ra trang trọng */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative w-full rounded-2xl bg-gradient-to-b from-[#fffefc] to-[#fff8f8] shadow-2xl border-2 border-rose-200/90 p-6 sm:p-8 md:p-10 text-gray-800"
            >
              {/* Huy hiệu trên góc lá thư */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-rose-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
                  {siteConfig.letter.badge}
                </span>
                <span className="font-handwriting text-2xl text-rose-600 font-bold">20 Tháng 10</span>
              </div>

              {/* Lời mở đầu thư */}
              <h3 className="font-handwriting text-2xl sm:text-3xl text-rose-700 font-bold mb-4">
                {siteConfig.letter.greeting}
              </h3>

              {/* Nội dung các đoạn thư */}
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed text-gray-700">
                {siteConfig.letter.paragraphs.map((p, idx) => (
                  <p key={idx} className="indent-4">
                    {p}
                  </p>
                ))}
              </div>

              {/* Chữ ký người gửi */}
              <div className="mt-6 pt-4 border-t border-rose-100 flex flex-col items-end">
                <p className="text-xs sm:text-sm text-gray-500">{siteConfig.sender.name}</p>
                <p className="font-handwriting text-xl sm:text-2xl text-rose-700 font-bold mt-1">
                  {siteConfig.sender.signature}
                </p>
              </div>

              {/* Nút cuộn xuống xem tiếp */}
              <div className="mt-6 flex justify-center">
                <a
                  href="#wishes-section"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-100/70 hover:bg-rose-100 px-4 py-2 rounded-full transition-all"
                >
                  <span>Khám phá thêm lời chúc & kỷ niệm</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
