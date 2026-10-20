"use client";

import React, { useEffect, useRef } from "react";

interface SparkleItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  isHeart: boolean;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = !document.hidden;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: SparkleItem[] = [];
    const colors = ["#fda4af", "#fb7185", "#f43f5e", "#fde047", "#ffffff", "#fbcfe8"];

    const addSparkle = (x: number, y: number) => {
      const count = Math.random() > 0.4 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const isHeart = Math.random() > 0.65;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;

        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8, // bay lên trên nhẹ nhàng
          size: isHeart ? Math.random() * 6 + 7 : Math.random() * 4 + 4,
          alpha: 1,
          maxAlpha: 0.9,
          color,
          isHeart,
          rotation: (Math.random() - 0.5) * 0.5,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          life: 0,
          maxLife: 35 + Math.random() * 20,
        });
      }
    };

    let lastMoveTime = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < 24) return; // giới hạn tần suất tạo hạt để mượt mà
      lastMoveTime = now;

      let x = 0;
      let y = 0;
      if ("touches" in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ("clientX" in e) {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }
      addSparkle(x, y);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawHeart = (
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;

      const s = size / 2;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.3, s * 0.4, 0, s * 1.3);
      ctx.bezierCurveTo(s * 1.3, s * 0.4, s, -s * 0.5, 0, s * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life++;

        const progress = p.life / p.maxLife;
        p.alpha = Math.max(0, (1 - progress) * p.maxAlpha);

        if (p.life >= p.maxLife || p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        if (p.isHeart) {
          drawHeart(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        } else {
          drawStar(p.x, p.y, p.size, p.color, p.alpha);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
