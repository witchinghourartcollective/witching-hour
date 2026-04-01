type SpotifyImage = {
  url: string;
  height: number | null;
  width: number | null;
};

type SpotifyArtist = {
  id: string;
  name: string;
  external_urls?: {
    spotify?: string;
  };
};

type SpotifyAlbum = {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  total_tracks: number;
  external_urls?: {
    spotify?: string;
  };
  images: SpotifyImage[];
};

type SpotifyAlbumsResponse = {
  items: SpotifyAlbum[];
};

export type SpotifyArtistHighlight = {
  artist: {
    id: string;
    name: string;
    url: string | null;
  };
  latestRelease: {
    id: string;
    name: string;
    type: string;
    releaseDate: string;
    totalTracks: number;
    url: string | null;
    imageUrl: string | null;
    embedUrl: string;
  };
};

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_MARKET = process.env.SPOTIFY_MARKET ?? "US";
const SPOTIFY_REVALIDATE_SECONDS = 300;

function getSpotifyConfig() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const artistId = process.env.SPOTIFY_ARTIST_ID;

  if (!clientId || !clientSecret || !artistId) {
    return null;
  }

  return { clientId, clientSecret, artistId };
}

async function getSpotifyAccessToken(clientId: string, clientSecret: string) {
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    next: { revalidate: SPOTIFY_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed with ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("Spotify token response did not include an access token");
  }

  return data.access_token;
}

async function spotifyFetch<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${SPOTIFY_API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: SPOTIFY_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Spotify API request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

function buildReleaseEmbedUrl(releaseId: string) {
  return `https://open.spotify.com/embed/album/${releaseId}?utm_source=generator`;
}

function pickLargestImage(images: SpotifyImage[]) {
  return [...images].sort((left, right) => (right.width ?? 0) - (left.width ?? 0))[0] ?? null;
}

function sortByReleaseDateDesc(albums: SpotifyAlbum[]) {
  return [...albums].sort((left, right) => {
    return new Date(right.release_date).getTime() - new Date(left.release_date).getTime();
  });
}

export async function getSpotifyArtistHighlight(): Promise<SpotifyArtistHighlight | null> {
  const config = getSpotifyConfig();

  if (!config) {
    return null;
  }

  const accessToken = await getSpotifyAccessToken(config.clientId, config.clientSecret);

  const [artist, albumsResponse] = await Promise.all([
    spotifyFetch<SpotifyArtist>(`/artists/${config.artistId}`, accessToken),
    spotifyFetch<SpotifyAlbumsResponse>(
      `/artists/${config.artistId}/albums?include_groups=album,single&limit=10&market=${encodeURIComponent(
        SPOTIFY_MARKET,
      )}`,
      accessToken,
    ),
  ]);

  const latestRelease = sortByReleaseDateDesc(albumsResponse.items)[0];

  if (!latestRelease) {
    return null;
  }

  const image = pickLargestImage(latestRelease.images);

  return {
    artist: {
      id: artist.id,
      name: artist.name,
      url: artist.external_urls?.spotify ?? null,
    },
    latestRelease: {
      id: latestRelease.id,
      name: latestRelease.name,
      type: latestRelease.album_type,
      releaseDate: latestRelease.release_date,
      totalTracks: latestRelease.total_tracks,
      url: latestRelease.external_urls?.spotify ?? null,
      imageUrl: image?.url ?? null,
      embedUrl: buildReleaseEmbedUrl(latestRelease.id),
    },
  };
}
