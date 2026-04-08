export type StreamProfile = {
  username: string;
  eventsApiUrl: string;
  publicEventsApiUrl: string;
  statsApiUrl: string;
};

export type PublicStreamProfile = {
  username: string;
  publicEventsApiUrl: string;
};

export function getStreamConfig() {
  const primary: StreamProfile = {
    username: process.env.STREAM_CHATURBATE_USERNAME ?? "",
    eventsApiUrl: process.env.STREAM_CHATURBATE_EVENTS_API_URL ?? "",
    publicEventsApiUrl: process.env.STREAM_CHATURBATE_PUBLIC_EVENTS_API_URL ?? "",
    statsApiUrl: process.env.STREAM_CHATURBATE_STATS_API_URL ?? "",
  };

  const secondary: StreamProfile = {
    username: process.env.STREAM_CHATURBATE_SECONDARY_USERNAME ?? "",
    eventsApiUrl:
      process.env.STREAM_CHATURBATE_SECONDARY_EVENTS_API_URL ?? "",
    publicEventsApiUrl:
      process.env.STREAM_CHATURBATE_SECONDARY_PUBLIC_EVENTS_API_URL ?? "",
    statsApiUrl: process.env.STREAM_CHATURBATE_SECONDARY_STATS_API_URL ?? "",
  };

  return { primary, secondary };
}

export function isStreamProfileConfigured(profile: StreamProfile) {
  return Object.values(profile).every(Boolean);
}

export function toPublicStreamProfile(
  profile: StreamProfile,
): PublicStreamProfile {
  return {
    username: profile.username,
    publicEventsApiUrl: profile.publicEventsApiUrl,
  };
}
