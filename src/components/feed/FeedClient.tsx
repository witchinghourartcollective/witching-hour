"use client";

import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useChainId, useReadContract, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { TransactionButton } from "@/components/wallet/TransactionButton";
import { HOUR_TOKEN } from "@/lib/token";

type RitualPost = {
  id: string;
  user_address: string;
  content: string;
  created_at: string;
};

const tipCall = {
  address: HOUR_TOKEN.address,
  abi: HOUR_TOKEN.abi,
  functionName: "transfer",
  args: [
    "0xA327c87770893178144C422511cfaC682c926C6A",
    parseUnits("1", HOUR_TOKEN.decimals),
  ],
} as const;

const tipAmount = parseUnits("1", HOUR_TOKEN.decimals);

export function FeedClient() {
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<RitualPost[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Signal archive idle.");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { data: hourBalance } = useReadContract({
    address: HOUR_TOKEN.address,
    abi: HOUR_TOKEN.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: Boolean(address),
    },
  });
  const { data: tradingEnabled } = useReadContract({
    address: HOUR_TOKEN.address,
    abi: HOUR_TOKEN.abi,
    functionName: "tradingEnabled",
    chainId: base.id,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      setIsLoadingPosts(true);

      try {
        const response = await fetch("/api/posts", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("The ritual archive did not respond.");
        }

        const payload = (await response.json()) as RitualPost[];

        if (isMounted) {
          setPosts(payload);
          setStatus(
            payload.length
              ? "Signal archive synced."
              : "No rituals yet. Be the first transmission.",
          );
        }
      } catch (loadError) {
        if (isMounted) {
          setStatus(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the ritual archive.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingPosts(false);
        }
      }
    }

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const switchChain = async (targetChainId: typeof base.id) => {
    try {
      setError("");
      await switchChainAsync({ chainId: targetChainId });
    } catch {
      setError("Network switch was rejected or is not supported by this wallet.");
    }
  };

  async function handlePostSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConnected || !address) {
      setStatus("Connect a wallet before posting to the ritual archive.");
      return;
    }

    const content = draft.trim();

    if (!content) {
      setStatus("Write a transmission before invoking the feed.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Etching your ritual into the archive...");

    try {
      const postId = crypto.randomUUID();

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          user: address,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("The app could not store that ritual.");
      }

      const nextPost: RitualPost = {
        id: postId,
        user_address: address,
        content,
        created_at: new Date().toISOString(),
      };

      setPosts((currentPosts) => [nextPost, ...currentPosts]);
      setDraft("");
      setStatus("Ritual published.");
    } catch (submitError) {
      setStatus(
        submitError instanceof Error
          ? submitError.message
          : "Unexpected error while posting.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isOnBase = chainId === base.id;
  const displayNetwork = isOnBase ? "Base" : `Chain ${chainId}`;
  const hasEnoughHour = typeof hourBalance === "bigint" && hourBalance >= tipAmount;
  const isTradingLive = tradingEnabled === true;
  const formattedHourBalance =
    typeof hourBalance === "bigint"
      ? formatUnits(hourBalance, HOUR_TOKEN.decimals)
      : null;
  const tipDisabledReason = !isConnected
    ? null
    : !isOnBase
      ? "Switch to Base before sending hOUR."
      : tradingEnabled !== true
        ? "hOUR transfers are not live yet. The token contract still has trading disabled on Base."
      : typeof hourBalance !== "bigint"
        ? "Loading hOUR balance..."
        : !hasEnoughHour
          ? `This wallet holds ${formattedHourBalance} ${HOUR_TOKEN.symbol}. You need at least 1 ${HOUR_TOKEN.symbol} to send a tip.`
          : null;

  return (
    <div className="space-y-8">
      <section className="panel rounded-[2rem] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow">Ritual Feed</p>
            <h1 className="mt-4 text-4xl text-white md:text-5xl">
              Wallet-authored transmissions on the Witching Hour surface.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
              Publish short ritual notes, keep the archive moving, and interact
              with hOUR only on Base. The feed should feel ceremonial, but the
              rules stay explicit.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6">
            <p className="eyebrow">Current State</p>
            <div className="mt-4 space-y-3 text-sm text-white/78">
              <p>Wallet: {isConnected && address ? address : "Not connected"}</p>
              <p>Network: {isConnected ? displayNetwork : "Awaiting sign-in"}</p>
              <p>Trading: {isTradingLive ? "Live" : "Disabled"}</p>
              <p>
                hOUR Balance:{" "}
                {isConnected
                  ? formattedHourBalance
                    ? `${formattedHourBalance} ${HOUR_TOKEN.symbol}`
                    : "Loading..."
                  : "Connect wallet"}
              </p>
              <p>Status: {status}</p>
            </div>
            <div className="mt-5">
              <WalletConnect className="flex-wrap" />
            </div>
            <button
              type="button"
              onClick={() => switchChain(base.id)}
              disabled={!isConnected || isSwitching}
              className="mt-4 rounded-full border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/78 transition hover:border-white/24 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSwitching ? "Switching..." : isOnBase ? "On Base" : "Switch to Base"}
            </button>
            {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handlePostSubmit}
          className="panel rounded-[2rem] p-7"
        >
          <p className="eyebrow">Compose</p>
          <h2 className="mt-3 text-3xl text-white">Open the next invocation.</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Connected wallets can publish short signals into the archive. Keep
            it brief, readable, and intentional.
          </p>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={280}
            placeholder="Write a ritual note, release signal, or midnight transmission..."
            className="mt-6 min-h-40 w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-300/40"
          />
          <div className="mt-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-white/45">
            <span>{draft.trim().length}/280 glyphs</span>
            <span>{isOnBase ? "Base aligned" : "Switch to Base for token actions"}</span>
          </div>
          <button
            type="submit"
            disabled={!isConnected || isSubmitting}
            className="ritual-button mt-6 rounded-full px-5 py-3 text-sm font-medium"
          >
            {isSubmitting ? "Publishing..." : "Publish ritual"}
          </button>
        </form>

        <div className="panel rounded-[2rem] p-7">
          <p className="eyebrow">hOUR Action</p>
          <h2 className="mt-3 text-3xl text-white">Tip the signal lane.</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            The token interaction remains explicit and Base-scoped. No silent
            cross-chain writes.
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <TransactionButton
              call={tipCall}
              chainId={base.id}
              buttonText="Tip 1 hOUR"
              disabled={!isConnected || Boolean(tipDisabledReason)}
              disabledMessage={tipDisabledReason}
            />
          </div>
        </div>
      </section>

      <section className="panel rounded-[2rem] p-7">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Archive</p>
            <h2 className="mt-2 text-3xl text-white">Recent transmissions</h2>
          </div>
          <p className="text-sm text-white/55">
            {isLoadingPosts ? "Syncing archive..." : `${posts.length} ritual entries`}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {isLoadingPosts ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm text-white/65">
              Loading transmissions...
            </div>
          ) : posts.length ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"
              >
                <div className="flex flex-col gap-2 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
                  <span className="uppercase tracking-[0.18em] text-fuchsia-200/72">
                    {post.user_address}
                  </span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-4 text-base leading-8 text-white/82">
                  {post.content}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-black/20 p-5 text-sm leading-7 text-white/65">
              No rituals have been published yet. Connect a wallet and open the
              first signal.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
