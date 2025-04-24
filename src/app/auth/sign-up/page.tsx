"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

export default function RegisterPage() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [fullname, setFullname] = useState("");
 const [error, setError] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
   const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({email, password, fullname}),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Registrasi gagal");
   }

   // Redirect ke login setelah registrasi berhasil
   router.push("/auth/sign-in");
  } catch (err: any) {
   setError(err.message);
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
   <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-2xl font-bold mb-6 text-center">Registrasi</h1>
    {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
    <form onSubmit={handleSubmit}>
     <div className="mb-4">
      <label
       className="block text-gray-700 text-sm font-bold mb-2"
       htmlFor="fullname">
       Nama Lengkap
      </label>
      <input
       id="fullname"
       type="text"
       value={fullname}
       onChange={(e) => setFullname(e.target.value)}
       className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
       required
      />
     </div>
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
      {isLoading ? "Memproses..." : "Daftar"}
     </button>
    </form>
    <p className="mt-4 text-center text-sm text-gray-600">
     Sudah punya akun?{" "}
     <a
      href="/auth/sign-in"
      className="text-blue-500 hover:text-blue-600">
      Masuk di sini
     </a>
    </p>
   </div>
  </div>
 );
}
