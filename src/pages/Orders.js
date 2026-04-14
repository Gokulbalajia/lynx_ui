import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, ArrowLeft, Truck, CircleDollarSign, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/');
      setOrders(response.data);
    } catch (err) {
      setError('Unable to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black pt-8">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Please sign in to view your orders.</h1>
          <Link to="/login" className="inline-flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-full text-white font-bold hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-8 pb-20">
      <div className="container mx-auto px-6">
        <Link to="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package size={32} className="text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold text-white">My Orders</h1>
                <p className="text-zinc-400">Track payment, shipment, and order status.</p>
              </div>
            </div>
            <Link to="/checkout" className="inline-flex items-center gap-2 bg-blue-600 px-5 py-3 rounded-full text-white font-bold hover:bg-blue-700">
              <CircleDollarSign size={16} /> Checkout
            </Link>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading orders…</p>
          ) : error ? (
            <div className="rounded-3xl bg-red-500/10 border border-red-500 p-6 text-red-200">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-400 text-lg">You haven't placed any orders yet.</p>
              <Link to="/" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Order #{order.id}</h2>
                      <p className="text-zinc-400">Placed on {new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-200">Payment: {order.payment_status || 'Pending'}</span>
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-300">Shipment: {order.shipment_status || 'Pending'}</span>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3 mt-5 text-zinc-300">
                    <div className="rounded-3xl border border-zinc-800 p-4">
                      <div className="flex items-center gap-2 mb-2 text-blue-400"><CircleDollarSign size={16} /> Payment</div>
                      <p>{order.payment_method || 'Not specified'}</p>
                    </div>
                    <div className="rounded-3xl border border-zinc-800 p-4">
                      <div className="flex items-center gap-2 mb-2 text-blue-400"><MapPin size={16} /> Ship To</div>
                      <p>{order.address?.street || 'No address saved'}</p>
                    </div>
                    <div className="rounded-3xl border border-zinc-800 p-4">
                      <div className="flex items-center gap-2 mb-2 text-blue-400"><Truck size={16} /> Tracking</div>
                      <p>{order.tracking_number || 'Not available'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
