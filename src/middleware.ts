import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define route matchers for easy route identification
const isPublicRoute = createRouteMatcher(["/"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/success",
  "/pricing",
  "/onboarding",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Log for debugging
  console.log("UserId:", userId, "| URL:", req.url);

  // 1. Public home route: redirect authenticated users to dashboard
  if (isPublicRoute(req)) {
    if (userId) {
      // Redirect logged-in users from home page to dashboard
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
    // Unauthenticated users allowed on home
    return NextResponse.next();
  }

  // 2. Allow API calls from unauthenticated users (public API endpoints)
  if (isApiRoute(req) && !userId) {
    return NextResponse.next();
  }

  // 3. Authenticated user flows
  if (userId) {
    // Protect authenticated routes (throws if not authorized)
    await auth.protect();

    // Allow onboarding route to all authenticated users
    if (isOnboardingRoute(req)) {
      return NextResponse.next();
    }

    // Allow protected routes (dashboard, success, etc.)
    if (isProtectedRoute(req)) {
      return NextResponse.next();
    }

    // Fallback: deny access to unknown routes for authenticated users
    if (isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
    return NextResponse.next();
  }

  // 4. Unauthenticated user trying to access protected route: redirect home
  if (isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 5. Default: allow through for non-protected/non-public/non-api requests
  return NextResponse.next();
});

// Matcher config ensures middleware runs for all relevant routes
export const config = {
  matcher: [
    // Ignore Next.js internals & static files (unless in search params)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
