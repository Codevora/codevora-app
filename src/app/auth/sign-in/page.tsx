"use client";

import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";

export default function LoginPage() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  if (!validateForm()) {
   return;
  }

  try {
   const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
   });

   if (result?.error) {
    throw new Error(result.error);
   }

   // Jika login berhasil, redirect ke dashboard
   router.push("/admin/dashboard");
  } catch (err: any) {
   setError(err.message || "Login gagal");
  } finally {
   setIsLoading(false);
  }
 };

 const validateForm = () => {
  if (!email) {
   setError("Email diperlukan");
   return false;
  }

  if (!password) {
   setError("Password diperlukan");
   return false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
   setError("Email tidak valid");
   return false;
  }

  return true;
 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
   <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
    {error && (
     <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
      {error}
     </div>
    )}
    <form onSubmit={handleSubmit}>
     <div className="mb-4">
      <label
       className="block text-gray-700 text-sm font-bold mb-2"
       htmlFor="email">
       Email
      </label>
      <input
       id="email"
       type="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
       required
      />
     </div>
     <div className="mb-6">
      <label
       className="block text-gray-700 text-sm font-bold mb-2"
       htmlFor="password">
       Password
      </label>
      <input
       id="password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
       required
      />
     </div>
     <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50">
      {isLoading ? "Memproses..." : "Login"}
     </button>
    </form>
    <p className="mt-4 text-center text-sm text-gray-600">
     Belum punya akun?{" "}
     <Link
      href="/auth/sign-up"
      className="text-blue-500 hover:text-blue-600">
      Daftar di sini
     </Link>
    </p>
   </div>
  </div>
 );
}
