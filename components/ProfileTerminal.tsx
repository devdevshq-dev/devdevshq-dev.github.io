"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import content from "@/content/portfolio.json";

const lines = [
  { text: "devesh@portfolio:~$ cat profile.json", tone: "command" },
  { text: "{", tone: "muted" },
  { text: '  "name": "Devesh Kumar Sharma",', tone: "bright" },
  { text: '  "role": "Software Development Engineer",', tone: "plain" },
  { text: '  "location": "Bengaluru, India",', tone: "plain" },
  { text: `  "experience": ${JSON.stringify([...new Set(content.experience.map(role => role.company))])}`, tone: "violet" },
  { text: "}", tone: "muted" },
  { text: "devesh@portfolio:~$", tone: "command" },
];

export default function ProfileTerminal() {
  const [visible, setVisible] = useState(1);
  const [replay, setReplay] = useState(0);
  const output = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let count = 1;
    function advance() {
      if (document.hidden || count >= lines.length) return;
      timer = window.setTimeout(() => { setVisible(++count); advance(); }, 280 + Math.random() * 350);
    }
    function configure() {
      window.clearTimeout(timer);
      count = preference.matches ? lines.length : 1;
      setVisible(count);
      advance();
    }
    const onVisibility = () => { window.clearTimeout(timer); if (!document.hidden) advance(); };
    preference.addEventListener("change", configure);
    document.addEventListener("visibilitychange", onVisibility);
    configure();
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [replay]);

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [visible]);

  return <section className="profile-terminal" aria-label="Profile terminal">
    <div className="terminal-chrome"><div className="terminal-controls" aria-hidden="true"><span/><span/><span/></div><span>profile.sh — devesh@portfolio</span></div>
    <pre className="sr-only">{lines.map(line => line.text).join("\n")}</pre>
    <div className="terminal-output" ref={output} aria-hidden="true">
      <p className="terminal-comment"># The person behind the systems.</p>
      {lines.slice(0, visible).map((line, index) => <div className={`terminal-line terminal-${line.tone}`} key={index}>{line.text}{index === visible - 1 && <span className="terminal-cursor"/>}</div>)}
    </div>
    <div className="terminal-footer"><span>PROFILE / READ ONLY</span><button onClick={() => setReplay(value => value + 1)} aria-label="Replay profile terminal"><RotateCcw size={14}/>Replay</button></div>
  </section>;
}
