"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase";

interface FormData {
 fullName: string;
 bio: string;
}

export default function ProfileForm({userId}: {userId: string}) {
 const [formData, setFormData] = useState<FormData>({
  fullName: "",
  bio: "",
 });
 const [profilePicture, setProfilePicture] = useState<File | null>(null);
 const [isOpen, setIsOpen] = useState(true);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
   let pictureUrl = "";

   if (profilePicture) {
    const fileExt = profilePicture.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const {error: uploadError} = await supabase.storage
     .from("profile-pictures")
     .upload(filePath, profilePicture);

    if (uploadError) throw uploadError;

    const {
     data: {publicUrl},
    } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

    pictureUrl = publicUrl;
   }

   const {error} = await supabase.from("profiles").upsert({
    user_id: userId,
    full_name: formData.fullName,
    bio: formData.bio,
    profile_picture_url: pictureUrl,
    updated_at: new Date().toISOString(),
   });

   if (error) throw error;

   setIsOpen(false);
   alert("Profile updated successfully!");
  } catch (error) {
   console.error("Error updating profile:", error);
   alert("Error updating profile");
  }
 };

 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
   <div className="bg-white p-6 rounded-lg w-full max-w-md">
    <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
    <form onSubmit={handleSubmit}>
     <div className="mb-4">
      <label className="block mb-2">Full Name</label>
      <input
       type="text"
       className="w-full p-2 border rounded"
       value={formData.fullName}
       onChange={(e) => setFormData({...formData, fullName: e.target.value})}
       required
      />
     </div>

     <div className="mb-4">
      <label className="block mb-2">Bio</label>
      <textarea
       className="w-full p-2 border rounded"
       value={formData.bio}
       onChange={(e) => setFormData({...formData, bio: e.target.value})}
      />
     </div>

     <div className="mb-4">
      <label className="block mb-2">Profile Picture</label>
      <input
       type="file"
       accept="image/jpeg,image/png"
       onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
       className="w-full p-2 border rounded"
      />
     </div>

     <div className="flex justify-end gap-2">
      <button
       type="button"
       onClick={() => setIsOpen(false)}
       className="px-4 py-2 bg-gray-300 rounded">
       Skip
      </button>
      <button
       type="submit"
       className="px-4 py-2 bg-blue-500 text-white rounded">
       Save
      </button>
     </div>
    </form>
   </div>
  </div>
 );
}
