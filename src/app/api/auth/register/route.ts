import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {hash} from "bcryptjs";

const supabaseAdmin = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.SUPABASE_SERVICE_ROLE_KEY! // Gunakan service role
);

export async function POST(request: Request) {
 try {
  const {email, password, fullname} = await request.json();

  // 1. Hash password
  const hashedPassword = await hash(password, 12);

  // 2. Insert user dengan RLS-friendly approach
  const {data: user, error} = await supabaseAdmin
   .from("users")
   .insert({
    email,
    password: hashedPassword,
    fullname,
    role: "user", // Default role
   })
   .select()
   .single();

  if (error) throw error;

  return NextResponse.json(
   {
    success: true,
    user: {
     id: user.id,
     email: user.email,
    },
   },
   {status: 201}
  );
 } catch (error: any) {
  console.error("Registration error:", error);
  return NextResponse.json(
   {error: error.message || "Registration failed"},
   {status: 500}
  );
 }
}
