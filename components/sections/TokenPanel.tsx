export default function TokenPanel() {
  return (
    <section className="px-6 py-12 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-6 text-sigil">hOUR Token</h2>

      <div className="p-6 border border-gray-800 rounded-xl bg-black/40">
        <p className="text-gray-400 text-sm">Token Status</p>

        <div className="mt-4">
          <p>Total Supply: 21,369,777</p>
          <p>Network: Base</p>
        </div>

        <button className="mt-6 px-4 py-2 bg-sigil rounded-lg">
          Add Liquidity
        </button>
      </div>
    </section>
  );
}
