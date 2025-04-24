import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {NextAuthOptions} from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcryptjs";

const authOptions: NextAuthOptions = {
 session: {
  strategy: "jwt",
 },
 secret: process.env.NEXTAUTH_SECRET,
 providers: [
  CredentialsProvider({
   type: "credentials",
   name: "Credentials",
   credentials: {
    email: {label: "Email", type: "email"},
    password: {label: "Password", type: "password"},
   },
   async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
     throw new Error("Email dan password diperlukan");
    }

    const supabase = createRouteHandlerClient({cookies});

    // Cari user berdasarkan email
    const {data: user, error} = await supabase
     .from("users")
     .select("*")
     .eq("email", credentials.email)
     .single();

    if (error || !user) {
     throw new Error("User tidak ditemukan");
    }

    // Bandingkan password
    const passwordMatch = await compare(credentials.password, user.password);
    if (!passwordMatch) {
     throw new Error("Password salah");
    }

    return {
     id: user.id,
     email: user.email,
     fullname: user.fullname,
     role: user.role,
    };
   },
  }),
 ],
 callbacks: {
  async jwt({token, user}: any) {
   if (user) {
    token.id = user.id;
    token.role = user.role;
    token.fullname = user.fullname;
   }
   return token;
  },
  async session({session, token}: any) {
   if (token) {
    session.user.id = token.id;
    session.user.role = token.role;
    session.user.fullname = token.fullname;
   }
   return session;
  },
  async redirect({url, baseUrl}) {
   // Redirect setelah login
   if (url === "/login") {
    return `${baseUrl}/admin/dashboard`;
   }
   if (url.startsWith("/")) return `${baseUrl}${url}`;
   return url.startsWith(baseUrl) ? url : baseUrl;
  },
 },
 pages: {
  signIn: "/login",
  newUser: "/register", // Halaman registrasi
 },
 debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
