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
            href="https://base.app/content/EkUKQwoVbmV0d29ya3MvYmFzZS1tYWlubmV0EioweDY5ZGJmYzk0NGZmZjdjNjhkYTFkMjRmZTBjNjUxNDM1NWE4MzI1ODU"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#c7a24b] underline-offset-4 hover:opacity-90"
          >
            Base.app
          </a>
        </li>
      </ul>
    </main>
  );
}
