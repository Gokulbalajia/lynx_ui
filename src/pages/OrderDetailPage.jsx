import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Package, MapPin, CreditCard, Loader2 } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Unable to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  const items = order?.items || order?.order_items || [];
  const address = order?.address || order?.shipping_address || {};
  const total = order?.total_amount ?? order?.amount ?? 0;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-16">
      <div className="container mx-auto px-6">
        <Link to="/orders" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8">
          <ArrowLeft size={20} />
          Back to Orders
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="animate-spin mx-auto text-blue-400" size={36} />
              <p className="mt-4 text-zinc-400">Loading order details…</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">{error}</div>
          ) : !order ? (
            <div className="rounded-3xl border border-zinc-700 bg-[#0f0f0f] p-10 text-center text-zinc-400">
              <p className="text-lg font-semibold text-white">Order not found.</p>
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-500"
              >
                View Orders
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-[#2A2A2A] bg-[#000000] p-6">
                  <p className="text-zinc-400 text-xs uppercase tracking-[0.3em]">Order</p>
                  <p className="mt-3 text-white text-xl font-semibold">#{order.id}</p>
                  <p className="text-zinc-500 mt-2">Placed on {new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="rounded-3xl border border-[#2A2A2A] bg-[#000000] p-6">
                  <p className="text-zinc-400 text-xs uppercase tracking-[0.3em]">Payment</p>
                  <p className="mt-3 text-white text-xl font-semibold">{order.payment_status || 'Pending'}</p>
                  <p className="text-zinc-500 mt-2">{order.payment_method || 'Payment method not specified'}</p>
                </div>
                <div className="rounded-3xl border border-[#2A2A2A] bg-[#000000] p-6">
                  <p className="text-zinc-400 text-xs uppercase tracking-[0.3em]">Total</p>
                  <p className="mt-3 text-amber-400 text-2xl font-semibold">₹{Number(total).toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-3xl border border-[#2A2A2A] bg-[#000000] p-6">
                  <div className="flex items-center gap-3 mb-4 text-blue-300">
                    <Package size={20} />
                    <h2 className="text-xl font-semibold text-white">Order items</h2>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-zinc-400">No item details available.</p>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div key={index} className="rounded-3xl border border-[#2A2A2A] bg-[#111111] p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-white">{item.name || item.product_name || item.pet_name || 'Item'}</p>
                              <p className="text-zinc-400 text-sm">Qty: {item.quantity ?? item.qty ?? 1}</p>
                            </div>
                            <p className="text-white font-semibold">₹{Number(item.price ?? 0).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-[#2A2A2A] bg-[#000000] p-6">
                  <div className="flex items-center gap-3 mb-4 text-blue-300">
                    <MapPin size={20} />
                    <h2 className="text-xl font-semibold text-white">Shipping address</h2>
                  </div>
                  <p className="text-white font-semibold">{address.street || 'No address'}</p>
                  <p className="text-zinc-400 mt-2">{address.city || 'City'}, {address.state || 'State'} {address.pincode || ''}</p>
                  <p className="text-zinc-400">{address.country || 'Country'}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#2A2A2A] bg-[#000000] p-6">
                <div className="flex items-center gap-3 mb-4 text-blue-300">
                  <CreditCard size={20} />
                  <h2 className="text-xl font-semibold text-white">Order status</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-[#2A2A2A] p-4">
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.3em]">Payment</p>
                    <p className="mt-2 text-white font-semibold">{order.payment_status || 'Pending'}</p>
                  </div>
                  <div className="rounded-3xl border border-[#2A2A2A] p-4">
                    <p className="text-zinc-400 text-xs uppercase tracking-[0.3em]">Shipping</p>
                    <p className="mt-2 text-white font-semibold">{order.shipment_status || 'Pending'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
