import { auth0 } from "@/lib/auth0";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="archive-page">
        <section className="section-frame">
          <p className="section-frame__eyebrow">Account</p>
          <h1>Sign in to your WHM account.</h1>
          <p>
            Use Auth0 Universal Login to create an account or continue with an
            existing one.
          </p>
          <p>
            <a href="/auth/login?screen_hint=signup">Signup</a>
            {" / "}
            <a href="/auth/login">Login</a>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="archive-page">
      <section className="section-frame">
        <p className="section-frame__eyebrow">Account</p>
        <h1>Logged in as {session.user.email ?? session.user.name}</h1>
        <pre>{JSON.stringify(session.user, null, 2)}</pre>
        <p>
          <a href="/auth/logout">Logout</a>
        </p>
      </section>
    </main>
  );
}
