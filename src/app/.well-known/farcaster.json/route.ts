const defaultAppUrl = "https://app.witchinghourmac.com";
const defaultOwnerAddress = "0xE7e0377E789fd576600D797FdD23c9A6350d8ABb";

function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) {
    return defaultAppUrl;
  }

  return url.replace(/\/+$/, "");
}

function withValidProperties<T extends Record<string, unknown>>(properties: T) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (!value) {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === "object") {
        return Object.values(value).some(Boolean);
      }

      return Boolean(value);
    }),
  );
}

export function GET() {
  const appUrl = getAppUrl();
  const ownerAddress =
    process.env.BASE_BUILDER_OWNER_ADDRESS?.trim() || defaultOwnerAddress;

  const manifest = withValidProperties({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER ?? "",
      payload: process.env.FARCASTER_PAYLOAD ?? "",
      signature: process.env.FARCASTER_SIGNATURE ?? "",
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
    baseBuilder: ownerAddress
      ? {
          ownerAddress,
        }
      : undefined,
  });

  return Response.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
