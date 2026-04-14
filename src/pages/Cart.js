import React from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, onRemoveFromCart }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-black pt-8">
      <div className="container mx-auto px-6">
        <Link to="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ShoppingCart size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Your Shopping Cart</h1>
          </div>

          {cartItems.length > 0 ? (
            <div className="space-y-6">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 items-center bg-zinc-950 border border-zinc-800 rounded-3xl p-4">
                    <img src={item.img} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                      <p className="text-zinc-400 text-sm">Category: {item.category}</p>
                      <p className="text-zinc-400 text-sm">Quantity: {item.quantity || 1}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-white font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart?.(item.id, item.item_type)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <div>
                  <p className="text-zinc-400">Total items: {cartItems.length}</p>
                  <p className="text-white text-2xl font-bold">₹{total.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/checkout" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full transition-all">
                    Go to Checkout
                  </Link>
                  <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition-all">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-400 text-lg">Your cart is currently empty.</p>
              <Link to="/" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;