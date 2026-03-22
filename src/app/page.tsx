import Image from "next/image";
import Link from "next/link";

const navItems = [
  ["Ritual", "/ritual"],
  ["Sigils", "/sigils"],
  ["About", "/about"],
  ["NFT", "/nft"],
  ["Mint", "/mint"],
  ["Litepaper", "/litepaper"],
  ["Press", "/press"],
  ["Access", "/access"],
  ["Calendar", "/calendar"],
  ["Links", "/links"],
  ["ESP32", "/esp32"],
  ["WAX Dashboard", "/dashboard"],
] as const;

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:px-10">
      <section className="grid gap-8 md:grid-cols-[1.3fr_0.9fr] md:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Witching Hour
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Witching Hour
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Welcome to the Witching Hour Music &amp; Art Collective.
          </p>
          <div className="space-y-4 text-base leading-8 text-white/75">
            <p>
              Witching Hour is a signal - a convergence of sound, symbol, and
              system. We work at the intersection of music, art, technology,
              and ritual, building structures that speak both to the machine and
              the human.
            </p>
            <p>
              This is not content for passive consumption. It is an invocation.
              What you interact with here is meant to be used, altered, and
              carried forward.
            </p>
            <p>
              Our NFT layer is designed for long-term creative access: music,
              visuals, studio sessions, and collaboration. See the About page
              for the live framework and utilities.
            </p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-xs rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_80px_rgba(106,0,255,0.18)] backdrop-blur">
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
              Music, art, ritual, and systems assembled into a public-facing
              portal.
            </p>
          </div>
        </div>
      </section>

      <nav aria-label="Primary" className="border-t border-white/10 pt-8">
        <ul className="grid gap-3 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/10"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
