import { getAzureOpenAIConfig } from "@/lib/azure-openai";
import { getHourBalance } from "@/lib/hour-token";
import { generateGroundedWebResponse } from "@/lib/web-grounding";
import { isAddress } from "viem";

export async function POST(req: Request) {
  try {
    const { prompt, address } = await req.json();
    const trimmedPrompt = typeof prompt === "string" ? prompt.trim() : "";

    if (!address || typeof address !== "string") {
      return new Response("Wallet address is required.", { status: 400 });
    }

    if (!isAddress(address)) {
      return new Response("Wallet address is invalid.", { status: 400 });
    }

    if (!trimmedPrompt) {
      return new Response("Prompt is required.", { status: 400 });
    }

    const balance = await getHourBalance(address);

    if (balance <= 0n) {
      return new Response("ACCESS DENIED — HOLD hOUR", { status: 403 });
    }

    const text = await generateGroundedWebResponse(trimmedPrompt);

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const { model, baseUrl, projectEndpoint } = getAzureOpenAIConfig();
    const message = err instanceof Error ? err.message : "SERVER ERROR";
    const hint =
      message.includes("DeploymentNotFound") && model
        ? ` AZURE_OPENAI_MODEL is set to "${model}". Update it to a deployed model for ${baseUrl || projectEndpoint || "this Azure resource"}.`
        : "";

    return new Response(`${message}${hint}`, { status: 500 });
  }
}
