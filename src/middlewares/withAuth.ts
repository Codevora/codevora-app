import {getToken} from "next-auth/jwt";
import {
 NextFetchEvent,
 NextMiddleware,
 NextRequest,
 NextResponse,
} from "next/server";

interface AuthMiddlewareOptions {
 requireAuth?: string[];
 requireAdmin?: string[];
 publicRoutes?: string[];
}

export default function withAuth(
 middleware: NextMiddleware,
 options: AuthMiddlewareOptions = {}
) {
 return async (req: NextRequest, next: NextFetchEvent) => {
  const pathname = req.nextUrl.pathname;
  const {requireAuth = [], requireAdmin = []} = options;

  // 1. Handle redirects untuk route dasar
  if (pathname === "/admin") {
   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (pathname === "/member") {
   return NextResponse.redirect(new URL("/member/dashboard", req.url));
  }

  // 2. Ambil token
  const token = await getToken({
   req,
   secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. Definisikan route yang perlu proteksi
  const isProtectedRoute = requireAuth.some(
   (route) =>
    pathname.startsWith(route) || pathname === route.replace(/\/\*$/, "")
  );

  const isAdminRoute = requireAdmin.some((route) => pathname.startsWith(route));

  const isAuthPage = ["/sign-up", "/auth/sign-up", "/auth"].includes(pathname);

  // 4. Logic proteksi route
  if (isProtectedRoute) {
   // Jika tidak ada token
   if (!token) {
    const url = new URL("/auth/sign-in", req.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
   }

   // Jika route admin tapi bukan role admin
   if (isAdminRoute && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
   }
  }

  // 5. Redirect jika sudah login tapi mengakses halaman auth
  if (isAuthPage && token) {
   return NextResponse.redirect(new URL("/", req.url));
  }

  // 6. Tambahkan header untuk informasi user
  const requestHeaders = new Headers(req.headers);
  if (token) {
   requestHeaders.set("x-user-id", token.id);
   requestHeaders.set("x-user-role", token.role);
  }

  return middleware(req, next);
 };
}
