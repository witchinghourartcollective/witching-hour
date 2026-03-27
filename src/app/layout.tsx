import "./globals.css";
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
      </head>
      <body>
        <DevExtensionErrorFilter />
        <ProvidersBoundary>{children}</ProvidersBoundary>
      </body>
    </html>
  );
}
