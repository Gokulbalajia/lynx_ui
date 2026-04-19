import React from 'react';
import { Link } from 'react-router-dom';

const ReturnPolicyPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Return Policy</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Learn about our simple return process and how we handle pet-specific items.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>

      <div className="space-y-10 text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">7-Day Return Window</h2>
          <p className="leading-7">
            You may return eligible products within 7 days of delivery. Returns should be in original condition and packaging whenever possible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Eligible Products</h2>
          <p className="leading-7">
            Most pet care items, accessories, and non-perishable products are eligible for return. Opened or used products may be subject to approval.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Refund Process</h2>
          <p className="leading-7">
            Once we receive and inspect your return, refunds are processed to your original payment method within 5–7 business days.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Pet-Specific Rules</h2>
          <p className="leading-7">
            Live animals, pet food opened after delivery, personalised items, and health-sensitive products are not eligible for return.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default ReturnPolicyPage;
