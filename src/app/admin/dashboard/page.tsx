"use client";

import {signOut, useSession} from "next-auth/react";

export default function AdminDashboard() {
 const {data: session} = useSession();

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
   <p>Selamat datang, {session?.user?.fullname || session?.user?.email}!</p>
   <button onClick={() => signOut()}>Logout</button>
  </div>
 );
}
