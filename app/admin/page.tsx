import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getProducts } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';

export default async function AdminPage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  const totalRevenue = 0; // This would come from completed orders

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Digital products in store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Product views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.reduce((acc, p) => acc + p.downloads, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All-time downloads</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your store content</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/products/new">
            <Button className="w-full">Add New Product</Button>
          </Link>
          <Link href="/admin/categories/new">
            <Button variant="outline" className="w-full">
              Add Category
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="outline" className="w-full">
              Manage Products
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Products */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Your most recently updated products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} • {product.views} views
                    </p>
                  </div>
                  <Link href={`/admin/products/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
