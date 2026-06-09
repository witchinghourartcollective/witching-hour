"use client";

import { useEffect, useState } from "react";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Failed to load Base verification panel.";
  }
}

export function SignInWithBasePanelShell() {
  const [mounted, setMounted] = useState(false);
  const [SignInWithBasePanel, setSignInWithBasePanel] = useState<
    (() => React.ReactNode) | null
  >(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    void import("./SignInWithBasePanel")
      .then((module) => {
        setSignInWithBasePanel(() => module.SignInWithBasePanel);
      })
      .catch((error) => {
        setLoadError(getErrorMessage(error));
      });
  }, []);

  if (loadError) {
    return (
      <div className="rounded-[2rem] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100 shadow-[0_0_80px_rgba(127,29,29,0.18)] backdrop-blur">
        {loadError}
      </div>
    );
  }

  if (!mounted || !SignInWithBasePanel) {
    return (
      <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 text-sm text-white/70 shadow-[0_0_80px_rgba(0,102,255,0.14)] backdrop-blur">
        Loading Base verification...
      </div>
    );
  }

  return <SignInWithBasePanel />;
}
