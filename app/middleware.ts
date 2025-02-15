import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Await the Promise

  if (userId && !isProtectedRoute(req)) {
    return Response.redirect(new URL("/dashboard", req.url)); // Redirect to dashboard
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|api/.*).*)"], // Protects everything except static assets
};