"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ParticleEffect } from "@/components/ParticleEffect";
import { MusicToggle } from "@/components/MusicToggle";
import { UploadScreen, UploadedPhoto } from "@/components/UploadScreen";
import { Envelope } from "@/components/Envelope";
import { CelebrationCard } from "@/components/CelebrationCard";
import { loadPhotosFromDb, savePhotosToDb, deletePhotoFromDb, StoredPhoto } from "@/lib/db";

type AppStep = "upload" | "envelope" | "celebrate";

export default function HomePage() {
  const [step, setStep] = useState<AppStep>("upload");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [recipientName, setRecipientName] = useState<string>("");
  const photosRef = useRef<UploadedPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Tải tên người nhận đã lưu từ localStorage khi khởi động
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRecip = localStorage.getItem("2010_recipient_name");
      if (savedRecip) setRecipientName(savedRecip);
    }
  }, []);

  const handleUpdateRecipientName = (name: string) => {
    setRecipientName(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("2010_recipient_name", name);
    }
  };

  // Tải ảnh từ IndexedDB nếu người dùng đã tải trước đó (giúp F5 không bị mất)
  useEffect(() => {
    let ignore = false;
    loadPhotosFromDb()
      .then((res) => {
        if (!ignore && res.photos.length > 0) {
          const mapped: UploadedPhoto[] = res.photos.map((p) => ({
            id: p.id,
            url: URL.createObjectURL(p.blob),
            name: p.name,
            blob: p.blob,
            width: p.width,
            height: p.height,
            timestamp: p.timestamp,
          }));
          setPhotos(mapped);
        }
      })
      .catch((e) => {
        console.error("Lỗi đọc IndexedDB:", e);
      });

    // Giải phóng tất cả Object URL khi component unmount
    return () => {
      ignore = true;
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  // Thêm ảnh mới
  const handleAddPhotos = (newItems: UploadedPhoto[]) => {
    const updated = [...newItems, ...photos];
    setPhotos(updated);

    // Đồng bộ vào IndexedDB chạy nền
    const stored: StoredPhoto[] = updated.map((p) => ({
      id: p.id,
      blob: p.blob,
      name: p.name,
      timestamp: Date.now(),
      width: p.width,
      height: p.height,
    }));
    savePhotosToDb(stored);
  };

  // Xóa ảnh
  const handleRemovePhoto = (id: string) => {
    const target = photos.find((p) => p.id === id);
    if (target) {
      URL.revokeObjectURL(target.url);
    }
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    deletePhotoFromDb(id);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden selection:bg-rose-200">
      {/* 1. Hiệu ứng nền liên tục: Hoa anh đào rơi, Hạt lấp lánh & Chạm bung tim */}
      <ParticleEffect />

      {/* 2. Nút bật/tắt nhạc nền */}
      <MusicToggle />

      {/* 3. Luồng trải nghiệm 3 bước ngọt ngào (User Flow) */}
      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="step-upload"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <UploadScreen
              photos={photos}
              recipientName={recipientName}
              onUpdateRecipientName={handleUpdateRecipientName}
              onAddPhotos={handleAddPhotos}
              onRemovePhoto={handleRemovePhoto}
              onProceedToLetter={() => setStep("envelope")}
            />
          </motion.div>
        )}

        {step === "envelope" && (
          <motion.div
            key="step-envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <Envelope
              photoCount={photos.length}
              recipientName={recipientName}
              onOpenComplete={() => setStep("celebrate")}
              onBackToUpload={() => setStep("upload")}
            />
          </motion.div>
        )}

        {step === "celebrate" && (
          <motion.div
            key="step-celebrate"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
          >
            <CelebrationCard
              photos={photos}
              recipientName={recipientName}
              onBackToUpload={() => setStep("upload")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
