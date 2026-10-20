"use client";

import React, { useEffect, useRef } from "react";

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  scale: number;
  rotation: number;
  angularSpeed: number;
  hue: number;
  life: number;
  maxLife: number;
  isBurst?: boolean;
}

export function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isTabVisible = !document.hidden;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const hearts: FloatingHeart[] = [];

    // Tạo trái tim bay nền nhẹ nhàng
    const createAmbientHeart = (startY?: number): FloatingHeart => {
      return {
        x: Math.random() * canvas.width,
        y: startY !== undefined ? startY : Math.random() * canvas.height,
        size: Math.random() * 14 + 14, // 14px -> 28px
        speedY: Math.random() * 0.9 + 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.35 + 0.35,
        scale: 1,
        rotation: (Math.random() - 0.5) * 0.4,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        hue: Math.random() * 30 + 335, // tông hồng - đỏ
        life: 0,
        maxLife: 600,
        isBurst: false,
      };
    };

    const heartCount = window.innerWidth < 640 ? 18 : 32;
    for (let i = 0; i < heartCount; i++) {
      hearts.push(createAmbientHeart());
    }

    // Vẽ hình trái tim bằng Bezier curves
    const drawHeart = (h: FloatingHeart) => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      ctx.scale(h.scale, h.scale);

      ctx.fillStyle = `hsla(${h.hue}, 90%, 65%, ${h.opacity})`;
      ctx.shadowColor = `hsla(${h.hue}, 100%, 75%, ${h.opacity * 0.6})`;
      ctx.shadowBlur = 6;

      const s = h.size / 2;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.3, s * 0.4, 0, s * 1.3);
      ctx.bezierCurveTo(s * 1.3, s * 0.4, s, -s * 0.5, 0, s * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Khi người dùng click hoặc chạm vào màn hình: bắn ra chùm trái tim
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const burstCount = 10;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 3 + 2;
        hearts.push({
          x: clientX,
          y: clientY,
          size: Math.random() * 14 + 12,
          speedY: Math.sin(angle) * speed - 1.5,
          speedX: Math.cos(angle) * speed,
          opacity: 1,
          scale: 1,
          rotation: (Math.random() - 0.5) * 0.6,
          angularSpeed: (Math.random() - 0.5) * 0.08,
          hue: Math.random() * 35 + 335,
          life: 0,
          maxLife: 60, // biến mất sau ~1 giây
          isBurst: true,
        });
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown, { passive: true });

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.x += h.speedX;
        h.y -= h.speedY; // bay lên trên
        h.rotation += h.angularSpeed;
        h.life++;

        if (h.isBurst) {
          // Trái tim nổ từ click: giảm dần kích thước và độ mờ
          h.speedY *= 0.96;
          h.speedX *= 0.96;
          h.opacity = 1 - h.life / h.maxLife;
          h.scale = 1 + (h.life / h.maxLife) * 0.3;

          if (h.life >= h.maxLife || h.opacity <= 0) {
            hearts.splice(i, 1);
            continue;
          }
        } else {
          // Trái tim nền lơ lửng
          if (h.y < -30) {
            hearts[i] = createAmbientHeart(canvas.height + 30);
          }
        }

        drawHeart(h);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-15 h-full w-full"
    />
  );
}
