export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6">
      <h1 className="text-6xl font-bold text-purple-500 mb-6">
        WITCHING HOUR
      </h1>

      <p className="text-gray-400 max-w-xl mb-10">
        Ritual-based social layer for creators, tokens, and signal.
      </p>

      <div className="flex gap-4">
        <a href="/feed" className="px-6 py-3 bg-purple-600 rounded-xl">
          Enter Ritual
        </a>

        <a href="/token" className="px-6 py-3 border border-gray-700 rounded-xl">
          Token
        </a>
      </div>
    </section>
  );
}
