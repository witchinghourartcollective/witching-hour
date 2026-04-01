"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SpotifyArtistHighlight } from "@/lib/spotify";

type SpotifyHighlightResponse = {
  highlight: SpotifyArtistHighlight | null;
  error?: string;
};

function formatReleaseDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

function formatReleaseType(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function SpotifySpotlight() {
  const [spotify, setSpotify] = useState<SpotifyArtistHighlight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHighlight() {
      try {
        const response = await fetch("/api/spotify/highlight", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Spotify highlight request failed with ${response.status}`);
        }

        const payload = (await response.json()) as SpotifyHighlightResponse;

        if (!cancelled) {
          setSpotify(payload.highlight);
        }
      } catch {
        if (!cancelled) {
          setSpotify(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHighlight();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !spotify) {
    return (
      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_80px_rgba(106,0,255,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/70">
            Spotify Sync
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Connect Spotify once and the site updates itself.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-white/70">
            Add <code>SPOTIFY_CLIENT_ID</code>, <code>SPOTIFY_CLIENT_SECRET</code>,
            and <code>SPOTIFY_ARTIST_ID</code> to the app environment. After that,
            the homepage will pull the latest release from Spotify automatically.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_80px_rgba(106,0,255,0.12)] backdrop-blur md:grid-cols-[1.05fr_0.95fr] md:p-8">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/70">
            Spotify Spotlight
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Latest release syncs straight from Spotify.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-white/70">
            When a new single or album goes live on the configured artist profile,
            this section refreshes on its own without manual site edits.
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/30 p-4 sm:grid-cols-[120px_1fr]">
          {spotify.latestRelease.imageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={spotify.latestRelease.imageUrl}
                alt={`${spotify.latestRelease.name} cover art`}
                width={320}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                {spotify.artist.name}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {spotify.latestRelease.name}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/55">
              <span className="rounded-full border border-white/10 px-3 py-1">
                {formatReleaseType(spotify.latestRelease.type)}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                {formatReleaseDate(spotify.latestRelease.releaseDate)}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                {spotify.latestRelease.totalTracks} tracks
              </span>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              {spotify.latestRelease.url ? (
                <a
                  href={spotify.latestRelease.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 transition hover:border-emerald-300/50 hover:bg-emerald-300/15"
                >
                  Open release
                </a>
              ) : null}
              {spotify.artist.url ? (
                <a
                  href={spotify.artist.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/20 hover:bg-white/5"
                >
                  Artist profile
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40">
        <iframe
          title={`${spotify.latestRelease.name} Spotify embed`}
          src={spotify.latestRelease.embedUrl}
          width="100%"
          height="100%"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="min-h-[352px] border-0"
        />
      </div>
    </section>
  );
}
