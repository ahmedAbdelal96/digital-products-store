'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setCategories(
          categories.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
        );
        setEditingId(null);
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        setCategories([...categories, data]);
      }

      setFormData({ name: '', slug: '', description: '' });
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      alert('Failed to delete category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage product categories</p>
      </div>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Category' : 'Add Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="category-slug"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">{editingId ? 'Update' : 'Add'} Category</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>{categories.length} categories total</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : categories.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 py-12 text-center">
              <p className="text-muted-foreground">No categories yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                    {category.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
