"use client";

import {createClient} from "@supabase/supabase-js";
import {toast} from "react-toastify";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductTable({
 products,
 loading,
 onRefresh,
}: {
 products: any[];
 loading: boolean;
 onRefresh: () => void;
}) {
 const handleDelete = async (id: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

  try {
   const {error} = await supabase.from("products").delete().eq("id", id);

   if (error) throw error;
   toast.success("Produk berhasil dihapus");
   onRefresh();
  } catch (error) {
   toast.error("Gagal menghapus produk");
   console.error(error);
  }
 };

 if (loading) return <div>Memuat produk...</div>;

 return (
  <div className="overflow-x-auto">
   <table className="min-w-full bg-white rounded-lg overflow-hidden">
    <thead className="bg-gray-100">
     <tr>
      <th className="py-3 px-4 text-left">Gambar</th>
      <th className="py-3 px-4 text-left">Nama</th>
      <th className="py-3 px-4 text-left">Harga</th>
      <th className="py-3 px-4 text-left">Best Seller</th>
      <th className="py-3 px-4 text-left">Aksi</th>
     </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
     {products.map((product) => (
      <tr key={product.id}>
       <td className="py-3 px-4">
        {product.image_url && (
         <img
          src={product.image_url}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
         />
        )}
       </td>
       <td className="py-3 px-4">{product.name}</td>
       <td className="py-3 px-4">
        {new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
        }).format(product.price)}
       </td>
       <td className="py-3 px-4">{product.is_best_seller ? "Ya" : "Tidak"}</td>
       <td className="py-3 px-4 space-x-2">
        <button className="text-blue-500 hover:text-blue-700">Edit</button>
        <button
         className="text-red-500 hover:text-red-700"
         onClick={() => handleDelete(product.id)}>
         Hapus
        </button>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
}
