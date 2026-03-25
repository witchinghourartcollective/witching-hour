interface Post {
  id: string;
  title: string;
  content: string;
}

export const revalidate = 3600;

export default async function Page() {
  const data = await fetch("https://api.vercel.app/blog");
  const posts: Post[] = await data.json();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12 md:px-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/45">
          ISR Demo
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Blog Posts
        </h1>
        <p className="max-w-2xl text-base leading-7 text-white/70">
          This page is rendered on the server and revalidated every hour.
        </p>
      </header>

      <ul className="grid gap-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-xl font-medium text-white">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">
              {post.content}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
