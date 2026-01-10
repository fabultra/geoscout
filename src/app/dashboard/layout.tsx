import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { LayoutDashboard, FileSearch, Settings, LogOut, PlusCircle } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-4 flex flex-col">
        <Link href="/" className="text-2xl font-bold text-cyan-400 mb-8">GEO Scout</Link>
        
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition">
            <LayoutDashboard className="w-5 h-5" />
            Tableau de bord
          </Link>
          <Link href="/dashboard/analyses/new" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition">
            <PlusCircle className="w-5 h-5" />
            Nouvelle analyse
          </Link>
          <Link href="/dashboard/analyses" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition">
            <FileSearch className="w-5 h-5" />
            Mes analyses
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition">
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </nav>

        <div className="pt-4 border-t border-white/10">
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition w-full">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
