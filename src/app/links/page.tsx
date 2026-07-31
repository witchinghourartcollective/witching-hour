export default function Links() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-sm tracking-[0.4em] uppercase opacity-80">
        Links
      </h1>
      <ul className="space-y-3 text-sm">
        <li>
          <a
            href="https://instagram.com/fletchervaughn"
            className="underline decoration-[#c7a24b] underline-offset-4 hover:opacity-90"
          >
            Instagram
          </a>
        </li>
        <li>
          <a
            href="https://youtube.com/witchinghourmac"
            className="underline decoration-[#c7a24b] underline-offset-4 hover:opacity-90"
          >
            YouTube
          </a>
        </li>
        <li>
          <a
            href="https://www.reddit.com/r/HighTechHoodoo/"
            className="underline decoration-[#c7a24b] underline-offset-4 hover:opacity-90"
          >
            Reddit — r/HighTechHoodoo
          </a>
        </li>
      </ul>

      <div className="w-full max-w-xs border-t border-white/10 pt-6">
        <p className="text-xs tracking-[0.35em] uppercase opacity-50 mb-3">On-Chain</p>
        <ul className="space-y-3 text-sm">
          <li>
            <a
              href="https://bscscan.com/tx/0xce343ae1dc2363ae09388b98313cce2cc3f8271e8360d1886eb344cd7043651f"
              className="underline decoration-[#c7a24b] underline-offset-4 hover:opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >
              BSCScan
            </a>
          </li>
          <li>
            <a
              href="https://basescan.org"
              className="underline decoration-[#c7a24b] underline-offset-4 hover:opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >
              Basescan
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
