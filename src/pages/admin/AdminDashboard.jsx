import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useAdminToast, AdminToastContainer } from '../../hooks/useAdminToast';
import { ShoppingBag, Package, Heart, List, ArrowRight, Box } from 'lucide-react';

const cardConfig = [
  { label: 'Orders', icon: ShoppingBag, color: 'text-blue-400 bg-blue-600/10', key: 'orders' },
  { label: 'Products', icon: Package, color: 'text-emerald-400 bg-emerald-600/10', key: 'products' },
  { label: 'Pets', icon: Heart, color: 'text-amber-400 bg-amber-600/10', key: 'pets' },
  { label: 'Categories', icon: List, color: 'text-violet-400 bg-violet-600/10', key: 'categories' },
];

const getApiError = (err) => {
  const status = err.response?.status;
  if (status === 401 || status === 403) return 'Session expired. Please log out and log in again.';
  if (status === 404) return `Endpoint not found: ${err.config?.url}`;
  return `Failed to load: ${err.response?.data?.detail || err.message}`;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, products: 0, pets: 0, categories: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toasts, addToast, removeToast } = useAdminToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, productsRes, petsRes, categoriesRes] = await Promise.all([
        axios.get('/orders/admin/all'),
        axios.get('/products/'),
        axios.get('/pets/'),
        axios.get('/categories/'),
      ]);
      setStats({
        orders: ordersRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        pets: petsRes.data?.length || 0,
        categories: categoriesRes.data?.length || 0,
      });
      setRecentOrders((ordersRes.data || []).slice(-5).reverse());
    } catch (err) {
      const message = getApiError(err);
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return { label: 'Unknown', classes: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    const normalized = status.toLowerCase();
    if (normalized.includes('paid')) return { label: 'Paid', classes: 'bg-green-500/10 text-green-400 border border-green-500/30' };
    if (normalized.includes('pending')) return { label: 'Pending', classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' };
    return { label: 'Failed', classes: 'bg-red-500/10 text-red-400 border border-red-500/30' };
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Quick overview of shop activity.">
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cardConfig.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.key} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.3em] mb-3">{card.label}</p>
                    <p className="text-4xl font-black text-white">{loading ? '—' : stats[card.key]}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${card.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Recent Orders</p>
                <h2 className="text-2xl font-bold text-white">Latest activity</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/orders')}
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/10 px-4 py-2 text-sm text-blue-300 hover:bg-blue-600/20"
              >
                View all
                <ArrowRight size={16} />
              </button>
            </div>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-24 rounded-3xl bg-zinc-800" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <Box size={48} className="mx-auto text-zinc-600" />
                <p className="mt-4 text-zinc-400">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const status = formatStatus(order.payment_status);
                  return (
                    <div key={order.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-zinc-400">Order #{order.id?.toString().slice(0, 8)}...</p>
                          <p className="text-white font-semibold">{new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${status.classes}`}>{status.label}</div>
                      </div>
                      <p className="mt-3 text-amber-400 font-semibold">Total: ₹{order.total_amount ?? order.amount ?? 'N/A'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Quick Actions</p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products?action=create')}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
              >
                + Add Product
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/pets?action=create')}
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
              >
                + Add Pet
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/categories?action=create')}
                className="w-full rounded-2xl bg-zinc-700 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-600 transition"
              >
                + Add Category
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/pet-types?action=create')}
                className="w-full rounded-2xl bg-zinc-700 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-600 transition"
              >
                + Add Pet Type
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition"
              >
                View Shop
              </button>
            </div>
          </aside>
        </div>
        {error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
      <AdminToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default AdminDashboard;
