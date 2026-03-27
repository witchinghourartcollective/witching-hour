"use client";

import { useEffect, useState } from "react";

export function SignInWithBasePanelShell() {
  const [mounted, setMounted] = useState(false);
  const [SignInWithBasePanel, setSignInWithBasePanel] = useState<
    (() => React.ReactNode) | null
  >(null);

  useEffect(() => {
    setMounted(true);
    void import("./SignInWithBasePanel").then((module) => {
      setSignInWithBasePanel(() => module.SignInWithBasePanel);
    });
  }, []);

  if (!mounted || !SignInWithBasePanel) {
    return (
      <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 text-sm text-white/70 shadow-[0_0_80px_rgba(0,102,255,0.14)] backdrop-blur">
        Loading Base verification...
      </div>
    );
  }

  return <SignInWithBasePanel />;
}
