import React from 'react';
import { Link } from 'react-router-dom';

const ShippingInfoPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Shipping Info</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Find details about shipping timelines, fees, and order tracking.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>
      <div className="space-y-6 text-zinc-300 leading-7">
        <p>
          Most orders ship within 1 business day and arrive between 2–4 business days. Free shipping applies to orders above ₹499, and tracking details are provided after dispatch.
        </p>
      </div>
    </div>
  </div>
);

export default ShippingInfoPage;
