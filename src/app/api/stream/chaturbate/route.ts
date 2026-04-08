import { NextResponse } from "next/server";

import {
  getStreamConfig,
  isStreamProfileConfigured,
  toPublicStreamProfile,
} from "@/lib/stream";

export const dynamic = "force-dynamic";

export function GET() {
  const config = getStreamConfig();

  return NextResponse.json({
    configured: isStreamProfileConfigured(config.primary),
    secondaryConfigured: isStreamProfileConfigured(config.secondary),
    primary: toPublicStreamProfile(config.primary),
    secondary: toPublicStreamProfile(config.secondary),
  });
}
