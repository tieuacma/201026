"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart, Sparkles, ImagePlus, ArrowRight, ShieldCheck, RefreshCw, Star, Images, Flower2, User } from "lucide-react";
import { siteConfig } from "@/config/site";
import { validateImageFile, resizeAndCompressImage } from "@/lib/imageUtils";
import { playSparkleSound, playBubblePop } from "@/lib/soundEffects";

export interface UploadedPhoto {
  id: string;
  url: string;
  name: string;
  blob: Blob;
  width: number;
  height: number;
  timestamp: number;
}

interface UploadScreenProps {
  photos: UploadedPhoto[];
  recipientName: string;
  onUpdateRecipientName: (name: string) => void;
  onAddPhotos: (newPhotos: UploadedPhoto[]) => void;
  onRemovePhoto: (id: string) => void;
  onProceedToLetter: () => void;
}

export function UploadScreen({
  photos,
  recipientName,
  onUpdateRecipientName,
  onAddPhotos,
  onRemovePhoto,
  onProceedToLetter,
}: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const remainingSlots = siteConfig.gallery.maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      showError(`Bạn đã chọn đủ tối đa ${siteConfig.gallery.maxPhotos} ảnh!`);
      return;
    }

    let filesToProcess = files;
    if (files.length > remainingSlots) {
      filesToProcess = files.slice(0, remainingSlots);
      showError(`Đã tự động lấy ${remainingSlots} ảnh đầu tiên để không vượt quá giới hạn ${siteConfig.gallery.maxPhotos} ảnh.`);
    }

    setIsProcessing(true);
    const newItems: UploadedPhoto[] = [];

    for (const file of filesToProcess) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        showError(validation.error || `File ${file.name} không hợp lệ.`);
        continue;
      }

      try {
        const compressed = await resizeAndCompressImage(file);
        const url = URL.createObjectURL(compressed.blob);
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url,
          name: file.name.replace(/\.[^/.]+$/, ""),
          blob: compressed.blob,
          width: compressed.width,
          height: compressed.height,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Lỗi nén ảnh:", err);
        showError(`Không thể xử lý ảnh ${file.name}.`);
      }
    }

    if (newItems.length > 0) {
      playSparkleSound();
      onAddPhotos(newItems);
    }
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const progressPercent = Math.min(100, Math.round((photos.length / siteConfig.gallery.maxPhotos) * 100));

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-20">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border-2 border-rose-200/90 shadow-2xl shadow-rose-300/40 text-center relative overflow-hidden"
      >
        {/* Họa tiết ánh sáng trang trí góc */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-gradient-to-br from-pink-300/30 via-rose-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-gradient-to-tr from-rose-300/30 via-pink-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Huy hiệu ngày lễ 20/10 phát sáng nhẹ */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-100 via-pink-100 to-rose-100 text-rose-700 text-xs sm:text-sm font-semibold mb-4 border border-rose-300/80 shadow-xs"
        >
          <Flower2 className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: "12s" }} />
          <span>Chào Mừng Ngày Phụ Nữ Việt Nam 20/10</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </motion.div>

        {/* Tiêu đề viết tay lãng mạn ánh kim */}
        <h1 className="font-handwriting text-4xl sm:text-5xl md:text-6xl font-bold mb-3 drop-shadow-xs shimmer-text">
          Gửi Ngàn Yêu Thương
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-rose-900/80 max-w-lg mx-auto mb-6 leading-relaxed font-sans">
          Hãy nhập tên người phụ nữ thân thương và tải lên những bức ảnh kỷ niệm đẹp nhất để gửi gắm vào lá thư 20/10 ngọt ngào này nhé!
        </p>

        {/* KHUNG NHẬP TÊN NGƯỜI NHẬN CUTE */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/60 to-rose-50/90 border-2 border-rose-200/90 shadow-inner text-left relative overflow-hidden">
          {/* Họa tiết trang trí góc */}

            <div className="relative">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => onUpdateRecipientName(e.target.value)}
                placeholder="Nhập tên của bạn vào đây"
                maxLength={40}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-xs sm:text-sm text-gray-800 placeholder-gray-400 font-medium transition-all shadow-2xs"
              />
            </div>
        </div>

        {/* Vùng kéo thả tải ảnh sang trọng */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 backdrop-blur-sm group ${
            isDragging
              ? "border-rose-500 bg-rose-100/90 scale-[1.02] shadow-lg shadow-rose-200"
              : "border-rose-300/90 hover:border-rose-400 bg-gradient-to-b from-rose-50/60 to-pink-50/40 hover:bg-rose-50/90 shadow-inner"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
            disabled={isProcessing}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-300/50 group-hover:scale-110 transition-transform duration-300">
              {isProcessing ? (
                <RefreshCw className="w-8 h-8 animate-spin text-white" />
              ) : (
                <ImagePlus className="w-8 h-8 text-white" />
              )}
            </div>

            <div>
              <p className="text-base sm:text-lg font-bold text-rose-900">
                {isProcessing ? "Đang chuẩn bị ảnh..." : "Chạm để chọn ảnh hoặc kéo thả vào đây"}
              </p>
              <p className="text-xs text-rose-700/70 mt-1">
                Chấp nhận JPG, PNG, WEBP (tối đa {siteConfig.gallery.maxPhotos} ảnh, tự động nén tối ưu bộ nhớ)
              </p>
            </div>
          </div>
        </div>

        {/* Thông báo lỗi nếu có */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 text-xs font-medium text-rose-800 bg-rose-100/95 rounded-2xl border border-rose-300 shadow-xs"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lưới Thumbnail ảnh đã chọn */}
        {photos.length > 0 && (
          <div className="mt-6 text-left">
            <div className="flex items-center justify-between mb-2 px-1 text-xs sm:text-sm font-semibold text-rose-800">
              <span className="flex items-center gap-1.5">
                <Images className="w-4 h-4 text-rose-500" />
                Bộ sưu tập: <strong className="text-rose-600 font-bold">{photos.length}/{siteConfig.gallery.maxPhotos}</strong> ảnh
              </span>
              <span className="text-[11px] text-gray-500 italic font-normal">Di chuột lên ảnh để xóa</span>
            </div>

            {/* Thanh tiến trình số ảnh */}
            <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Lưới ảnh thu nhỏ kiểu Polaroid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-3 bg-rose-50/50 rounded-2xl border border-rose-200/80">
              {photos.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* Số thứ tự góc ảnh */}
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-medium">
                    #{idx + 1}
                  </span>

                  {/* Nút xóa ảnh */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playBubblePop(0.8);
                      onRemovePhoto(item.id);
                    }}
                    className="absolute inset-0 bg-rose-900/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-5 h-5 text-white hover:scale-110 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Chú thích lưu trữ an toàn */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-rose-800/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Ảnh được xử lý và lưu an toàn trên máy của bạn, không tải lên bất kỳ máy chủ nào.</span>
        </div>

        {/* Nút bấm hành động chuyển tiếp */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            type="button"
            onClick={() => {
              playBubblePop(1.1);
              onProceedToLetter();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full sm:w-auto px-9 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer ${
              photos.length > 0
                ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-400/50 hover:shadow-rose-500/60 ring-4 ring-rose-200"
                : "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-300/50 hover:opacity-95"
            }`}
          >
            <Star className="w-5 h-5 fill-amber-200 text-amber-200 animate-spin" style={{ animationDuration: "8s" }} />
            <span>Mở Lá Thư Yêu Thương</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {photos.length === 0 && (
            <button
              type="button"
              onClick={() => {
                playBubblePop(0.9);
                onProceedToLetter();
              }}
              className="text-xs sm:text-sm font-medium text-rose-600 hover:text-rose-800 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Bỏ qua & Xem thư ngay
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
