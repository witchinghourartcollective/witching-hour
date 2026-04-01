import { NextResponse } from "next/server";
import { getSpotifyArtistHighlight } from "@/lib/spotify";

export async function GET() {
  try {
    const highlight = await getSpotifyArtistHighlight();

    return NextResponse.json({ highlight });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Spotify highlight fetch failed";

    return NextResponse.json(
      { highlight: null, error: message },
      { status: 200 },
    );
  }
}
