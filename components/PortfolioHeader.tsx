"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import AmbientMusic from "@/components/AmbientMusic";

const sections = ["About", "Experience", "Projects", "Community", "Skills", "Contact"];

export default function PortfolioHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);
  return <header className="site-header">
    <div className="header-inner">
      <a className="wordmark" href="#" aria-label="Devesh Sharma, home"><span>{"<~/"}</span>devesh<span>{">"}</span></a>
      <button ref={trigger} className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X size={21}/> : <Menu size={21}/>}</button>
      <nav id="main-navigation" className={`site-navigation ${open ? "is-open" : ""}`} aria-label="Main navigation">
        {sections.map(section => <a className={section === "Contact" ? "nav-contact" : undefined} key={section} href={`#${section.toLowerCase()}`} onClick={() => setOpen(false)}>{section}</a>)}
      </nav>
      <AmbientMusic/>
    </div>
  </header>;
}
