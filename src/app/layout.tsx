import "./globals.css";
import { DevExtensionErrorFilter } from "../components/DevExtensionErrorFilter";
import { AppProviders } from "../components/providers/AppProviders";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DevExtensionErrorFilter />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
