export default function TokenPreview() {
  return (
    <section className="panel rounded-[2rem] p-7">
      <p className="eyebrow">hOUR Token</p>
      <h2 className="mt-3 text-3xl text-white">The access layer for the system.</h2>
      <div className="mt-6 space-y-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm text-white/75">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
          <span className="text-white/50">Network</span>
          <span>Base</span>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
          <span className="text-white/50">Use</span>
          <span>Tipping, access, and signal</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-white/50">State</span>
          <span>Live contract surfaced in-app</span>
        </div>
      </div>
      <a
        href="/token"
        className="ritual-button mt-6 inline-flex rounded-full px-5 py-3 text-sm font-medium"
      >
        Open token route
      </a>
    </section>
  );
}
