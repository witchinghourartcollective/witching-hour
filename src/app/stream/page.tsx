import {
  getStreamConfig,
  isStreamProfileConfigured,
  toPublicStreamProfile,
  type PublicStreamProfile,
} from "@/lib/stream";

const profileLinks = [
  ["Events API (public)", "publicEventsApiUrl"],
] as const;

function StreamCard({
  title,
  subtitle,
  profile,
  isConfigured,
}: {
  title: string;
  subtitle: string;
  profile: PublicStreamProfile;
  isConfigured: boolean;
}) {
  return (
    <section
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 32,
        padding: 32,
        background: "rgba(17, 10, 24, 0.82)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
      }}
    >
      <div
        style={{
          paddingBottom: 24,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {title}
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 28 }}>
          {profile.username || "Not configured"}
        </p>
        <p
          style={{
            margin: "10px 0 0",
            lineHeight: 1.7,
            color: "rgba(245,235,255,0.7)",
          }}
        >
          {subtitle}
        </p>
      </div>

      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        {profileLinks.map(([label, key]) => {
          const href = profile[key];

          return (
            <div
              key={label}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24,
                padding: 20,
                background: "rgba(0,0,0,0.24)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    marginTop: 12,
                    color: "#ffb86c",
                    lineHeight: 1.7,
                    wordBreak: "break-all",
                  }}
                >
                  {href}
                </a>
              ) : (
                <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.55)" }}>
                  Not configured
                </p>
              )}
            </div>
          );
        })}
      </div>

      <pre
        style={{
          marginTop: 24,
          overflowX: "auto",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.3)",
          padding: 20,
          color: "rgba(255,255,255,0.82)",
          lineHeight: 1.7,
        }}
      >
        {JSON.stringify(
          {
            configured: isConfigured,
            ...profile,
          },
          null,
          2,
        )}
      </pre>
    </section>
  );
}

export default function StreamPage() {
  const config = getStreamConfig();
  const primary = toPublicStreamProfile(config.primary);
  const secondary = toPublicStreamProfile(config.secondary);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 24px",
        background:
          "radial-gradient(circle at top, rgba(139, 92, 246, 0.18), transparent 28%), linear-gradient(180deg, #11071a 0%, #050308 100%)",
        color: "#f5ebff",
        fontFamily: '"Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif',
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 960, display: "grid", gap: 24 }}>
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 32,
            padding: 32,
            background: "rgba(17, 10, 24, 0.82)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.56)",
              fontSize: 12,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
            }}
          >
            Witching Hour Stream
          </p>
          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.05,
              fontFamily:
                '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif',
            }}
          >
            Stream profile attached.
          </h1>
          <p
            style={{
              margin: "20px 0 0",
              maxWidth: 720,
              lineHeight: 1.8,
              color: "rgba(245,235,255,0.75)",
            }}
          >
            This host publishes the primary Chaturbate profile for
            <code> mirrorizm </code>
            and keeps a secondary area for
            <code> bouttocookup </code>.
            Only public-safe fields are exposed here and in
            <code> /api/stream/chaturbate</code>.
          </p>
        </section>

        <div style={{ display: "grid", gap: 24 }}>
          <StreamCard
            title="Primary Stream"
            subtitle="Primary stream slot for mirrorizm."
            profile={primary}
            isConfigured={isStreamProfileConfigured(config.primary)}
          />
          <StreamCard
            title="Secondary Stream"
            subtitle="Secondary stream slot for bouttocookup."
            profile={secondary}
            isConfigured={isStreamProfileConfigured(config.secondary)}
          />
        </div>
      </div>
    </main>
  );
}
