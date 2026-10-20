"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Sparkles,
  Maximize2,
  Minimize2,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { playBubblePop, playSparkleSound, playPaperSlideSound } from "@/lib/soundEffects";

export interface LightboxItem {
  id: string;
  url: string;
  name: string;
  timestamp: number;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const SLIDE_DURATION = 3800; // Thời gian mỗi ảnh trình chiếu (ms)

export const SWEET_CAPTIONS = [
  "Khoảnh khắc ngọt ngào 🌸",
  "Nụ cười tỏa nắng ☀️",
  "Dịu dàng & Đáng yêu 💕",
  "Ánh mắt rạng ngời ✨",
  "Đóa hoa xinh đẹp nhất 🌷",
  "Bình yên & Hạnh phúc 🌿",
  "Thanh xuân rực rỡ 💖",
  "Mãi luôn tươi vui 🎀",
  "Khoảnh khắc đáng nhớ 📸",
  "Nàng thơ tuyệt vời 💐",
  "Yêu thương đong đầy 🌹",
  "Rạng rỡ như ban mai 🌼",
  "Xinh xắn & Ngọt ngào 🍬",
  "Nụ cười thiên thần 🕊️",
  "Trọn vẹn yêu thương 💌",
  "Kỷ niệm ngọt ngào 🧁",
];

export function getSweetCaption(index: number, _name?: string): string {
  return SWEET_CAPTIONS[index % SWEET_CAPTIONS.length];
}

export function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const touchStartXRef = useRef<number | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Đồng bộ trạng thái khi prop isOpen thay đổi
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setIsPlayingSlideshow(false);
      setProgress(0);
    }
  }

  const total = items.length;
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    playPaperSlideSound();
    setProgress(0);
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    playPaperSlideSound();
    setProgress(0);
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  // Phím tắt bàn phím: Esc (đóng), Mũi tên trái/phải, Phím cách (bật/tắt slideshow), F (toàn màn hình)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlayingSlideshow((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Bộ đếm thời gian mượt mà cho thanh tiến trình Slideshow
  useEffect(() => {
    if (!isOpen || !isPlayingSlideshow || total <= 1) {
      setProgress(0);
      return;
    }

    const intervalTime = 40; // cập nhật mỗi 40ms
    let elapsed = 0;

    progressTimerRef.current = setInterval(() => {
      elapsed += intervalTime;
      if (elapsed >= SLIDE_DURATION) {
        elapsed = 0;
        handleNext();
        return;
      }
      setProgress((elapsed / SLIDE_DURATION) * 100);
    }, intervalTime);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isOpen, isPlayingSlideshow, total, handleNext]);

  // Toàn màn hình (Fullscreen API)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Thả tim tương tác cho bức ảnh kỷ niệm
  const handleHeartReaction = () => {
    playBubblePop(1.3);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#f43f5e", "#fda4af", "#fb7185", "#fbbf24"],
    });
  };

  // Xử lý vuốt chuyển ảnh trên màn hình cảm ứng
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;

    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/92 backdrop-blur-xl select-none overflow-hidden"
        onClick={onClose}
      >
        {/* HÀO QUANG NỀN ĐỘNG (Ambient Blurred Backlight): Lấy màu ảnh hiện tại làm vầng sáng nền rực rỡ */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentItem.url}
            alt=""
            className="w-full h-full object-cover blur-3xl opacity-30 scale-125 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* 1. THANH CÔNG CỤ ĐIỀU KHIỂN PHÍA TRÊN (TOP BAR) */}
        <div
          className="relative w-full px-4 sm:px-8 pt-4 pb-3 flex items-center justify-between text-white z-20 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Huy hiệu số thứ tự & Tên ảnh kỷ niệm */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-rose-200 shadow-sm">
              <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>
                {currentIndex + 1} / {total}
              </span>
            </span>
            {currentItem.name ? (
              <div className="hidden sm:block">
                <h4 className="font-handwriting text-xl sm:text-2xl text-rose-200 font-bold drop-shadow-sm">
                  {currentItem.name}
                </h4>
              </div>
            ) : null}
          </div>

          {/* Các nút hành động chính: Slideshow, Fullscreen, Đóng */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Nút bật/tắt trình chiếu tự động */}
            {total > 1 && (
              <button
                type="button"
                onClick={() => {
                  playSparkleSound();
                  setIsPlayingSlideshow((prev) => !prev);
                }}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-md cursor-pointer border ${
                  isPlayingSlideshow
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-300 ring-2 ring-rose-300/60"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/15"
                }`}
                title={isPlayingSlideshow ? "Tạm dừng trình chiếu (Phím cách)" : "Bật trình chiếu tự động (Phím cách)"}
              >
                {isPlayingSlideshow ? (
                  <Pause className="w-3.5 h-3.5 fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                <span>{isPlayingSlideshow ? "Tạm dừng" : "Trình chiếu"}</span>
              </button>
            )}

            {/* Nút Toàn màn hình */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer border border-white/15 hidden sm:flex"
              title={isFullscreen ? "Thoát toàn màn hình (F)" : "Xem toàn màn hình (F)"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Nút Đóng */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-rose-500 text-white transition-all cursor-pointer border border-white/20 hover:scale-105"
              title="Đóng trình chiếu (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* THANH TIẾN TRÌNH SLIDESHOW (PROGRESS BAR) */}
        {isPlayingSlideshow && (
          <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-30">
            <div
              className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* 2. VÙNG HIỂN THỊ ẢNH CHÍNH & NÚT ĐIỀU HƯỚNG */}
        <div
          className="relative flex-1 w-full flex items-center justify-center px-4 sm:px-16 my-auto"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Nút Lùi ảnh (Trái) */}
          {total > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-rose-500/90 text-white backdrop-blur-md transition-all hover:scale-110 shadow-xl z-20 cursor-pointer border border-white/20 group"
              title="Ảnh trước (Mũi tên trái)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Khung ảnh Polaroid điện ảnh với hiệu ứng Ken Burns mượt mà */}
          <div className="relative max-w-4xl max-h-[68vh] sm:max-h-[72vh] flex items-center justify-center p-2 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentItem.id}
                src={currentItem.url}
                alt={currentItem.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: isPlayingSlideshow ? 1.04 : 1,
                }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: isPlayingSlideshow ? 4 : 0.4, ease: "easeOut" },
                }}
                className="max-w-full max-h-[64vh] sm:max-h-[68vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
              />
            </AnimatePresence>

            {/* Nút thả tim tương tác góc ảnh */}
            <motion.button
              type="button"
              onClick={handleHeartReaction}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-5 right-5 p-3 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white shadow-xl cursor-pointer ring-4 ring-rose-200/50 backdrop-blur-md flex items-center gap-1.5 z-20"
              title="Thả tim cho kỷ niệm này ❤️"
            >
              <Heart className="w-5 h-5 fill-white text-white drop-shadow-xs" />
            </motion.button>
          </div>

          {/* Nút Tiến ảnh (Phải) */}
          {total > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-6 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-rose-500/90 text-white backdrop-blur-md transition-all hover:scale-110 shadow-xl z-20 cursor-pointer border border-white/20 group"
              title="Ảnh tiếp theo (Mũi tên phải)"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* 3. DẢI THUMBNAIL THU NHỎ & CHÚ THÍCH Ở ĐÁY (BOTTOM STRIP) */}
        <div
          className="relative w-full max-w-4xl px-4 pb-4 pt-2 flex flex-col items-center gap-2 z-20 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Tên ảnh nếu có trên mobile */}
          {currentItem.name ? (
            <div className="text-center sm:hidden">
              <h4 className="font-handwriting text-xl text-rose-200 font-bold drop-shadow-sm">
                {currentItem.name}
              </h4>
            </div>
          ) : null}

          {/* Dải ảnh thu nhỏ cuộn ngang mượt mà */}
          {total > 1 && (
            <div className="w-full flex items-center justify-center gap-2 overflow-x-auto py-1 px-2 no-scrollbar">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playBubblePop(1.1);
                    setProgress(0);
                    onNavigate(idx);
                  }}
                  className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden transition-all duration-300 border-2 cursor-pointer ${
                    idx === currentIndex
                      ? "border-rose-400 scale-110 shadow-lg shadow-rose-500/50 ring-2 ring-white"
                      : "border-white/30 opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Hướng dẫn phím tắt tiện lợi */}
          <p className="text-[11px] text-white/50 tracking-wider hidden sm:block">
            ← → Chuyển ảnh • Phím cách: Trình chiếu tự động • F: Toàn màn hình • Esc: Đóng
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
