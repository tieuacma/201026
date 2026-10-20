"use client";

import React, { useEffect, useRef } from "react";

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  alphaSpeed: number;
  scale: number;
  isStar: boolean;
  color: string;
}

export function Sparkles() {
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const palette = [
      "rgba(254, 240, 138, ", // vàng nhạt hoàng gia #fef08a
      "rgba(253, 224, 71, ",  // vàng ấm
      "rgba(255, 228, 230, ", // hồng phấn nhạt
      "rgba(255, 255, 255, ", // trắng tinh khôi
    ];

    const count = window.innerWidth < 640 ? 15 : 30;
    const particles: SparkleParticle[] = [];

    const createParticle = (): SparkleParticle => {
      const colorBase = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        alpha: Math.random() * 0.5,
        maxAlpha: Math.random() * 0.6 + 0.3,
        alphaSpeed: Math.random() * 0.015 + 0.005,
        scale: 1,
        isStar: Math.random() > 0.4,
        color: colorBase,
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `${color}${alpha})`;
      ctx.shadowColor = `${color}${alpha * 0.8})`;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      // Vẽ ngôi sao 4 cánh lấp lánh (sparkle star)
      ctx.moveTo(0, -r * 2);
      ctx.quadraticCurveTo(0, 0, r * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, r * 2);
      ctx.quadraticCurveTo(0, 0, -r * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r * 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawCircle = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.fillStyle = `${color}${alpha})`;
      ctx.shadowColor = `${color}${alpha * 0.5})`;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.alpha += p.alphaSpeed;

        if (p.alpha > p.maxAlpha) {
          p.alpha = p.maxAlpha;
          p.alphaSpeed = -p.alphaSpeed;
        } else if (p.alpha <= 0.02) {
          // Khởi tạo lại hạt ở vị trí ngẫu nhiên
          particles[i] = createParticle();
          continue;
        }

        if (p.isStar) {
          drawStar(p.x, p.y, p.size, p.color, p.alpha);
        } else {
          drawCircle(p.x, p.y, p.size, p.color, p.alpha);
        }
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
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-5 h-full w-full"
    />
  );
}
