"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
};

export function BlogClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const response = await fetch("https://api.vercel.app/blog", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Blog request failed with ${response.status}`);
        }

        const payload = (await response.json()) as Post[];

        if (!cancelled) {
          setPosts(payload);
        }
      } catch (caughtError) {
        if (!cancelled) {
          const message =
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load blog posts right now.";

          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12 md:px-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/45">
          Blog Demo
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Blog Posts
        </h1>
        <p className="max-w-2xl text-base leading-7 text-white/70">
          This page now loads its demo posts at runtime so production builds do
          not depend on an external API being reachable.
        </p>
      </header>

      {loading ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/65">
          Loading posts...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 p-6 text-sm leading-7 text-white/78">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
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
      ) : null}
    </main>
  );
}
