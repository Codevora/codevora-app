import {NextResponse} from "next/server";
import withAuth from "./middlewares/withAuth";
import type {NextRequest} from "next/server";

export default withAuth(
 function middleware(request: NextRequest) {
  // Middleware dasar yang akan di-wrap oleh withAuth
  return NextResponse.next();
 },
 {
  requireAuth: ["/admin", "/member", "/profile"],
  requireAdmin: ["/admin"],
 }
);

export const config = {
 matcher: [
  /*
   * Match all request paths except:
   * - api/ routes
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder
   * - auth routes (login, register, etc)
   */
  "/((?!api|_next/static|_next/image|favicon.ico|login|register|auth).*)",
 ],
};
