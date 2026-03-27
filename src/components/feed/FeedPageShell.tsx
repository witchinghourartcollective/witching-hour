"use client";

import { useEffect, useState } from "react";

export function FeedPageShell() {
  const [FeedClient, setFeedClient] = useState<(() => React.ReactNode) | null>(
    null,
  );

  useEffect(() => {
    void import("./FeedClient").then((module) => {
      setFeedClient(() => module.FeedClient);
    });
  }, []);

  if (!FeedClient) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:px-10">
        <div className="panel rounded-[2rem] p-8 text-white/70">
          Loading feed...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:px-10">
      <FeedClient />
    </main>
  );
}
