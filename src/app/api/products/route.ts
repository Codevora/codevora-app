import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
 try {
  console.log("Received request to add product");
  const formData = await request.formData();
  console.log("Form data:", Object.fromEntries(formData.entries()));

  // Validasi file upload
  const image = formData.get("image") as File | null;
  if (image && image.size === 0) {
   console.log("No image file received");
   return NextResponse.json(
    {success: false, message: "File gambar tidak valid"},
    {status: 400}
   );
  }

  // Ekstrak data form
  const name = formData.get("name")?.toString();
  const priceStr = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const is_best_seller = formData.get("is_best_seller") === "true";

  // Validasi data
  if (!name || !priceStr) {
   console.log("Validation failed - missing name or price");
   return NextResponse.json(
    {success: false, message: "Nama dan harga produk diperlukan"},
    {status: 400}
   );
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
   console.log("Validation failed - invalid price");
   return NextResponse.json(
    {success: false, message: "Format harga tidak valid"},
    {status: 400}
   );
  }

  let imageUrl = null;

  // Upload gambar jika ada
  if (image && image.size > 0) {
   console.log("Uploading image...");
   try {
    const timestamp = Date.now();
    const fileExt = image.name.split(".").pop();
    const fileName = `${timestamp}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const {error: uploadError} = await supabase.storage
     .from("product-images")
     .upload(filePath, image, {
      cacheControl: "3600",
      upsert: false,
     });

    if (uploadError) {
     console.error("Upload error:", uploadError);
     throw new Error(`Gagal mengupload gambar: ${uploadError.message}`);
    }

    const {
     data: {publicUrl},
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    imageUrl = publicUrl;
    console.log("Image uploaded successfully:", imageUrl);
   } catch (uploadError) {
    console.error("Image upload failed:", uploadError);
    return NextResponse.json(
     {success: false, message: "Gagal mengupload gambar produk"},
     {status: 500}
    );
   }
  }

  // Simpan data produk
  console.log("Inserting product data...");
  const {data, error} = await supabase
   .from("products")
   .insert([
    {
     name,
     price,
     description: description || null,
     is_best_seller,
     image_url: imageUrl,
     created_at: new Date().toISOString(),
    },
   ])
   .select();

  if (error) {
   console.error("Database error:", error);
   throw error;
  }

  console.log("Product created successfully:", data[0]);
  return NextResponse.json({
   success: true,
   product: data[0],
  });
 } catch (error: any) {
  console.error("Server error:", error);
  return NextResponse.json(
   {
    success: false,
    message:
     error.message || "Terjadi kesalahan server saat menambahkan produk",
   },
   {status: 500}
  );
 }
}
