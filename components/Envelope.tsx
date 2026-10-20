"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Sparkles,
  Send,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  Flower2,
  Image as ImageIcon,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { BloomingFlower } from "@/components/BloomingFlower";
import {
  playSealPopSound,
  playPaperSlideSound,
  playPaperFoldSound,
  playCuteChime,
  playSparkleSound,
} from "@/lib/soundEffects";

interface EnvelopeProps {
  photoCount: number;
  recipientName?: string;
  onOpenComplete: () => void;
  onBackToUpload?: () => void;
}

type EnvelopeStage =
  | "closed"
  | "unsealing"
  | "flap-opening"
  | "letter-sliding"
  | "letter-unfolded"
  | "bloomed"
  | "closing";

export function Envelope({
  photoCount,
  recipientName,
  onOpenComplete,
  onBackToUpload,
}: EnvelopeProps) {
  const [animStage, setAnimStage] = useState<EnvelopeStage>("closed");
  const [flapZIndex, setFlapZIndex] = useState<number>(35);
  const [sealParticles, setSealParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      scale: number;
      rotate: number;
      isHeart: boolean;
      color: string;
    }[]
  >([]);

  const isFlapOpen =
    animStage === "flap-opening" ||
    animStage === "letter-sliding" ||
    animStage === "letter-unfolded" ||
    animStage === "bloomed";

  const isLetterSliding = animStage === "letter-sliding";
  const isUnfolded = animStage === "letter-unfolded" || animStage === "bloomed";
  const isBloomed = animStage === "bloomed";

  const triggerConfettiCannons = () => {
    const colors = ["#f43f5e", "#fb7185", "#fda4af", "#fbbf24", "#ffffff", "#f472b6", "#e11d48"];

    // Pháo giấy bung nở giữa màn hình
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.55 },
      colors,
    });

    // Pháo hai bên góc bắn chéo lãng mạn
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.65 },
        colors,
      });
    }, 250);
  };

  const handleStartOpen = () => {
    if (animStage !== "closed") return;

    // 1. Phá vỡ con dấu sáp
    setAnimStage("unsealing");
    playSealPopSound();

    // Tạo các mảnh pháo tim & sao li ti bắn ra từ con dấu sáp
    const particles = Array.from({ length: 14 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.3;
      const dist = 60 + Math.random() * 45;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 15,
        scale: Math.random() * 0.4 + 0.8,
        rotate: (Math.random() - 0.5) * 120,
        isHeart: i % 2 === 0,
        color: ["#f43f5e", "#fb7185", "#fda4af", "#fbbf24", "#ffffff"][i % 5],
      };
    });
    setSealParticles(particles);

    // 2. Nắp phong bì mở lật ngược lên trong không gian 3D
    setTimeout(() => {
      setAnimStage("flap-opening");
    }, 380);

    // 3. Khi nắp đã lật qua phương thẳng đứng (90 độ), chuyển z-index nắp ra phía sau bao thư
    setTimeout(() => {
      setFlapZIndex(5);
    }, 720);

    // 4. Lá thư trượt lên từ từ từ bên trong túi phong bì (vẫn ở z-16, được che bởi nắp trước z-25)
    setTimeout(() => {
      setAnimStage("letter-sliding");
      playPaperSlideSound();
    }, 1100);

    // 5. Khi thư đã nhô ra khỏi miệng túi, chuyển z-index sang 45 và mở bung lá thư
    setTimeout(() => {
      setAnimStage("letter-unfolded");
    }, 1900);

    // 6. Đóa hoa bung nở rực rỡ và pháo hoa giấy bắn mừng
    setTimeout(() => {
      setAnimStage("bloomed");
      triggerConfettiCannons();
    }, 2400);
  };

  const handleReset = () => {
    if (animStage === "closed" || animStage === "closing") return;
    setAnimStage("closing");
    playPaperFoldSound();

    setTimeout(() => {
      setAnimStage("closed");
      setFlapZIndex(35);
      setSealParticles([]);
      playCuteChime();
    }, 750);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-8 select-none z-20 overflow-x-hidden">
      {/* Nút quay lại đổi tên & ảnh nếu cần */}
      {onBackToUpload && animStage === "closed" && (
        <motion.button
          type="button"
          onClick={onBackToUpload}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-rose-700 font-semibold bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-full border border-rose-300 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
          <span>Đổi tên & chọn thêm ảnh</span>
        </motion.button>
      )}

      {/* Gợi ý tương tác: Tự động ẩn mượt mà khi người dùng bắt đầu mở thư để không đè vào đỉnh lá thư */}
      <AnimatePresence>
        {animStage === "closed" && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 text-rose-700 text-xs sm:text-sm font-semibold border-2 border-rose-200/90 shadow-lg shadow-rose-200/50 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: "5s" }} />
            <span>Chạm vào con dấu sáp trái tim để mở phong thư 💌</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KHUNG PHONG BÌ 3D VẬT LÝ CHÂN THỰC (Realistic 3D Envelope Container) */}
      <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl perspective-1200 flex flex-col items-center">
        {/* Vầng hào quang lung linh phía sau phong bì */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-300/30 via-pink-200/25 to-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Vỏ bao phong thư vật lý */}
        <motion.div
          animate={{
            y: isUnfolded ? 45 : 0,
            scale: isUnfolded ? 0.95 : 1,
            opacity: isUnfolded ? 0.88 : 1,
          }}
          transition={{ duration: 0.8, ease: [0.34, 1.25, 0.64, 1] }}
          className="relative w-full aspect-[16/10] sm:aspect-[16/10]"
        >
          {/* LỚP 1: ĐÁY PHONG BÌ VÀ MẶT TRONG TÚI THƯ (Back Panel & Pocket Lining - z-10) */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ffe5ec] via-[#fed8e1] to-[#fecdd3] border-2 border-rose-300 shadow-2xl shadow-rose-300/30 z-10 overflow-hidden">
            {/* Họa tiết lụa hoa chìm bên trong bao thư */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-rose-400 font-semibold tracking-widest uppercase">
              <Flower2 className="w-3 h-3 text-rose-400" />
              <span>Special Gift for 20-10</span>
              <Flower2 className="w-3 h-3 text-rose-400" />
            </div>
          </div>

          {/* LỚP 2: LÁ THƯ TỌA LẠC BÊN TRONG (The Letter Paper - z-16 khi ở trong túi, z-45 khi đã bay ra) */}
          <motion.div
            initial={false}
            animate={
              isUnfolded
                ? {
                    y: -120,
                    scale: 1,
                    opacity: 1,
                  }
                : isLetterSliding
                ? {
                    y: -220,
                    scale: 0.98,
                    opacity: 1,
                  }
                : {
                    y: 0,
                    scale: 0.96,
                    opacity: animStage === "closing" ? 0.85 : 1,
                  }
            }
            transition={{
              duration: isUnfolded ? 0.7 : 0.8,
              ease: isUnfolded ? [0.34, 1.25, 0.64, 1] : [0.22, 1, 0.36, 1],
            }}
            style={{
              zIndex: isUnfolded ? 45 : 16,
            }}
            className={`absolute inset-x-3 sm:inset-x-6 top-3 transition-shadow duration-500 ${
              isUnfolded
                ? "rounded-3xl bg-gradient-to-b from-[#fffefc] via-[#fffbf9] to-[#fff5f5] border-2 border-rose-300 shadow-2xl p-5 sm:p-7 md:p-8 text-gray-800"
                : "h-[86%] rounded-2xl bg-gradient-to-b from-[#fffcf8] to-[#fff3f3] border-2 border-rose-200/90 shadow-md p-4 flex flex-col items-center justify-center text-center overflow-hidden"
            }`}
          >
            {/* KHI THƯ ĐANG GẤP GỌN BÊN TRONG TÚI HOẶC ĐANG TRƯỢT LÊN */}
            {!isUnfolded && (
              <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
                {/* Băng dính Washi mini ở đỉnh lá thư gấp */}
                <div className="washi-tape-pink absolute -top-1 px-4 py-0.5 rounded-xs text-[9px] text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>Letter • 20/10</span>
                </div>

                {/* Viền hoa văn thư cổ điển */}
                <div className="absolute inset-1 rounded-xl border border-dashed border-rose-200 pointer-events-none" />

                {/* Chỉ hiển thị họa tiết trang trí khi đang trượt lên, không hiển thị chữ làm lộ qua mép phong bì khi đóng */}
                {isLetterSliding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-100/80 border border-rose-200 flex items-center justify-center mb-2 shadow-inner">
                      <Flower2 className="w-6 h-6 text-rose-500 animate-pulse" />
                    </div>
                    <p className="font-handwriting text-2xl text-rose-800 font-bold">
                      Thư Gửi {recipientName || siteConfig.recipient.name}
                    </p>
                    <p className="text-[11px] text-rose-500 font-medium italic mt-0.5">
                      Đang mở lời yêu thương...
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* KHI THƯ ĐÃ MỞ BUNG RA TOÀN DIỆN (UNFOLDED & BLOOMED) */}
            {isUnfolded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* 2 Miếng băng keo Washi Tape dán 2 góc thư trên phong cách Scrapbook */}
                <div className="washi-tape-pink absolute -top-8 -left-3 sm:-left-5 w-20 h-6 -rotate-12 rounded-xs pointer-events-none flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400 opacity-80" />
                </div>
                <div className="washi-tape-gold absolute -top-8 -right-3 sm:-right-5 w-20 h-6 rotate-12 rounded-xs pointer-events-none flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 opacity-80" />
                </div>

                {/* Viền hoa văn thư cổ điển sang trọng */}
                <div className="absolute inset-1.5 sm:inset-2 rounded-2xl border border-dashed border-rose-200/90 pointer-events-none" />

                {/* 1. HIỆU ỨNG ĐÓA HOA HỒNG NỞ RA RỰC RỠ & CUTE NHẤT */}
                <div className="my-1 sm:my-2">
                  <BloomingFlower
                    size="md"
                    autoBloom={true}
                    showBadge={false}
                  />
                </div>

                {/* Huy hiệu ngày lễ 20/10 với ánh sao vàng */}
                <div className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 text-rose-700 text-xs font-bold border border-rose-300/80 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>20 Tháng 10 • {recipientName ? `Dành tặng ${recipientName}` : "Ngày Phụ Nữ Việt Nam"}</span>
                  <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                </div>

                {/* Lời chào trân trọng viết tay bay bổng */}
                <h3 className="font-handwriting text-3xl sm:text-4xl text-rose-800 font-bold mt-2.5 mb-2 drop-shadow-xs">
                  {recipientName ? `Thân gửi ${recipientName},` : siteConfig.letter.greeting}
                </h3>

                {/* Khung trích dẫn yêu thương ngọt ngào */}
                <div className="my-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-50/90 via-pink-50/80 to-rose-50/90 border border-rose-200/80 shadow-2xs text-center max-w-md mx-auto">
                  <p className="font-handwriting text-lg sm:text-xl text-rose-800 font-bold">
                    &ldquo;{recipientName || "Bạn"} là đóa hoa xinh đẹp, dịu dàng và quý giá nhất của cuộc đời này! 🌸&rdquo;
                  </p>
                </div>

                {/* Nội dung các đoạn thư yêu thương */}
                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed max-w-lg mx-auto px-2 my-2">
                  {siteConfig.letter.paragraphs.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-justify sm:text-left">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-300 shrink-0 mt-1" />
                      <p className="leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>

                {/* Chữ ký người gửi & Dấu son trái tim đỏ thắm */}
                <div className="mt-4 pt-3 border-t border-rose-100 w-full flex items-center justify-between px-2 sm:px-6">
                  {/* Con dấu son gửi từ trái tim */}
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[11px] sm:text-xs font-bold text-rose-600 shadow-2xs">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                    <span>Đóng dấu gửi từ trái tim</span>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium">{siteConfig.sender.name}</p>
                    <p className="font-handwriting text-2xl sm:text-3xl text-rose-700 font-bold">
                      {siteConfig.sender.signature}
                    </p>
                  </div>
                </div>

                {/* Các nút hành động: Khám phá tiếp & Gấp thư lại */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <motion.button
                    type="button"
                    onClick={() => {
                      playSparkleSound();
                      onOpenComplete();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-300/60 hover:shadow-rose-400/80 transition-all cursor-pointer ring-4 ring-rose-200"
                  >
                    <span>Khám phá không gian chúc mừng & Album ✨</span>
                    <ArrowRight className="w-4 h-4 animate-bounce-x" />
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition-all cursor-pointer"
                    title="Gấp thư và xem lại animation mở phong thư"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Gấp thư lại 💌</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* LỚP 3: THÂN TÚI PHONG BÌ MẶT TRƯỚC LIỀN KHỐI (Single Unified Front Pocket - z-25) */}
          {/* Thiết kế V-cut liền mạch không kẽ hở, không cắt vạt góc tem thư, không lộ chữ */}
          <div
            className="absolute inset-0 z-25 pointer-events-none rounded-b-3xl border-b-2 border-rose-300/70"
            style={{
              clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)",
              background: "linear-gradient(to top, #ffd0db 0%, #ffe0e7 50%, #ffeff3 100%)",
              filter: "drop-shadow(0 -4px 8px rgba(244,63,94,0.18))",
            }}
          >
            {/* Đường nếp gấp 3D chìm mô phỏng các cánh thư giao nhau chân thực */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
              <line x1="0" y1="100%" x2="50%" y2="55%" stroke="#e11d48" strokeWidth="1.5" />
              <line x1="100%" y1="100%" x2="50%" y2="55%" stroke="#e11d48" strokeWidth="1.5" />
            </svg>

            {/* Con tem bưu điện cổ điển góc trái (Nguyên vẹn 100%, không bị cắt chéo) */}
            <div className="absolute bottom-5 left-4 sm:left-6 postage-stamp rounded-xl p-2 bg-white/95 backdrop-blur-xs pointer-events-auto">
              <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Flower2 className="w-2.5 h-2.5" />
                <span>VIETNAM POST</span>
              </p>
              <p className="text-xs font-extrabold text-rose-700 font-mono">20-10 VN</p>
              <p className="text-[8px] text-rose-400">Special Gift</p>
            </div>

            {/* Dấu gửi thư vintage tròn góc phải (Nguyên vẹn 100%, không bị cắt chéo) */}
            <div className="absolute bottom-5 right-4 sm:right-6 w-11 h-11 rounded-full border-2 border-dashed border-rose-400/70 bg-rose-100/40 flex flex-col items-center justify-center -rotate-12 shadow-xs pointer-events-auto">
              <Send className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[7px] font-bold text-rose-600 font-mono">20.10.26</span>
            </div>

            {/* Tên người nhận trên nắp phong bì */}
            <div className="absolute inset-x-0 bottom-5 text-center px-16 pointer-events-auto">
              <p className="text-[10px] uppercase tracking-widest text-rose-500 font-bold mb-0.5">
                Kính gửi tặng
              </p>
              <p className="font-handwriting text-2xl sm:text-3xl text-rose-800 font-bold truncate">
                {recipientName || siteConfig.recipient.name}
              </p>
              {photoCount > 0 && (
                <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-rose-600 font-medium bg-rose-100/80 px-2 py-0.5 rounded-full">
                  <ImageIcon className="w-3 h-3 text-rose-500" />
                  <span>(Kèm {photoCount} khoảnh khắc ngọt ngào)</span>
                </div>
              )}
            </div>
          </div>

          {/* LỚP 4: NẮP GẬP PHONG BÌ 3D PHÍA TRÊN (Top Flap with 3D Flip & 2 Sides) */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isFlapOpen ? -180 : 0,
            }}
            transition={{
              duration: 0.75,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: flapZIndex,
            }}
            className="absolute inset-x-0 top-0 h-[66%] pointer-events-auto cursor-pointer"
            onClick={animStage === "closed" ? handleStartOpen : undefined}
          >
            {/* MẶT TRƯỚC CỦA NẮP (Khi đóng hoặc đang nhấc lên 0 đến 90 độ, phủ sâu xuống 66% che khít miệng túi 55%) */}
            <div
              className="absolute inset-0 clip-flap-top bg-gradient-to-b from-[#ffccd7] via-[#ffdbe3] to-[#ffeef2] border-t-2 border-rose-300 flex flex-col items-center justify-end pb-3"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {/* CON DẤU SÁP TRÁI TIM NIÊM PHONG (Heart Wax Seal) */}
              <div className="relative mb-2 flex flex-col items-center">
                <motion.div
                  animate={
                    animStage === "unsealing"
                      ? {
                          scale: [1, 1.25, 0],
                          rotate: [0, 15, 30],
                          opacity: [1, 1, 0],
                        }
                      : animStage === "closed"
                      ? {
                          scale: [1, 1.06, 1],
                        }
                      : { scale: 0, opacity: 0 }
                  }
                  transition={
                    animStage === "unsealing"
                      ? { duration: 0.38, ease: "easeOut" }
                      : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartOpen();
                  }}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 shadow-xl flex items-center justify-center border-2 border-amber-200/90 cursor-pointer hover:scale-110 active:scale-95 transition-transform ring-4 ring-rose-200/80 ${
                    animStage === "closed" ? "wax-seal-pulse" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label="Chạm để mở phong thư"
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleStartOpen()}
                >
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white drop-shadow-sm" />
                  {/* Vành viền dập nổi */}
                  <div className="absolute inset-1 rounded-full border border-amber-300/50 pointer-events-none" />
                </motion.div>
              </div>
            </div>

            {/* MẶT SAU CỦA NẮP (Khi lật ra sau 180 độ, hướng lên trên trời) */}
            <div
              className="absolute inset-0 clip-flap-top bg-gradient-to-t from-[#ffd3dd] via-[#ffe5eb] to-[#fff1f4] border-b-2 border-rose-300 flex flex-col items-center justify-start pt-3"
              style={{
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative z-10 flex items-center gap-1.5 text-[10px] text-rose-500 font-bold tracking-widest uppercase">
                <Heart className="w-2.5 h-2.5 fill-rose-500" />
                <span>Trao Ngàn Yêu Thương</span>
                <Heart className="w-2.5 h-2.5 fill-rose-500" />
              </div>
            </div>
          </motion.div>

          {/* CÁC MẢNH PHÁO TIM VÀ SAO TUNG BAY KHI BÓC CON DẤU SÁP */}
          <div className="absolute inset-0 pointer-events-none z-50">
            <AnimatePresence>
              {sealParticles.map((sp) => (
                <motion.div
                  key={sp.id}
                  initial={{ opacity: 1, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [1, 0.9, 0],
                    scale: sp.scale,
                    x: sp.x,
                    y: sp.y,
                    rotate: sp.rotate,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  {sp.isHeart ? (
                    <Heart
                      className="w-5 h-5 drop-shadow-xs"
                      style={{ color: sp.color, fill: sp.color }}
                    />
                  ) : (
                    <Star
                      className="w-4 h-4 drop-shadow-xs"
                      style={{ color: sp.color, fill: sp.color }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
