import "./globals.css";
import { DevExtensionErrorFilter } from "../components/DevExtensionErrorFilter";
import { ProvidersBoundary } from "../components/providers/ProvidersBoundary";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="base:app_id" content="69c39a7a6d153fb47b06adc5" />
      </head>
      <body>
        <DevExtensionErrorFilter />
        <ProvidersBoundary>{children}</ProvidersBoundary>
      </body>
    </html>
  );
}
