import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAdminToast, AdminToastContainer } from '../../hooks/useAdminToast';
import AdminLayout from './AdminLayout';
import { Search, ChevronRight, ChevronDown, Box } from 'lucide-react';

const getStatusVariant = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized.includes('paid')) return { label: 'Paid', classes: 'bg-green-500/10 text-green-400 border border-green-500/30' };
  if (normalized.includes('pending')) return { label: 'Pending', classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' };
  return { label: 'Failed', classes: 'bg-red-500/10 text-red-400 border border-red-500/30' };
};

const getOrderItems = (order) => order.items || order.order_items || [];

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState('');
  const { toasts, addToast, removeToast } = useAdminToast();

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/orders/admin/all');
      setOrders(res.data || []);
    } catch (err) {
      const status = err.response?.status;
      const message =
        status === 401 || status === 403
          ? 'Session expired. Please log out and log in again.'
          : status === 404
          ? `Endpoint not found: ${err.config?.url}`
          : `Failed to load: ${err.response?.data?.detail || err.message}`;
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery = query
        ? `${order.id || ''} ${order.payment_status || ''}`.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesStatus =
        statusFilter === 'all' ? true : (order.payment_status || '').toLowerCase().includes(statusFilter);
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  return (
    <AdminLayout title="Orders" subtitle="All customer orders in one place.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Orders ({orders.length})</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[260px]">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order ID or status"
                className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-11 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'paid', 'failed'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    statusFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#000000] text-zinc-300 hover:bg-[#1a1c22]'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-3xl bg-[#111111]" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#2A2A2A] bg-[#000000] p-10 text-center text-zinc-400">
            <Box size={48} className="mx-auto mb-4 text-zinc-600" />
            <p className="text-lg font-semibold text-white">No orders yet</p>
            <p className="mt-2 text-sm text-zinc-500">No orders match your filters right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = getStatusVariant(order.payment_status);
              const items = getOrderItems(order);
              return (
                <div key={order.id} className="rounded-3xl border border-[#2A2A2A] bg-[#000000] p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">Order #{order.id?.toString().slice(0, 8)}...</p>
                      <p className="text-white font-semibold">{new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <div className={`rounded-full px-4 py-2 text-xs font-semibold ${status.classes}`}>{status.label}</div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">Total</p>
                      <p className="mt-2 text-amber-400 font-semibold">₹{order.total_amount ?? order.amount ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">User</p>
                      <p className="mt-2 text-white">{order.user_id?.toString().slice(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-[0.2em]">Items</p>
                      <p className="mt-2 text-white">{items.length} items</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="mt-5 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"
                  >
                    {expandedOrder === order.id ? 'Hide items' : 'Show items'}
                    {expandedOrder === order.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {expandedOrder === order.id && (
                    <div className="mt-4 space-y-3 border-t border-[#2A2A2A] pt-4">
                      {items.length === 0 ? (
                        <p className="text-zinc-500">No item details available.</p>
                      ) : (
                        items.map((item, index) => (
                          <div key={index} className="rounded-2xl border border-[#2A2A2A] bg-[#000000] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-white">{item.product_variant_id || item.pet_id || item.name || 'Item'}</p>
                              <p className="text-zinc-500 text-sm">Qty: {item.quantity ?? item.qty ?? 1}</p>
                            </div>
                            <p className="text-zinc-300 text-sm">Price: ₹{item.price ?? 'N/A'}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AdminToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default AdminOrders;
