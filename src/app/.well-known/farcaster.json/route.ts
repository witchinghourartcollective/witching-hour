const defaultAppUrl = "https://app.witchinghourmac.com";

function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) {
    return defaultAppUrl;
  }

  return url.replace(/\/+$/, "");
}

export function GET() {
  const appUrl = getAppUrl();

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER ?? "",
      payload: process.env.FARCASTER_PAYLOAD ?? "",
      signature: process.env.FARCASTER_SIGNATURE ?? "",
    },
    baseBuilder: {
      ownerAddress: process.env.BASE_BUILDER_OWNER_ADDRESS ?? "",
    },
    miniapp: {
      version: "1",
      name: "Witching Hour",
      homeUrl: appUrl,
      iconUrl: `${appUrl}/logo/hour-basescan.svg`,
      splashImageUrl: `${appUrl}/logo/hour-basescan.svg`,
      splashBackgroundColor: "#000000",
      primaryCategory: "music",
      tags: ["music", "art", "ritual", "token", "base"],
      subtitle: "Base-native ritual feed",
      description:
        "Wallet-first creative surface for ritual publishing, signal, and hOUR participation on Base.",
      tagline: "Signal after dark",
      ogTitle: "Witching Hour",
      ogDescription: "Base-native ritual feed and hOUR access layer.",
      ogImageUrl: `${appUrl}/logo/hour-basescan.svg`,
    },
  };

  return Response.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
