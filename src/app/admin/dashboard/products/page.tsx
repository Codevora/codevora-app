"use client";

import {useState, useEffect} from "react";
import {createClient} from "@supabase/supabase-js";
import ProductTable from "@/components/layouts/admin/products/ProductTable";
import ProductForm from "@/components/layouts/admin/products/ProductForm";
import {Button} from "@/components/ui/button";
import {toast} from "react-toastify";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductPage() {
 const [products, setProducts] = useState<any[]>([]);
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchProducts();
 }, []);

 const fetchProducts = async () => {
  try {
   setLoading(true);
   const {data, error} = await supabase
    .from("products")
    .select("*")
    .order("created_at", {ascending: false});

   if (error) throw error;
   setProducts(data || []);
  } catch (error) {
   toast.error("Gagal memuat produk");
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 const handleAddProduct = () => {
  setIsFormOpen(true);
 };

 const handleFormSubmit = async () => {
  await fetchProducts();
  setIsFormOpen(false);
 };

 return (
  <div className="p-6">
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Manajemen Produk</h1>
    <Button onClick={handleAddProduct}>Tambah Produk</Button>
   </div>

   <ProductTable
    products={products}
    loading={loading}
    onRefresh={fetchProducts}
   />

   <ProductForm
    open={isFormOpen}
    onClose={() => setIsFormOpen(false)}
    onSubmit={handleFormSubmit}
   />
  </div>
 );
}
