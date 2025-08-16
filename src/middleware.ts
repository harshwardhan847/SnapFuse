import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher(["/"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
// const ignoredRoutes = createRouteMatcher(["/chatbot"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log(userId, req.url);

  if (isPublicRoute(req)) {
    if (userId) {
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
    return;
  }

  if (!userId && isApiRoute(req)) {
    return;
  }
  if (userId) {
    await auth.protect();
  } else {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if (ignoredRoutes(req)) {
  //   return;
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
