import React from 'react';
import { Link } from 'react-router-dom';

const PressPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Press</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Find the latest Lynx Pet Shop news, announcements, and media resources.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>
      <div className="space-y-6 text-zinc-300 leading-7">
        <p>
          Lynx Pet Shop is focused on delivering thoughtful pet care products and a trusted online shopping experience. For media inquiries, please contact press@lynxpetshop.com.
        </p>
      </div>
    </div>
  </div>
);

export default PressPage;
