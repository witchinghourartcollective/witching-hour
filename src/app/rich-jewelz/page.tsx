"use client";

import { useEffect, useState } from "react";

export default function RichJewelzPage() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Sigil Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border border-white blur-3xl animate-pulse" />
      </div>

      {/* Title */}
      <h1
        className={`text-4xl md:text-6xl font-bold tracking-widest text-center mb-10 transition-all ${
          glitch ? "translate-x-1 opacity-80" : ""
        }`}
      >
        RICH JEWELZ (RITUALZ)
      </h1>

      {/* Core Text */}
      <div className="max-w-2xl text-center space-y-6 text-sm md:text-base leading-relaxed opacity-90">
        <p>This is not a page.</p>
        <p>This is a system.</p>

        <p>
          RICH JEWELZ are fragments of signal—encoded rituals, sigils, and
          transmissions designed to be interacted with, not just viewed.
        </p>

        <p>You don’t scroll this. You enter it.</p>
      </div>

      {/* Sections */}
      <div className="mt-16 grid gap-8 text-center max-w-3xl w-full">
        
        <div className="border border-white/20 p-6 hover:bg-white hover:text-black transition-all cursor-pointer">
          <h2 className="text-lg tracking-wide mb-2">RITUALS</h2>
          <p className="text-xs opacity-70">
            Interactive experiences, loops, environments.
          </p>
        </div>

        <div className="border border-white/20 p-6 hover:bg-white hover:text-black transition-all cursor-pointer">
          <h2 className="text-lg tracking-wide mb-2">SIGILS</h2>
          <p className="text-xs opacity-70">
            Encoded symbols. Intent carriers.
          </p>
        </div>

        <div className="border border-white/20 p-6 hover:bg-white hover:text-black transition-all cursor-pointer">
          <h2 className="text-lg tracking-wide mb-2">JEWELZ</h2>
          <p className="text-xs opacity-70">
            Rare drops. High-frequency artifacts.
          </p>
        </div>
      </div>

      {/* Instruction */}
      <div className="mt-20 text-center text-xs opacity-50 max-w-xl">
        <p>Click everything. Stay longer than you should.</p>
        <p>If something feels like nothing—it’s probably loading.</p>
      </div>

      {/* Hidden Trigger */}
      <div
        onClick={() => alert("RITUAL ENTRY POINT COMING ONLINE")}
        className="absolute bottom-6 right-6 text-[10px] opacity-20 hover:opacity-80 cursor-pointer"
      >
        ◉
      </div>
    </main>
  );
}
