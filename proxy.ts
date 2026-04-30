import { NextRequest, NextResponse } from "next/server";

const STREAM_HOST = "stream.witchinghourmac.com";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];

  if (host !== STREAM_HOST) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") {
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = "/stream";
    return NextResponse.rewrite(rewrittenUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
