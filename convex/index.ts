import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  auth: process.env.CONVEX_API_KEY!, // your Convex API key or auth
});

export default convex;
