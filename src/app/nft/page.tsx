"use client";

import { track } from "@/lib/track";

export default function NftPage() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-10 px-6 py-16 text-center">
      <section className="max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.35em] opacity-80">NFT</p>
        <h1 className="text-3xl sm:text-4xl font-semibold">Witching Hour</h1>
        <p>
          Witching Hour is a creative studio and collective using NFTs as a
          membership and utility layer. Holders gain access to exclusive music,
          visual art, studio sessions, and collaborative opportunities rooted in
          long-term creative value.
        </p>
        <p>
          Witching Hour is the moment where sound, symbol, and intention align -
          each token a key to creative access, collaboration, and ritual.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            className="rounded-md border border-white/20 px-4 py-2"
            href="/mint"
            onClick={() =>
              track("cta_click", {
                location: "nft_page",
                state: "pre_mint",
              })
            }
          >
            View Mint Tiers
          </a>
          <a
            className="rounded-md border border-white/20 px-4 py-2"
            href="/litepaper"
            onClick={() =>
              track("cta_click", {
                location: "nft_page",
                state: "info",
              })
            }
          >
            Read Litepaper
          </a>
          <a
            className="rounded-md border border-white/20 px-4 py-2"
            href="https://base.app/content/EkUKQwoVbmV0d29ya3MvYmFzZS1tYWlubmV0EioweDY5ZGJmYzk0NGZmZjdjNjhkYTFkMjRmZTBjNjUxNDM1NWE4MzI1ODU"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("cta_click", {
                location: "nft_page",
                state: "base_app",
              })
            }
          >
            View on Base.app
          </a>
        </div>
      </section>

      <section className="max-w-3xl w-full space-y-4 text-left border border-white/10 rounded-lg p-6 bg-white/5">
        <h2 className="text-xl font-semibold text-center">Locked Numbers</h2>
        <p className="text-center">
          Pick one per drop. These are intentional, symbolic, and platform-safe.
        </p>
        <ul className="space-y-2">
          <li>333 - 0.033 ETH - Genesis / intimate / early believers</li>
          <li>666 - 0.066 ETH - Edge, counterculture, underground energy</li>
          <li>777 - 0.077 ETH - Luck, alignment, momentum</li>
          <li>999 - 0.099 ETH - Completion, expansion, broad access</li>
          <li>369 - 0.0369 ETH - Tesla code, frequency drop, lore-heavy</li>
        </ul>
      </section>

      <section className="max-w-3xl w-full space-y-4 text-left border border-white/10 rounded-lg p-6 bg-white/5">
        <h2 className="text-xl font-semibold text-center">Utilities</h2>
        <ul className="space-y-2">
          <li>Access to exclusive music releases and unreleased tracks</li>
          <li>Entry to private Discord channels</li>
          <li>Priority access to studio sessions and collaborations</li>
          <li>Physical art, merch, and limited drops</li>
          <li>Future creative and community-driven utilities</li>
        </ul>
      </section>

      <section className="max-w-3xl w-full space-y-4 text-left border border-white/10 rounded-lg p-6 bg-white/5">
        <h2 className="text-xl font-semibold text-center">Final Drop Structure</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Drop I - Genesis</h3>
            <p>333 @ 0.0333 ETH</p>
            <p>Role: Foundation / Origin | Access Level: Core</p>
            <p>Narrative Position: The first key. Those who entered at the beginning.</p>
          </div>
          <div>
            <h3 className="font-semibold">Drop II - Alignment</h3>
            <p>777 @ 0.0777 ETH</p>
            <p>Role: Expansion / Momentum | Access Level: Advanced</p>
            <p>Narrative Position: The project finds its rhythm.</p>
          </div>
          <div>
            <h3 className="font-semibold">Drop III - Ritual</h3>
            <p>666 @ 0.0666 ETH</p>
            <p>Role: Shadow / Edge / Creative Depth | Access Level: Specialist</p>
            <p>
              Narrative Position: Not for everyone. Intentionally selective.
              This is where Witching Hour leans into its edge.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Drop IV - Completion</h3>
            <p>999 @ 0.0999 ETH</p>
            <p>Role: Open Gate / Long-Term Access | Access Level: General</p>
            <p>Narrative Position: The door stays open, but the early keys are gone.</p>
          </div>
          <div>
            <h3 className="font-semibold">Special Drop - Frequency</h3>
            <p>369 @ 0.0369 ETH</p>
            <p>Role: Experimental / Signal | Access Level: Unknown</p>
            <p>Narrative Position: A transmission, not a product.</p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl w-full space-y-3 text-left">
        <h2 className="text-xl font-semibold text-center">Why This Works</h2>
        <ul className="space-y-2">
          <li>333 first = trust + legitimacy</li>
          <li>777 second = growth with proof</li>
          <li>666 third = edge without platform friction</li>
          <li>999 last = scale without dilution</li>
          <li>369 = creative wildcard you control</li>
        </ul>
        <p>No burns. No gimmicks. No backtracking.</p>
      </section>
    </main>
  );
}
