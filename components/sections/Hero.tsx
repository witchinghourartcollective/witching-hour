export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6">
      <h1 className="text-6xl font-bold text-sigil mb-6">
        WITCHING HOUR
      </h1>

      <p className="text-gray-400 max-w-xl mb-10">
        Ritual-based social layer for creators, tokens, and signal.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3 bg-sigil rounded-xl hover:opacity-80">
          Enter Ritual
        </button>

        <button className="px-6 py-3 border border-gray-700 rounded-xl hover:bg-gray-800">
          Whitepaper
        </button>
      </div>
    </section>
  );
}
