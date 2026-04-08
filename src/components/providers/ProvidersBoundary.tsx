"use client";

import { AppProviders } from "./AppProviders";

export function ProvidersBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppProviders>{children}</AppProviders>;
}
