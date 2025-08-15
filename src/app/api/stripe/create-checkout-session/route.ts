import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import {
  SUBSCRIPTION_PLANS,
  TOPUP_OPTIONS,
  getPlanById,
  getTopupById,
} from "@/config/pricing";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, planId, topupId } = await req.json();

    if (!type || (type !== "subscription" && type !== "topup")) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    let priceId: string;
    let mode: "subscription" | "payment" = "payment";
    let successUrl = `${process.env.APP_BASE_URL}/success`;
    let cancelUrl = `${process.env.APP_BASE_URL}/pricing`;

    if (type === "subscription") {
      const plan = getPlanById(planId);
      if (!plan || plan.id === "free") {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }
      priceId = plan.priceId;
      mode = "subscription";
      successUrl = `${process.env.APP_BASE_URL}/success?subscription=success`;
    } else {
      const topup = getTopupById(topupId);
      if (!topup) {
        return NextResponse.json({ error: "Invalid topup" }, { status: 400 });
      }
      priceId = topup.priceId;
      successUrl = `${process.env.APP_BASE_URL}/success?topup=success`;
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: undefined, // Let Stripe handle this
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        type,
        planId: planId || "",
        topupId: topupId || "",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
