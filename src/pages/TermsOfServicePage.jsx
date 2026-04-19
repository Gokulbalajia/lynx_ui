import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Read the terms that govern your account, purchases, and use of Lynx Pet Shop.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>

      <div className="space-y-10 text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Account Usage</h2>
          <p className="leading-7">
            Your account must be used honestly and responsibly. You are responsible for maintaining the confidentiality of your credentials and for all activity on your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Purchases</h2>
          <p className="leading-7">
            Orders are subject to product availability, pricing, and our checkout process. By placing an order, you agree to pay the listed price and any applicable fees.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Intellectual Property</h2>
          <p className="leading-7">
            All content, branding, and images on Lynx Pet Shop are owned by us or licensed to us. You may not reuse or republish our content without permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Disclaimers</h2>
          <p className="leading-7">
            Products are provided "as is" and we make no warranties beyond those required by law. We are not liable for indirect or consequential damages arising from your use of the site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Governing Law</h2>
          <p className="leading-7">
            These terms are governed by the laws of the Republic of India. Any disputes will be resolved in the appropriate courts in Mumbai.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default TermsOfServicePage;
