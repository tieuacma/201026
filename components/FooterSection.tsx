"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Flower2 } from "lucide-react";
import { siteConfig } from "@/config/site";

interface FooterSectionProps {
  senderName?: string;
}

export function FooterSection({ senderName }: FooterSectionProps = {}) {
  return (
    <footer className="relative mt-24 pb-16 pt-12 overflow-hidden border-t border-rose-200/60 bg-gradient-to-b from-transparent via-rose-50/50 to-rose-100/40">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Biểu tượng hoa trang trí */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-500 mb-6 shadow-xs"
        >
          <Flower2 className="w-6 h-6 animate-pulse" />
        </motion.div>

        {/* Trích dẫn lắng đọng */}
        <blockquote className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-rose-800 leading-snug mb-4 max-w-2xl mx-auto">
          &ldquo;{siteConfig.closing.quote}&rdquo;
        </blockquote>

        <p className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-6">
          — {siteConfig.closing.author} —
        </p>

        {/* Lời chúc kết */}
        <p className="text-sm sm:text-base text-gray-700 max-w-xl mx-auto leading-relaxed mb-8">
          {siteConfig.closing.message}
        </p>

        {/* Chữ ký & bản quyền ấm áp */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-rose-600/80 pt-6 border-t border-rose-200/50">
          <span>{senderName || siteConfig.sender.name}</span>
          <span className="hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1">
            Gửi trọn yêu thương <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> Ngày 20 Tháng 10
          </span>
        </div>
      </div>
    </footer>
  );
}
