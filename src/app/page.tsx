import Image from "next/image";
import Link from "next/link";
import { SignInWithBasePanelShell } from "@/components/base/SignInWithBasePanelShell";
import FeedPreview from "@/components/feed/FeedPreview";
import { SpotifySpotlight } from "@/components/sections/SpotifySpotlight";
import TokenPreview from "@/components/token/TokenPreview";
import Hero from "@/components/ui/Hero";

const navItems = [
  ["Feed", "/feed"],
  ["hOUR Token", "/token"],
  ["Rich Jewelz", "/rich-jewelz"],
  ["Blog Demo", "/blog"],
] as const;

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:px-10">
      <Hero />

      <section className="grid gap-8 md:grid-cols-[1.3fr_0.9fr] md:items-center">
        <div className="panel rounded-[2rem] p-8 md:p-10">
          <p className="eyebrow">Witching Hour</p>
          <h2 className="mt-4 text-3xl text-white md:text-4xl">
            A night-market interface for signal, access, and ritual publishing.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-white/75">
            <p>
              The app is now the active Base-native surface: wallet-first,
              token-aware, and built to hold live creative drops instead of
              static promo pages.
            </p>
            <p>
              Feed interactions are meant to feel ceremonial rather than
              generic. Posts are invocations, wallets are credentials, and hOUR
              moves through the system as a public sign of participation.
            </p>
            <p>
              The next stage is tightening the loop between atmosphere and
              utility so the product feels intentional on first load and usable
              once a wallet connects.
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="panel w-full max-w-xs rounded-[2rem] p-8">
            <div className="mb-6 flex justify-center">
              <Image
                src="/logo/hour-basescan.svg"
                alt="Witching Hour mark"
                width={128}
                height={128}
                priority
                className="h-24 w-24"
              />
            </div>
            <p className="text-center text-sm uppercase tracking-[0.35em] text-white/45">
              Signal
            </p>
            <p className="mt-4 text-center text-sm leading-7 text-white/70">
              Base verification, ritual publishing, and token-linked access now
              live under one surface.
            </p>
          </div>
        </div>
      </section>

      <nav aria-label="Primary" className="border-t border-white/10 pt-8">
        <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
          {navItems.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="panel block rounded-xl px-4 py-3 transition hover:border-white/20 hover:bg-white/10"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SpotifySpotlight />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <FeedPreview />
        <TokenPreview />
      </section>

      <section className="border-t border-white/10 pt-8">
        <SignInWithBasePanelShell />
      </section>
    </main>
  );
}
