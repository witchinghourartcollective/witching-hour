import Link from "next/link";

const infoLinks = [
  {
    title: "Feed",
    href: "/feed",
    description:
      "Open the feed and connect MetaMask for wallet actions and token interaction.",
  },
  {
    title: "Rich Jewelz",
    href: "/rich-jewelz",
    description:
      "Open the Rich Jewelz page for the adjacent collection and companion route.",
  },
] as const;

export default function Token() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:px-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_80px_rgba(106,0,255,0.12)] backdrop-blur md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Witching Hour
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            hOUR Token
          </h1>
          <div className="space-y-4 text-base leading-8 text-white/75">
            <p>
              The hOUR token is the on-chain signal layer for tipping,
              interaction, and future access mechanics across the Witching Hour
              system.
            </p>
            <p>
              It gives the site a cleaner structure by holding the project
              context and access paths in one place instead of spreading them
              across the top-level navigation.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">
            Token Notes
          </p>
          <dl className="mt-5 space-y-4 text-sm text-white/75">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <dt className="text-white/45">Role</dt>
              <dd className="text-right">Tipping and interaction</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <dt className="text-white/45">Network</dt>
              <dd className="text-right">Base</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-white/45">Position</dt>
              <dd className="text-right">Utility and access layer</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-amber-400/20 bg-amber-500/10 p-7 shadow-[0_0_80px_rgba(245,158,11,0.1)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/75">
            Launch Status
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            hOUR is surfaced, but trading is not live yet.
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-white/78">
            <p>
              The app can read the contract and show token state, but wallet
              transfers remain blocked until the owner enables trading on Base.
            </p>
            <p>
              If you are preparing a real launch, add liquidity first and then
              call <code>enableTrading()</code> from the owner wallet.
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-7">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">
            Launch Checklist
          </p>
          <ol className="mt-4 space-y-4 text-sm leading-7 text-white/75">
            <li>1. Confirm liquidity plan for the Base launch.</li>
            <li>2. Enable trading from the token owner wallet.</li>
            <li>3. Re-test the feed tip action with a funded wallet.</li>
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">
            Inside hOUR Token
          </p>
          <h2 className="mt-2 text-2xl font-medium text-white">
            About and access links
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {infoLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
            >
              <p className="text-lg font-medium text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
