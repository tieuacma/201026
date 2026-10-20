"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, Trash2, ImagePlus, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { siteConfig } from "@/config/site";
import { validateImageFile, resizeAndCompressImage } from "@/lib/imageUtils";
import { StoredPhoto } from "@/lib/db";

interface PhotoUploaderProps {
  currentCount: number;
  isPersistent: boolean;
  onPhotosAdded: (newPhotos: StoredPhoto[]) => Promise<void>;
  onClearAll: () => Promise<void>;
}

export function PhotoUploader({
  currentCount,
  isPersistent,
  onPhotosAdded,
  onClearAll,
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showFeedback = (type: "success" | "error" | "info", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const remainingSlots = siteConfig.gallery.maxPhotos - currentCount;
    if (remainingSlots <= 0) {
      showFeedback("error", `Bạn đã đạt giới hạn tối đa ${siteConfig.gallery.maxPhotos} ảnh!`);
      return;
    }

    let filesToProcess = fileArray;
    if (fileArray.length > remainingSlots) {
      filesToProcess = fileArray.slice(0, remainingSlots);
      showFeedback(
        "info",
        `Chỉ nhận thêm ${remainingSlots} ảnh để không vượt quá giới hạn ${siteConfig.gallery.maxPhotos} ảnh.`
      );
    }

    setIsProcessing(true);
    const newPhotos: StoredPhoto[] = [];
    const errors: string[] = [];

    for (const file of filesToProcess) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        errors.push(validation.error || `File ${file.name} không hợp lệ.`);
        continue;
      }

      try {
        const compressed = await resizeAndCompressImage(file);
        const photoItem: StoredPhoto = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          blob: compressed.blob,
          name: file.name.replace(/\.[^/.]+$/, ""),
          timestamp: Date.now(),
          width: compressed.width,
          height: compressed.height,
        };
        newPhotos.push(photoItem);
      } catch (err) {
        console.error("Lỗi nén ảnh:", err);
        errors.push(`Không thể xử lý ảnh ${file.name}.`);
      }
    }

    if (newPhotos.length > 0) {
      await onPhotosAdded(newPhotos);
      if (errors.length === 0) {
        showFeedback("success", `Đã thêm thành công ${newPhotos.length} ảnh kỷ niệm!`);
      } else {
        showFeedback("error", `Thêm ${newPhotos.length} ảnh. Gặp lỗi: ${errors.join("; ")}`);
      }
    } else if (errors.length > 0) {
      showFeedback("error", errors.join("; "));
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

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      {/* Vùng kéo thả tải ảnh */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-xs ${
          isDragging
            ? "border-rose-500 bg-rose-100/70 scale-[1.01]"
            : "border-rose-300 hover:border-rose-400 bg-white/60 hover:bg-rose-50/50 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onInputChange}
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
            {isProcessing ? (
              <RefreshCw className="w-7 h-7 animate-spin" />
            ) : (
              <ImagePlus className="w-7 h-7" />
            )}
          </div>

          <div>
            <p className="text-base sm:text-lg font-semibold text-rose-900">
              {isProcessing
                ? "Đang tối ưu & nén ảnh trên trình duyệt..."
                : "Bấm để chọn ảnh hoặc kéo thả ảnh vào đây"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Hỗ trợ JPG, PNG, WEBP (tối đa {siteConfig.gallery.maxFileSizeMB}MB/ảnh, tự động resize để tiết kiệm bộ nhớ)
            </p>
          </div>

          {/* Huy hiệu số lượng */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-medium">
            <Upload className="w-3.5 h-3.5" />
            <span>
              Đã lưu: {currentCount} / {siteConfig.gallery.maxPhotos} ảnh
            </span>
          </div>
        </div>
      </div>

      {/* Thông báo tương tác (Feedback Banner) */}
      {feedback && (
        <div
          className={`mt-4 p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : feedback.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-amber-50 text-amber-800 border border-amber-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span className="flex-1">{feedback.message}</span>
        </div>
      )}

      {/* Dòng chú thích bảo mật & nút xóa */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 px-2">
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Ảnh chỉ được lưu tạm trên thiết bị của bạn, không được tải lên máy chủ.
            {!isPersistent && (
              <span className="text-amber-600 font-medium ml-1">
                (Đang chạy chế độ ẩn danh: dữ liệu chỉ lưu trong phiên này)
              </span>
            )}
          </span>
        </div>

        {currentCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-100/60 rounded-lg transition-colors border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả ảnh</span>
          </button>
        )}
      </div>
    </div>
  );
}
