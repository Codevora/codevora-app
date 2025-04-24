"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase";

export default function ProfileModal({
 isOpen,
 onClose,
 userData,
}: {
 isOpen: boolean;
 onClose: () => void;
 userData: any;
}) {
 const [name, setName] = useState(userData?.name || "");
 const [profilePicture, setProfilePicture] = useState<File | null>(null);
 const [previewImage, setPreviewImage] = useState(
  userData?.profile_picture || ""
 );
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");

 if (!isOpen) return null;

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
   const file = e.target.files[0];
   setProfilePicture(file);

   // Buat preview gambar
   const reader = new FileReader();
   reader.onloadend = () => {
    setPreviewImage(reader.result as string);
   };
   reader.readAsDataURL(file);
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
   let profilePictureUrl = userData?.profile_picture || "";

   // Upload gambar baru jika ada
   if (profilePicture) {
    const fileExt = profilePicture.name.split(".").pop();
    const fileName = `${userData.id}-${Date.now()}.${fileExt}`;
    const filePath = `profile_pictures/${fileName}`;

    const {data: uploadData, error: uploadError} = await supabase.storage
     .from("profile-pictures")
     .upload(filePath, profilePicture);

    if (uploadError) throw uploadError;

    // Dapatkan URL publik
    const {data: urlData} = supabase.storage
     .from("profile-pictures")
     .getPublicUrl(filePath);

    profilePictureUrl = urlData.publicUrl;
   }

   // Update data user di Supabase
   const {error: updateError} = await supabase
    .from("users")
    .update({
     name,
     profile_picture: profilePictureUrl,
     updated_at: new Date().toISOString(),
    })
    .eq("id", userData.id);

   if (updateError) throw updateError;

   onClose();
  } catch (err) {
   
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
   <div className="bg-white rounded-lg p-6 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>

    {error && <div className="mb-4 text-red-500">{error}</div>}

    <form onSubmit={handleSubmit}>
     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Profile Picture</label>
      <div className="flex items-center space-x-4">
       {previewImage ? (
        <img
         src={previewImage}
         alt="Profile Preview"
         className="w-16 h-16 rounded-full object-cover"
        />
       ) : (
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
         <span className="text-gray-500">No Image</span>
        </div>
       )}
       <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="border rounded p-2"
       />
      </div>
     </div>

     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Name</label>
      <input
       type="text"
       value={name}
       onChange={(e) => setName(e.target.value)}
       className="w-full border rounded p-2"
       required
      />
     </div>

     <div className="flex justify-end space-x-2">
      <button
       type="button"
       onClick={onClose}
       className="px-4 py-2 border rounded"
       disabled={isLoading}>
       Cancel
      </button>
      <button
       type="submit"
       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
       disabled={isLoading}>
       {isLoading ? "Saving..." : "Save"}
      </button>
     </div>
    </form>
   </div>
  </div>
 );
}
