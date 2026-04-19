import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';

const defaultAddress = {
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
};

const Addresses = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(defaultAddress);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/addresses/');
        setAddresses(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load your saved addresses.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/addresses/', form);
      setAddresses((prev) => [...prev, response.data]);
      setForm(defaultAddress);
      setMessage('Address saved successfully.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save the address.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-8 pb-16">
      <div className="container mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Saved Addresses</h1>
            <p className="text-zinc-400 mb-6">Manage shipping addresses for your orders.</p>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-24 rounded-3xl bg-zinc-950 animate-pulse" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-700 bg-[#0f0f0f] p-10 text-center text-zinc-400">
                <p className="text-lg font-semibold text-white">No shipping addresses yet.</p>
                <p className="mt-2">Add one using the form on the right.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-3xl border border-zinc-800 bg-[#0f0f0f] p-6">
                    <p className="text-white font-semibold">{address.street}</p>
                    <p className="text-zinc-400 text-sm">{address.city}, {address.state}, {address.pincode}</p>
                    <p className="text-zinc-400 text-sm">{address.country}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Add new address</h2>
            {error && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 mb-4">{error}</div>}
            {message && <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200 mb-4">{message}</div>}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-white outline-none"
                required
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-white outline-none"
                  required
                />
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-white outline-none"
                  required
                />
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full rounded-2xl border border-zinc-800 bg-[#000000] px-4 py-3 text-white outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-500 transition"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Save address
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
