export default function Hero() {
  return (
    <section className="panel relative overflow-hidden rounded-[2rem] px-6 py-14 md:px-10 md:py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/60 to-transparent" />
      <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="eyebrow">Base-native creative system</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-none text-white md:text-7xl">
            Witching Hour turns wallets, signal, and art direction into one
            ritual surface.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/74 md:text-lg">
            Built for midnight drops, collector access, and token-aware social
            motion. This app is the operational layer behind the Witching Hour
            world, not a brochure for it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/feed"
              className="ritual-button inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium"
            >
              Enter the ritual feed
            </a>
            <a
              href="/token"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-black/20 px-6 py-3 text-sm font-medium text-white/82 transition hover:border-white/24 hover:bg-white/8"
            >
              Inspect hOUR token
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <p className="eyebrow">Mode</p>
            <p className="mt-3 text-lg text-white">Wallet-first publishing</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <p className="eyebrow">Chain</p>
            <p className="mt-3 text-lg text-white">Base for live interaction</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <p className="eyebrow">Tone</p>
            <p className="mt-3 text-lg text-white">Lore, signal, and utility</p>
          </div>
        </div>
      </div>
    </section>
  );
}
