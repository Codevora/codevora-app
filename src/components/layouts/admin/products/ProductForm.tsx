'use client';

import { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

export default function ProductForm({
  open,
  onClose,
  onSubmit
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    is_best_seller: false,
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);

   try {
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("price", formData.price);
    formPayload.append("description", formData.description);
    formPayload.append("is_best_seller", String(formData.is_best_seller));

    if (formData.image) {
     formPayload.append("image", formData.image);
    }

    console.log("Submitting form data...");
    const response = await fetch("/api/products", {
     method: "POST",
     body: formPayload,
    });

    const result = await response.json();
    console.log("API response:", result);

    if (!response.ok || !result.success) {
     throw new Error(result.message || "Gagal menambahkan produk");
    }

    toast.success("Produk berhasil ditambahkan!");
    onSubmit();
    resetForm();
   } catch (error: any) {
    console.error("Form submission error:", error);
    toast.error(error.message || "Terjadi kesalahan saat menambahkan produk");
   } finally {
    setLoading(false);
   }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      is_best_seller: false,
      image: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-xl font-bold mb-4">
            Tambah Produk Baru
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Harga
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="best-seller"
                  name="is_best_seller"
                  checked={formData.is_best_seller}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="best-seller" className="text-sm font-medium">
                  Best Seller
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gambar Produk
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}