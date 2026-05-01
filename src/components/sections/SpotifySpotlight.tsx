"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <AnimatePresence mode="wait">
      {loading || !spotify ? (
        <motion.section
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="panel grid gap-6 rounded-[2rem] p-6 shadow-[0_0_80px_rgba(106,0,255,0.08)] md:grid-cols-[1.1fr_0.9fr] md:p-8"
        >
          <div className="space-y-4">
            <p className="eyebrow text-emerald-400/70">Spotify Sync</p>
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Connect Spotify once and the site updates itself.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/50">
              Add <code>SPOTIFY_CLIENT_ID</code>, <code>SPOTIFY_CLIENT_SECRET</code>,
              and <code>SPOTIFY_ARTIST_ID</code> to the app environment. After that,
              the homepage will pull the latest release from Spotify automatically.
            </p>
          </div>
        </motion.section>
      ) : (
        <motion.section
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="panel grid gap-8 rounded-[2rem] p-6 shadow-[0_0_80px_rgba(106,0,255,0.08)] md:grid-cols-[1.05fr_0.95fr] md:p-8"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="eyebrow text-emerald-400/70">Spotify Spotlight</p>
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl leading-tight">
                Latest release syncs straight from Spotify.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-white/50">
                When a new single or album goes live on the configured artist profile,
                this section refreshes on its own without manual site edits.
              </p>
            </div>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="grid gap-5 rounded-[1.5rem] border border-white/10 bg-black/40 p-5 sm:grid-cols-[140px_1fr] backdrop-blur-sm"
            >
              {spotify.latestRelease.imageUrl ? (
                <div className="overflow-hidden rounded-xl border border-white/10 aspect-square">
                  <Image
                    src={spotify.latestRelease.imageUrl}
                    alt={`${spotify.latestRelease.name} cover art`}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              ) : null}

              <div className="flex flex-col justify-between py-1">
                <div className="space-y-1">
                  <p className="eyebrow text-white/40">
                    {spotify.artist.name}
                  </p>
                  <h3 className="text-2xl font-semibold text-white tracking-tight">
                    {spotify.latestRelease.name}
                  </h3>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                  <span className="rounded-full border border-white/10 px-3 py-1 bg-white/5">
                    {formatReleaseType(spotify.latestRelease.type)}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 bg-white/5">
                    {formatReleaseDate(spotify.latestRelease.releaseDate)}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 bg-white/5">
                    {spotify.latestRelease.totalTracks} tracks
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {spotify.latestRelease.url ? (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={spotify.latestRelease.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-300/20"
                    >
                      Open release
                    </motion.a>
                  ) : null}
                  {spotify.artist.url ? (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={spotify.artist.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white/70 transition-all hover:bg-white/10"
                    >
                      Artist profile
                    </motion.a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40 shadow-2xl">
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
        </motion.section>
      )}
    </AnimatePresence>
  );
}
