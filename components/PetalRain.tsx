"use client";

import React, { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  opacity: number;
  color: string;
}

export function PetalRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Tôn trọng thiết lập giảm chuyển động của người dùng
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isTabVisible = !document.hidden;

    // Bảng màu cánh hoa anh đào và hoa hồng pastel tươi tắn
    const colors = [
      "rgba(244, 63, 94, 0.75)",   // rose-500
      "rgba(251, 113, 133, 0.80)",  // rose-400
      "rgba(244, 114, 182, 0.80)",  // pink-400
      "rgba(253, 164, 175, 0.85)",  // rose-300
      "rgba(225, 29, 72, 0.65)",   // rose-600
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Điều chỉnh số lượng cánh hoa theo độ phân giải màn hình để tối ưu hiệu năng
    const getPetalCount = () => {
      const width = window.innerWidth;
      if (width < 640) return 24; // Mobile
      if (width < 1024) return 36; // Tablet
      return 50; // Desktop
    };

    const petalCount = getPetalCount();
    const petals: Petal[] = [];

    const createPetal = (startY?: number): Petal => {
      const size = Math.random() * 10 + 10; // 10px -> 20px visible size
      return {
        x: Math.random() * canvas.width,
        y: startY !== undefined ? startY : Math.random() * canvas.height,
        size,
        speedY: Math.random() * 1.2 + 0.8,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.03,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAmplitude: Math.random() * 2 + 1,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal());
    }

    // Vẽ 1 cánh hoa mềm mại hình giọt nước/elip uốn lượn
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, -p.size / 4, p.size, p.size / 2);
      ctx.bezierCurveTo(p.size, p.size, p.size / 2, p.size * 1.2, 0, p.size);
      ctx.bezierCurveTo(-p.size / 2, p.size * 1.2, -p.size, p.size, -p.size, p.size / 2);
      ctx.bezierCurveTo(-p.size, -p.size / 4, -p.size / 2, -p.size / 2, 0, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin(tick * p.swaySpeed + p.swayOffset) * p.swayAmplitude + p.speedX;
        p.angle += p.angularSpeed;

        // Khi cánh hoa rơi hết màn hình, tái tạo ở phía trên
        if (p.y > canvas.height + 20) {
          petals[i] = createPetal(-20);
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Tạm dừng khi tab trình duyệt bị ẩn (Page Visibility API)
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  );
}
