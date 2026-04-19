import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Heart,
  List,
  Layers,
  ExternalLink,
  Menu,
  X,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/products', label: 'Products', icon: Settings },
  { to: '/admin/pets', label: 'Pets', icon: Heart },
  { to: '/admin/categories', label: 'Categories', icon: List },
  { to: '/admin/pet-types', label: 'Pet Types', icon: Layers },
  { to: '/admin/pet-breeds', label: 'Pet Breeds', icon: List },
];

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const email = user?.email || 'admin@lynx.petshop.com';

  return (
    <div className="min-h-screen bg-[#212121] text-white">
      <div className="lg:flex lg:min-h-screen">
        <aside className="hidden lg:flex w-[260px] flex-col bg-[#000000] border-r border-[#2A2A2A] p-6">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-blue-600/10 p-3 text-blue-400">
                <Settings size={20} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Lynx Admin</p>
                <h2 className="text-xl font-bold text-white">Admin Console</h2>
              </div>
            </div>
            <p className="text-sm text-zinc-500 leading-5">{email}</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                        : 'text-zinc-400 hover:bg-[#111111] hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-[#2A2A2A] pt-6 space-y-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm text-zinc-400 hover:bg-[#111111] hover:text-white transition"
            >
              <ExternalLink size={18} />
              View Shop
            </button>
          </div>
        </aside>

        <div className="lg:hidden border-b border-[#2A2A2A] bg-[#000000] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="text-zinc-300 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Lynx Admin</p>
            <p className="font-semibold text-white">Dashboard</p>
          </div>
          <div className="rounded-full bg-[#111111] p-2 text-zinc-300">
            <Settings size={20} />
          </div>
        </div>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <aside className="relative z-50 w-72 bg-[#000000] border-r border-[#2A2A2A] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Lynx Admin</p>
                  <h2 className="text-lg font-bold text-white">Admin Console</h2>
                </div>
                <button type="button" onClick={() => setDrawerOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-zinc-500 mb-6">{email}</p>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin'}
                      onClick={() => setDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                            : 'text-zinc-400 hover:bg-[#111111] hover:text-white'
                        }`
                      }
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="mt-8 border-t border-[#2A2A2A] pt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm text-zinc-400 hover:bg-[#111111] hover:text-white transition"
                >
                  <ExternalLink size={18} />
                  View Shop
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 bg-[#212121] px-4 py-6 lg:px-8 lg:py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
