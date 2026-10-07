"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; radius: number };

export default function NetworkBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, last = 0;
    let nodes: Node[] = [];
    const pointer = { x: -1000, y: -1000 };

    function draw(delta = 0) {
      context!.clearRect(0, 0, width, height);
      for (const node of nodes) {
        node.x += node.vx * delta;
        node.y += node.vy * delta;
        const dx = node.x - pointer.x, dy = node.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (delta && distance > 0 && distance < 100) {
          const force = (1 - distance / 100) * .35 * delta;
          node.x += dx / distance * force; node.y += dy / distance * force;
        }
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x)); node.y = Math.max(0, Math.min(height, node.y));
        context!.beginPath(); context!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context!.fillStyle = "rgba(56,189,248,.45)"; context!.fill();
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance >= 140) continue;
        context!.beginPath(); context!.moveTo(a.x, a.y); context!.lineTo(b.x, b.y);
        context!.strokeStyle = `rgba(129,140,248,${.18 * (1 - distance / 140)})`;
        context!.lineWidth = .7; context!.stroke();
      }
    }
    function animate(now: number) {
      draw(last ? Math.min(now - last, 32) / 16.67 : 1);
      last = now;
      frame = window.requestAnimationFrame(animate);
    }
    function configure() {
      window.cancelAnimationFrame(frame); last = 0;
      draw();
      if (!preference.matches && !document.hidden) frame = window.requestAnimationFrame(animate);
    }
    function resize() {
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element!.width = Math.round(width * ratio); element!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      nodes = Array.from({length: width < 600 ? 28 : 52}, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, radius: 1 + Math.random() * 1.3 }));
      configure();
    }
    const move = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, {passive: true});
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", configure);
    preference.addEventListener("change", configure);
    resize();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", configure);
      preference.removeEventListener("change", configure);
    };
  }, []);
  return <><div className="ambient-glow" aria-hidden="true"/><canvas ref={canvas} className="network-background" aria-hidden="true"/></>;
}
