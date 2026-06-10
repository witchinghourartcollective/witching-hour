import { getToken } from "@vercel/connect";

export function getWitchingHourToken() {
  return getToken("github/witching-hour-app", {
    subject: { type: "app" },
  });
}
