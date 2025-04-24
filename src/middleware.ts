import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
 function middleware(req) {
  // Redirect logic based on role or other conditions
  const {pathname, origin} = req.nextUrl;
  const {token} = req.nextauth;

  // Jika mencoba mengakses halaman admin tanpa role admin
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
   return NextResponse.redirect(`${origin}/unauthorized`);
  }

  // Redirect setelah login
  if (pathname === "/auth/sign-in" && token) {
   return NextResponse.redirect(`${origin}/admin/dashboard`);
  }

  // Redirect setelah registrasi
  if (pathname === "/register" && token) {
   return NextResponse.redirect(`${origin}/admin/dashboard`);
  }
 },
 {
  callbacks: {
   authorized: ({token}) => {
    // Jika token ada, user terautentikasi
    return !!token;
   },
  },
  pages: {
   signIn: "/auth/sign-in",
   error: "/error",
  },
 }
);

export const config = {
 matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/sign-in", "/register"],
};
