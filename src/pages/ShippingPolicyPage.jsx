import React from 'react';
import { Link } from 'react-router-dom';

const ShippingPolicyPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Shipping Policy</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Discover how Lynx Pet Shop delivers orders quickly and reliably across India.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>

      <div className="space-y-10 text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Delivery Timelines</h2>
          <p className="leading-7">
            Orders are typically delivered within 2–4 business days. Delivery times may vary depending on your location and courier availability.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Free Shipping</h2>
          <p className="leading-7">
            Enjoy free shipping on all orders above ₹499. Orders below this threshold will incur a standard shipping fee at checkout.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Order Tracking</h2>
          <p className="leading-7">
            Once your order ships, we will send tracking details by email. You can also track your package via the Track Order page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Failed Delivery</h2>
          <p className="leading-7">
            If delivery fails due to an incorrect address or missed delivery, we will attempt to contact you and re-schedule delivery where possible.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default ShippingPolicyPage;
