import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get current user
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect('/auth/login');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', authData.user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="sticky top-0 border-b border-border bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 flex-1">
            <Link href="/admin" className="text-xl sm:text-2xl font-bold text-foreground whitespace-nowrap">
              Admin
            </Link>
            <nav className="hidden sm:flex gap-6">
              <Link href="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Overview
              </Link>
              <Link href="/admin/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Products
              </Link>
              <Link href="/admin/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Categories
              </Link>
            </nav>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-border">
              View Store
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="sticky top-16 border-b border-border bg-white sm:hidden">
        <nav className="flex gap-2 px-6 py-2 overflow-x-auto">
          <Link href="/admin" className="text-xs font-medium text-foreground hover:text-primary px-3 py-2 rounded transition-colors whitespace-nowrap">
            Overview
          </Link>
          <Link href="/admin/products" className="text-xs font-medium text-foreground hover:text-primary px-3 py-2 rounded transition-colors whitespace-nowrap">
            Products
          </Link>
          <Link href="/admin/categories" className="text-xs font-medium text-foreground hover:text-primary px-3 py-2 rounded transition-colors whitespace-nowrap">
            Categories
          </Link>
        </nav>
      </div>

      {/* Admin Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">{children}</main>
    </div>
  );
}
