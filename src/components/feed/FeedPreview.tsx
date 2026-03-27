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
    <section className="panel rounded-[2rem] p-7">
      <p className="eyebrow">Ritual Feed</p>
      <h2 className="mt-3 text-3xl text-white">A public surface, not a test harness.</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
        The feed is where connected wallets leave transmissions, tip the
        system, and build visible continuity around drops and releases.
      </p>

      <div className="mt-6 space-y-4">
        {previewItems.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4"
          >
            <p className="text-sm uppercase tracking-[0.22em] text-fuchsia-200/72">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-7 text-white/70">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
