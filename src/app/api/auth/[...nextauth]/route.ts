import {createClient} from "@supabase/supabase-js";
import {compare} from "bcryptjs";
import {NextAuthOptions} from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

    try {
     // Query user dari Supabase
     const {data: user, error} = await supabase
      .from("users")
      .select("*")
      .eq("email", credentials.email)
      .single();

     if (error || !user) {
      throw new Error("Email atau password salah");
     }

     // Verifikasi password
     const passwordMatch = await compare(credentials.password, user.password);
     if (!passwordMatch) {
      throw new Error("Email atau password salah");
     }

     // Return data user yang akan disimpan di session JWT
     return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
     };
    } catch (error) {
     console.error("Login error:", error);
     throw new Error("Terjadi kesalahan saat login");
    }
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
   // Allows relative callback URLs
   if (url.startsWith("/")) return `${baseUrl}${url}`;
   // Allows callback URLs on the same origin
   else if (new URL(url).origin === baseUrl) return url;
   return baseUrl;
  },
 },
 pages: {
  signIn: "/auth/sign-in",
  newUser: "/register", // Halaman registrasi
 },
 debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
