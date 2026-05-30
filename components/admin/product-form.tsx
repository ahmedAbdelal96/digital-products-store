'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import type { Product, Category } from '@/lib/types';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    short_description: product?.short_description || '',
    description: product?.description || '',
    price: product?.price || 0,
    category_id: product?.category_id || categories[0]?.id || '',
    image_url: product?.image_url || '',
    file_url: product?.file_url || '',
    file_size: product?.file_size || 0,
    file_type: product?.file_type || '',
    status: product?.status || 'active',
    is_featured: product?.is_featured || false,
    is_instant_download: product?.is_instant_download ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'price' || name === 'file_size' ? parseFloat(value) : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    try {
      if (product?.id) {
        // Update
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', product.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from('products').insert([formData]);

        if (error) throw error;
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
        <CardDescription>
          {product ? 'Update product details' : 'Create a new digital product'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>

            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="product-slug"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Short Description</label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Brief product description for cards"
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Files */}
          <div className="space-y-4">
            <h3 className="font-semibold">Pricing & Files</h3>

            <div>
              <label className="text-sm font-medium">Price ($)</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">File URL</label>
              <Input
                name="file_url"
                value={formData.file_url}
                onChange={handleChange}
                placeholder="https://example.com/file.zip"
              />
            </div>

            <div>
              <label className="text-sm font-medium">File Size (bytes)</label>
              <Input
                type="number"
                name="file_size"
                value={formData.file_size}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">File Type</label>
              <Input
                name="file_type"
                value={formData.file_type}
                onChange={handleChange}
                placeholder="ZIP, PDF, etc."
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="font-semibold">Status</h3>

            <div>
              <label className="text-sm font-medium">Product Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                  }
                  className="rounded border-input"
                />
                Featured Product
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="is_instant_download"
                  checked={formData.is_instant_download}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_instant_download: e.target.checked }))
                  }
                  className="rounded border-input"
                />
                Instant Download
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
