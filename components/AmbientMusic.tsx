"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AmbientScore } from "@/lib/ambient-score";

export default function AmbientMusic() {
  const score=useRef<AmbientScore | null>(null);
  const wanted=useRef(false);
  const [enabled,setEnabled]=useState(false);
  const [volume,setVolume]=useState(45);
  const [error,setError]=useState("");
  useEffect(()=>{
    const onVisibility=()=>{
      if(document.hidden) score.current?.pause();
      else if(wanted.current) void score.current?.play().catch(()=>{wanted.current=false;setEnabled(false);setError("Tap music to resume the soundtrack.");});
    };
    document.addEventListener("visibilitychange",onVisibility);
    return ()=>{document.removeEventListener("visibilitychange",onVisibility);score.current?.dispose();score.current=null;};
  },[]);
  const toggle=async()=>{
    setError("");
    if(enabled) {wanted.current=false;score.current?.pause();setEnabled(false);return;}
    try {
      if(!score.current) score.current=new AmbientScore();
      score.current.setVolume(volume/100);
      wanted.current=true;
      await score.current.play();
      setEnabled(true);
    } catch {wanted.current=false;setEnabled(false);setError("Music is unavailable in this browser.");}
  };
  return <div className="music-control"><button className={`hud-button music-toggle ${enabled?"is-on":""}`} onClick={()=>void toggle()} aria-pressed={enabled} aria-label={enabled?"Turn ambient music off":"Turn ambient music on"}>{enabled?<Volume2 size={16}/>:<VolumeX size={16}/>}<span>Music {enabled?"on":"off"}</span></button>{enabled&&<label className="volume-control"><span className="sr-only">Music volume</span><input aria-label="Music volume" type="range" min="0" max="100" value={volume} onChange={event=>{const next=Number(event.target.value);setVolume(next);score.current?.setVolume(next/100);}}/></label>}<span className="sr-only" role="status">{error||(enabled?"Ambient soundtrack playing":"Music off")}</span></div>;
}
