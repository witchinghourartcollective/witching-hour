"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  delay?: number;
}

function StatCard({ label, value, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 backdrop-blur-sm transition-colors hover:border-white/20"
    >
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-lg text-white font-medium">{value}</p>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="panel relative overflow-hidden rounded-[2rem] px-6 py-14 md:px-10 md:py-16"
    >
      {/* Decorative gradients */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/40 to-transparent" />
      <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="eyebrow tracking-[0.4em]">Base-native creative system</p>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.1] text-white md:text-7xl font-semibold">
            Witching Hour turns wallets, signal, and art direction into one
            ritual surface.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            Built for midnight drops, collector access, and token-aware social
            motion. This app is the operational layer behind the Witching Hour
            world, not a brochure for it.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/feed"
              className="ritual-button inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold tracking-wide shadow-lg shadow-fuchsia-500/10"
            >
              Enter the ritual feed
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/token"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
            >
              Inspect hOUR token
            </motion.a>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard label="Mode" value="Wallet-first publishing" delay={0.4} />
          <StatCard label="Chain" value="Base for live interaction" delay={0.5} />
          <StatCard label="Tone" value="Lore, signal, and utility" delay={0.6} />
        </div>
      </div>
    </motion.section>
  );
}
