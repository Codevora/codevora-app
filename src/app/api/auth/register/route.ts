import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import {hash} from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
 try {
  const {email, password, fullname} = await request.json();

  // Validasi input
  if (!email || !password || !fullname) {
   return NextResponse.json(
    {message: "Email, password, dan fullname diperlukan"},
    {status: 400}
   );
  }

  // Cek apakah user sudah ada
  const {data: existingUser} = await supabase
   .from("users")
   .select("*")
   .eq("email", email)
   .single();

  if (existingUser) {
   return NextResponse.json({message: "Email sudah terdaftar"}, {status: 400});
  }

  // Hash password
  const hashedPassword = await hash(password, 12);

  // Simpan user baru ke Supabase
  const {data: newUser, error} = await supabase
   .from("users")
   .insert([
    {
     email,
     password: hashedPassword,
     fullname,
     role: "admin", // Default role
     created_at: new Date().toISOString(),
    },
   ])
   .select()
   .single();

  if (error) {
   throw error;
  }

  return NextResponse.json(
   {
    message: "Registrasi berhasil",
    user: {
     id: newUser.id,
     email: newUser.email,
     fullname: newUser.fullname,
     role: newUser.role,
    },
   },
   {status: 201}
  );
 } catch (error) {
  console.error("Error during registration:", error);
  return NextResponse.json(
   {message: "Terjadi kesalahan saat registrasi"},
   {status: 500}
  );
 }
}
