import React from 'react';
import { Link } from 'react-router-dom';

const SitemapPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Sitemap</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Navigate Lynx Pet Shop with a clear overview of the site structure.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 text-zinc-300">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Shop</h2>
          <ul className="space-y-3">
            <li><Link to="/" className="text-blue-400 hover:text-blue-200">Home</Link></li>
            <li><Link to="/products" className="text-blue-400 hover:text-blue-200">Products</Link></li>
            <li><Link to="/products" className="text-blue-400 hover:text-blue-200">Product Detail</Link></li>
            <li><Link to="/pets" className="text-blue-400 hover:text-blue-200">Pets</Link></li>
            <li><Link to="/cart" className="text-blue-400 hover:text-blue-200">Cart</Link></li>
            <li><Link to="/checkout" className="text-blue-400 hover:text-blue-200">Checkout</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Account</h2>
          <ul className="space-y-3">
            <li><Link to="/login" className="text-blue-400 hover:text-blue-200">Login</Link></li>
            <li><Link to="/register" className="text-blue-400 hover:text-blue-200">Register</Link></li>
            <li><Link to="/orders" className="text-blue-400 hover:text-blue-200">Orders</Link></li>
            <li><Link to="/profile" className="text-blue-400 hover:text-blue-200">Profile</Link></li>
            <li><Link to="/addresses" className="text-blue-400 hover:text-blue-200">Addresses</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Admin</h2>
          <ul className="space-y-3">
            <li><Link to="/admin" className="text-blue-400 hover:text-blue-200">Admin Dashboard</Link></li>
            <li><Link to="/admin/products" className="text-blue-400 hover:text-blue-200">Admin Products</Link></li>
            <li><Link to="/admin/orders" className="text-blue-400 hover:text-blue-200">Admin Orders</Link></li>
            <li><Link to="/admin/pets" className="text-blue-400 hover:text-blue-200">Admin Pets</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Legal</h2>
          <ul className="space-y-3">
            <li><Link to="/privacy-policy" className="text-blue-400 hover:text-blue-200">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-blue-400 hover:text-blue-200">Terms of Service</Link></li>
            <li><Link to="/shipping-policy" className="text-blue-400 hover:text-blue-200">Shipping Policy</Link></li>
            <li><Link to="/return-policy" className="text-blue-400 hover:text-blue-200">Return Policy</Link></li>
            <li><Link to="/sitemap" className="text-blue-400 hover:text-blue-200">Sitemap</Link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default SitemapPage;
