"use client";

import { useEffect } from "react";
import { startScrollMotion } from "@/lib/scroll-motion";

export default function ScrollMotion() {
  useEffect(startScrollMotion, []);
  return <div className="scroll-progress" aria-hidden="true"/>;
}
