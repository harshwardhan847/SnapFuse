import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";

import type { WebhookEvent } from "@clerk/backend";
import { ConvexHttpClient } from "convex/browser";
import { api, internal } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  auth: process.env.CONVEX_API_KEY!, // your Convex API key or auth
});
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
const webhook = new Webhook(WEBHOOK_SECRET);

export async function POST(req: NextRequest) {
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  const payloadString = await req.text();

  let event: WebhookEvent;
  try {
    event = webhook.verify(payloadString, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Webhook verification failed", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "user.created":
    case "user.updated":
      await convex.mutation(api.users.upsertFromClerk, {
        data: event.data,
      });
      break;
    case "user.deleted":
      if (!event.data.id) return new Response(null, { status: 500 });
      await convex.mutation(api.users.deleteFromClerk, {
        clerkUserId: event.data.id,
      });
      break;
    default:
      // unhandled event, ignore
      break;
  }

  return NextResponse.json(null, { status: 200 });
}
