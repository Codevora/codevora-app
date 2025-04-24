// app/admin/dashboard/page.tsx
"use client";

import {useEffect, useState} from "react";
import {signOut, useSession} from "next-auth/react";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {useRouter} from "next/navigation";
import {LogOut} from "lucide-react";

export default function AdminDashboard() {
 const router = useRouter();

 const {data: session} = useSession();
 const supabase = createClientComponentClient();
 const [showModal, setShowModal] = useState(false);
 const [profileData, setProfileData] = useState({
  profilePicture: null as File | null,
  phone: "",
  address: "",
 });
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");

 // Cek apakah user sudah melengkapi profil
 useEffect(() => {
  const checkProfile = async () => {
   if (session?.user?.id) {
    const {data, error} = await supabase
     .from("users")
     .select("profile_picture, phone, address")
     .eq("id", session.user.id)
     .single();

    if (!error && (!data.profile_picture || !data.phone || !data.address)) {
     setShowModal(true);
    }
   }
  };

  checkProfile();
 }, [session, supabase]);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
   setProfileData({
    ...profileData,
    profilePicture: e.target.files[0],
   });
  }
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const {name, value} = e.target;
  setProfileData({
   ...profileData,
   [name]: value,
  });
 };

 const handleLogout = async () => {
  await supabase.auth.signOut(); // Clear session Supabase
  await signOut({
   redirect: false,
   callbackUrl: "/auth/sign-in",
  });
  router.push("/auth/sign-in");
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
   if (!session?.user?.id) throw new Error("User tidak valid");
   if (!profileData.profilePicture) throw new Error("Foto profil diperlukan");

   // 1. Upload gambar ke storage
   const file = profileData.profilePicture;
   const fileExt = file.name.split(".").pop();
   const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
   const filePath = `profile-pictures/${fileName}`;

   // Upload file ke bucket
   const {error: uploadError} = await supabase.storage
    .from("profile-pictures") // <- Nama bucket HARUS sama
    .upload(filePath, file);

   if (uploadError) throw uploadError;

   // 2. Dapatkan URL publik
   const {
    data: {publicUrl},
   } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

   // 3. Update data user di tabel
   const {error: updateError} = await supabase
    .from("users")
    .update({
     profile_picture: publicUrl,
     phone: profileData.phone,
     address: profileData.address,
     updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id);

   if (updateError) throw updateError;

   setShowModal(false);
   alert("Profil berhasil diperbarui!");
  } catch (err: any) {
   console.error("Error:", err);
   setError(err.message || "Terjadi kesalahan");
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <div className="p-6">
   <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
   <p>Selamat datang, {session?.user?.fullname}!</p>
   <button
    onClick={handleLogout}
    className="flex items-center gap-2...">
    <LogOut size={18} />
    Logout
   </button>
   {/* Modal untuk melengkapi profil */}
   {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
     <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Lengkapi Profil Anda</h2>

      {error && (
       <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form
       onSubmit={handleSubmit}
       className="space-y-4">
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
         Foto Profil
        </label>
        <input
         type="file"
         accept="image/jpeg,image/png"
         onChange={handleFileChange}
         className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
         required
        />
        <p className="mt-1 text-xs text-gray-500">Format: JPG atau PNG</p>
       </div>

       <div>
        <label
         htmlFor="phone"
         className="block text-sm font-medium text-gray-700">
         Nomor Telepon
        </label>
        <input
         id="phone"
         type="tel"
         name="phone"
         value={profileData.phone}
         onChange={handleInputChange}
         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
         required
        />
       </div>

       <div>
        <label
         htmlFor="address"
         className="block text-sm font-medium text-gray-700">
         Alamat
        </label>
        <input
         id="address"
         type="text"
         name="address"
         value={profileData.address}
         onChange={handleInputChange}
         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
         required
        />
       </div>

       <div className="flex justify-end space-x-3">
        <button
         type="button"
         onClick={() => setShowModal(false)}
         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
         Nanti Saja
        </button>
        <button
         type="submit"
         disabled={isLoading}
         className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
         {isLoading ? "Menyimpan..." : "Simpan"}
        </button>
       </div>
      </form>
     </div>
    </div>
   )}
  </div>
 );
}
