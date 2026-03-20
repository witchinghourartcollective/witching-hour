"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <div className="text-xl font-bold tracking-widest text-sigil">
        WHM
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-400 hover:text-white">
          Rituals
        </button>
        <button className="text-sm text-gray-400 hover:text-white">
          Token
        </button>

        <ConnectButton />
      </div>
    </nav>
  );
}
