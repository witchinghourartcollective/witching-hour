import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { DevExtensionErrorFilter } from "../components/DevExtensionErrorFilter";
import { ProvidersBoundary } from "../components/providers/ProvidersBoundary";

const appUrl = "https://app.witchinghourmac.com";
const miniAppEmbed = JSON.stringify({
  version: "next",
  imageUrl: `${appUrl}/logo/hour-basescan.svg`,
  button: {
    title: "Open Witching Hour",
    action: {
      type: "launch_miniapp",
      name: "Witching Hour",
      url: appUrl,
      splashImageUrl: `${appUrl}/logo/hour-basescan.svg`,
      splashBackgroundColor: "#000000",
    },
  },
});

const devExtensionErrorGuard = `
(() => {
  const targetMessages = [
    "setExternalProvider is not a function",
    "destroyTonkeeper is not a function",
    "instance.destroyTonkeeper is not a function",
    "Attempting to use a disconnected port object",
    "Analytics SDK: TypeError: Failed to fetch",
    "AnalyticsSDKApiError",
  ];

  const isKnownExtensionError = (value) => {
    if (typeof value === "string") {
      return (
        targetMessages.some((target) => value.includes(target)) ||
        value.includes("chrome-extension://")
      );
    }

    if (!value || typeof value !== "object") return false;
    const message = typeof value.message === "string" ? value.message : "";
    const stack = typeof value.stack === "string" ? value.stack : "";

    return (
      targetMessages.some((target) => message.includes(target)) ||
      stack.includes("chrome-extension://") ||
      stack.includes("TonProvider")
    );
  };

  window.addEventListener(
    "error",
    (event) => {
      const message = typeof event.message === "string" ? event.message : "";
      const filename = typeof event.filename === "string" ? event.filename : "";

      if (
        filename.startsWith("chrome-extension://") ||
        targetMessages.some((target) => message.includes(target)) ||
        isKnownExtensionError(event.error)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      const stack =
        event.reason &&
        typeof event.reason === "object" &&
        typeof event.reason.stack === "string"
          ? event.reason.stack
          : "";

      if (
        isKnownExtensionError(event.reason) ||
        stack.includes("chrome-extension://")
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  const originalConsoleError = window.console.error.bind(window.console);
  window.console.error = (...args) => {
    const joined = args
      .map((arg) => {
        if (typeof arg === "string") return arg;
        if (arg instanceof Error) return [arg.message, arg.stack].filter(Boolean).join(" ");
        try {
          return JSON.stringify(arg);
        } catch {
          return "";
        }
      })
      .join(" ");

    if (
      joined.includes("chrome-extension://") &&
      (joined.includes("Analytics SDK") ||
        joined.includes("AnalyticsSDKApiError") ||
        joined.includes("Failed to fetch"))
    ) {
      return;
    }

    originalConsoleError(...args);
  };
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="base:app_id" content="69c39a7a6d153fb47b06adc5" />
        <meta name="fc:miniapp" content={miniAppEmbed} />
        {process.env.NODE_ENV === "development" ? (
          <Script
            id="dev-extension-error-guard"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: devExtensionErrorGuard }}
          />
        ) : null}
      </head>
      <body suppressHydrationWarning>
        <DevExtensionErrorFilter />
        <ProvidersBoundary>{children}</ProvidersBoundary>
        <Analytics />
      </body>
    </html>
  );
}
