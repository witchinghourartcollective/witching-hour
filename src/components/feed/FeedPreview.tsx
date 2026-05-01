"use client";

import { motion } from "framer-motion";

export default function FeedPreview() {
  const previewItems = [
    {
      title: "Invocation opened",
      detail: "Wallet-authored posts appear in descending ritual order.",
    },
    {
      title: "Base-only actions",
      detail: "hOUR interactions stay explicit and chain-scoped.",
    },
    {
      title: "Signal archive",
      detail: "Short transmissions become a public trace of participation.",
    },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="panel rounded-[2rem] p-7"
    >
      <p className="eyebrow">Ritual Feed</p>
      <h2 className="mt-4 text-3xl text-white font-medium">A public surface, not a test harness.</h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
        The feed is where connected wallets leave transmissions, tip the
        system, and build visible continuity around drops and releases.
      </p>

      <div className="mt-8 space-y-4">
        {previewItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
            className="rounded-[1.35rem] border border-white/5 bg-black/20 p-5 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-fuchsia-300/60 font-semibold">
              {item.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/70">
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
