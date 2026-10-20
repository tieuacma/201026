"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";

interface TypewriterProps {
  wishes: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function Typewriter({
  wishes,
  typingSpeed = 65,
  deletingSpeed = 35,
  pauseDuration = 2400,
}: TypewriterProps) {
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (!wishes || wishes.length === 0) return;

    if (isReducedMotion) {
      const timer = setTimeout(() => {
        setCurrentWishIndex((prev) => (prev + 1) % wishes.length);
      }, pauseDuration + 1000);
      return () => clearTimeout(timer);
    }

    const currentFullText = wishes[currentWishIndex] || "";
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      // Đang gõ chữ từng ký tự
      if (displayedText.length < currentFullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Đã gõ xong toàn bộ câu, dừng một khoảng thời gian trước khi xóa
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Đang xóa chữ
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Đã xóa hết, chuyển sang câu chúc tiếp theo sau khoảng nghỉ ngắn
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setCurrentWishIndex((prev) => (prev + 1) % wishes.length);
        }, deletingSpeed);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, currentWishIndex, wishes, typingSpeed, deletingSpeed, pauseDuration, isReducedMotion]);

  const textToRender = isReducedMotion ? wishes[currentWishIndex] : displayedText;

  return (
    <div className="relative inline-block min-h-[4.5rem] md:min-h-[3.8rem] text-lg sm:text-xl md:text-2xl font-medium text-rose-900/90 leading-relaxed">
      <span>{textToRender}</span>
      {!isReducedMotion && (
        <span
          aria-hidden="true"
          className="inline-block w-[3px] h-6 md:h-7 ml-1 bg-rose-500 rounded-sm align-middle animate-pulse"
        />
      )}
    </div>
  );
}
