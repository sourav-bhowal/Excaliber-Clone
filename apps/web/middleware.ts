import { auth } from "./app/api/auth/[...nextauth]/auth";

export default auth((req) => {
  if (!req.auth && (
    req.nextUrl.pathname.startsWith("/canvas") ||
    req.nextUrl.pathname.startsWith("/room")
  )) {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (
    req.auth &&
    (req.nextUrl.pathname.startsWith("/signin") ||
      req.nextUrl.pathname.startsWith("/signup"))
  ) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/signin", "/signup", "/", "/canvas/:path*", "/room/:path*"],
};
