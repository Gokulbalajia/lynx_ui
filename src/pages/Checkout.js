import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, CreditCard, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

const Checkout = ({ cartItems, onClearCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, userId } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', pincode: '', country: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadAddresses();
  }, [isAuthenticated, navigate]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/addresses/');
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id);
      }
    } catch (err) {
      setError('Unable to load addresses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axios.post('/addresses/', newAddress);
      setAddresses((current) => [...current, response.data]);
      setSelectedAddressId(response.data.id);
      setNewAddress({ street: '', city: '', state: '', pincode: '', country: '' });
      setMessage('Address saved successfully.');
    } catch (err) {
      setError('Unable to save address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address before placing your order.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty. Add items before checking out.');
      return;
    }

    try {
      setIsSubmitting(true);
      const checkoutUserId = user?.id || userId;
      const orderPayload = {
        address_id: selectedAddressId,
        total_amount: total,
        payment_status: 'Pending',
        user_id: checkoutUserId,
        items: cartItems.map((item) => ({
          product_variant_id: item.item_type === 'product'
            ? (item.product_variant_id || null)
            : null,
          pet_id: item.item_type === 'pet'
            ? (item.pet_id || item.id || null)
            : null,
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
      };
      await axios.post('/orders/checkout', orderPayload);
      onClearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed. Please verify your address and cart.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-8">
        <div className="container mx-auto px-6 text-center text-white">
          <Loader2 className="animate-spin mx-auto" size={48} />
          <p className="mt-4">Loading your checkout details…</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-8">
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-zinc-400 mb-6">Add products or pets to your cart before checking out.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full">
              Shop Products
            </Link>
            <Link to="/pets" className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full">
              Browse Pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-8 pb-16">
      <div className="container mx-auto px-6">
        <Link to="/cart" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={24} className="text-blue-500" />
              <h1 className="text-3xl font-bold text-white">Checkout</h1>
            </div>

            {error && <div className="rounded-2xl bg-red-500/10 border border-red-500 text-red-200 p-4">{error}</div>}
            {message && <div className="rounded-2xl bg-green-500/10 border border-green-500 text-green-200 p-4">{message}</div>}

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">Shipping Address</h2>
                {addresses.length === 0 ? (
                  <p className="text-zinc-400">No saved addresses found. Add one below.</p>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label key={address.id} className="block rounded-3xl border border-zinc-800 p-4 hover:border-blue-500 transition-all">
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mr-3 accent-blue-500"
                        />
                        <span className="text-white">
                          {address.street}, {address.city}, {address.state}, {address.pincode}, {address.country}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-zinc-800 p-6 bg-zinc-950">
                <h2 className="text-xl font-semibold text-white mb-4">Add New Address</h2>
                <form className="grid gap-4" onSubmit={handleCreateAddress}>
                  <input
                    type="text"
                    placeholder="Street address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold py-3 transition-all"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Address'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-blue-500" />
              <h2 className="text-2xl font-bold text-white">Order Summary</h2>
            </div>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-4 rounded-3xl border border-zinc-800 p-4">
                  <img src={item.img || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-zinc-500 text-sm">{item.category || 'Product'}</p>
                  </div>
                  <span className="text-white font-bold">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-zinc-800 p-6 bg-zinc-950">
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between text-white text-xl font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all"
            >
              {isSubmitting ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
