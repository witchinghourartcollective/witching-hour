"use client";

import { WalletConnect } from "@/components/wallet/WalletConnect";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <div className="text-xl font-bold tracking-widest text-purple-500">
        WHM
      </div>

      <div className="flex items-center gap-4">
        <a href="/feed" className="text-sm text-gray-400 hover:text-white">
          Feed
        </a>
        <a href="/token" className="text-sm text-gray-400 hover:text-white">
          Token
        </a>

        <WalletConnect />
      </div>
    </nav>
  );
}
