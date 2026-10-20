"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye, Play, Sparkles } from "lucide-react";
import { StoredPhoto } from "@/lib/db";
import { Lightbox, LightboxItem } from "@/components/Lightbox";

interface GalleryProps {
  photos: StoredPhoto[];
  onDeletePhoto: (id: string) => Promise<void>;
}

export function Gallery({ photos, onDeletePhoto }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photoUrls, setPhotoUrls] = useState<Map<string, string>>(new Map());
  const urlsRef = useRef<Map<string, string>>(new Map());

  // Quản lý bộ nhớ nghiêm ngặt: tạo ObjectURL và giải phóng (revokeObjectURL) đúng lúc
  useEffect(() => {
    const currentMap = urlsRef.current;
    const newMap = new Map<string, string>();

    // Giữ lại URL của ảnh đã tồn tại, tạo mới URL cho ảnh mới thêm
    photos.forEach((photo) => {
      if (currentMap.has(photo.id)) {
        newMap.set(photo.id, currentMap.get(photo.id)!);
      } else {
        const url = URL.createObjectURL(photo.blob);
        newMap.set(photo.id, url);
      }
    });

    // Thu hồi bộ nhớ cho những ảnh đã bị xóa khỏi danh sách
    currentMap.forEach((url, id) => {
      if (!newMap.has(id)) {
        URL.revokeObjectURL(url);
      }
    });

    urlsRef.current = newMap;
    setPhotoUrls(new Map(newMap));

    // Cleanup khi component unmount: dọn sạch tất cả URL đã tạo
    return () => {
      urlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      urlsRef.current.clear();
    };
  }, [photos]);

  const lightboxItems: LightboxItem[] = photos.map((p) => ({
    id: p.id,
    url: photoUrls.get(p.id) || "",
    name: "",
    timestamp: p.timestamp,
  }));

  // Tạo góc nghiêng polaroid ngẫu nhiên có trật tự để bố cục mềm mại tự nhiên
  const getTiltAngle = (index: number) => {
    const tilts = [-2.2, 1.8, -1.2, 2.4, -1.8, 1.4, -2.6, 2.1];
    return tilts[index % tilts.length];
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl border border-rose-200/60 bg-white/40 backdrop-blur-xs max-w-xl mx-auto">
        <Sparkles className="w-10 h-10 text-rose-300 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-rose-800">Chưa có bức ảnh nào</h4>
        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Hãy tải lên những tấm hình kỷ niệm đẹp nhất của bạn hoặc người phụ nữ thân thương để tạo nên album đặc biệt nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Thanh công cụ phụ của Gallery */}
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto px-4">
        <span className="text-xs sm:text-sm font-medium text-rose-700 bg-rose-100/70 px-3.5 py-1.5 rounded-full">
          Tổng cộng: {photos.length} khoảnh khắc
        </span>

        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-md shadow-rose-300/40 transition-all hover:scale-105"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Xem Trình Chiếu</span>
        </button>
      </div>

      {/* Lưới ảnh phong cách Polaroid / Masonry mềm mại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 max-w-6xl mx-auto px-4">
        {photos.map((photo, index) => {
          const url = photoUrls.get(photo.id);
          const tilt = getTiltAngle(index);

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30, rotate: tilt }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              className="group relative bg-white p-3 rounded-2xl polaroid-card border border-rose-100 cursor-pointer shadow-md hover:shadow-xl transition-all"
              onClick={() => setLightboxIndex(index)}
            >
              {/* Băng dính giả lập dán góc polaroid */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/80 backdrop-blur-xs border-y border-amber-200/60 rotate-1 shadow-2xs pointer-events-none" />

              {/* Khung ảnh */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-rose-50/50">
                {url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={url}
                    alt={`Kỷ niệm #${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Đang tải...
                  </div>
                )}

                {/* Overlay khi hover: Nút xem lớn và Nút xóa */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(index);
                    }}
                    className="p-2.5 rounded-full bg-white/90 text-rose-600 hover:bg-white transition-transform hover:scale-110 shadow-md"
                    title="Phóng to ảnh"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePhoto(photo.id);
                    }}
                    className="p-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-transform hover:scale-110 shadow-md"
                    title="Xóa bức ảnh này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Component */}
      <Lightbox
        items={lightboxItems}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
}
