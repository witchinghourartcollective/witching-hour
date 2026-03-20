export default function FeedPreview() {
  return (
    <section className="px-6 py-12 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-6 text-purple-500">Ritual Feed</h2>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-gray-800 rounded-xl">
            <p className="text-sm text-gray-400">0x... ritual #{i}</p>
            <p className="mt-2">Signal placeholder</p>
          </div>
        ))}
      </div>
    </section>
  );
}
