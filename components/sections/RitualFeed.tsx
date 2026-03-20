export default function RitualFeed() {
  return (
    <section className="px-6 py-12 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-6 text-sigil">Ritual Feed</h2>

      <div className="space-y-4">
        {[1, 2, 3].map((r) => (
          <div
            key={r}
            className="p-4 border border-gray-800 rounded-xl bg-black/40"
          >
            <p className="text-sm text-gray-400">
              0x... ritual signal #{r}
            </p>
            <p className="mt-2">
              This is a placeholder for user-submitted ritual content.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
