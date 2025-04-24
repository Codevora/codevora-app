import NextAuth from "next-auth";

declare module "next-auth" {
 interface Session {
  user: {
   id: string;
   fullname: string;
   email: string;
   role: string;
  } & DefaultSession["user"];
 }

 interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
 }
}

declare module "next-auth/jwt" {
 interface JWT {
  id: string;
  fullname: string;
  email: string;
  role: string;
 }
}
