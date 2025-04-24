// app/register/page.tsx
"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import Link from "next/link";

export default function RegisterPage() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [fullname, setFullname] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
   const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     email,
     password,
     fullname,
    }),
   });

   // Handle non-JSON responses
   const contentType = response.headers.get("content-type");
   if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(text || "Invalid server response");
   }

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.error || "Registrasi gagal");
   }

   router.push("/auth/sign-in");
  } catch (err: any) {
   // Handle HTML error responses
   if (err.message.includes("<!DOCTYPE html>")) {
    setError("Terjadi kesalahan pada server");
   } else {
    setError(err.message);
   }
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
   <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-2xl font-bold mb-6 text-center">Registrasi</h1>

    {error && (
     <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
    )}

    <form
     onSubmit={handleSubmit}
     className="space-y-4">
     <div>
      <label
       htmlFor="fullname"
       className="block text-sm font-medium text-gray-700">
       Nama Lengkap
      </label>
      <input
       id="fullname"
       type="text"
       value={fullname}
       onChange={(e) => setFullname(e.target.value)}
       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
       required
      />
     </div>

     <div>
      <label
       htmlFor="email"
       className="block text-sm font-medium text-gray-700">
       Email
      </label>
      <input
       id="email"
       type="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
       required
      />
     </div>

     <div>
      <label
       htmlFor="password"
       className="block text-sm font-medium text-gray-700">
       Password
      </label>
      <input
       id="password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
       required
       minLength={6}
      />
     </div>

     <button
      type="submit"
      disabled={loading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
      {loading ? "Mendaftarkan..." : "Daftar"}
     </button>
    </form>

    <div className="mt-4 text-center">
     <p className="text-sm text-gray-600">
      Sudah punya akun?{" "}
      <Link
       href="/login"
       className="font-medium text-blue-600 hover:text-blue-500">
       Masuk di sini
      </Link>
     </p>
    </div>
   </div>
  </div>
 );
}
