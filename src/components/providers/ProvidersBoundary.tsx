"use client";

import { useEffect, useState } from "react";

export function ProvidersBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [AppProviders, setAppProviders] = useState<
    | ((props: { children: React.ReactNode }) => React.ReactNode)
    | null
  >(null);

  useEffect(() => {
    setMounted(true);
    void import("./AppProviders").then((module) => {
      setAppProviders(() => module.AppProviders);
    });
  }, []);

  if (!mounted || !AppProviders) {
    return <>{children}</>;
  }

  return <AppProviders>{children}</AppProviders>;
}
