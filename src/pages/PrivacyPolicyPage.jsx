import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Learn how Lynx Pet Shop collects, uses and protects your personal information.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>

      <div className="space-y-10 text-zinc-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Data Collection</h2>
          <p className="leading-7">
            We collect information you provide directly, including account details, order information, shipping addresses, and payment details. We also collect usage data automatically through cookies and similar technologies to improve your experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Cookies & Tracking</h2>
          <p className="leading-7">
            Lynx Pet Shop uses cookies to personalize content, remember your preferences, and analyze site traffic. You can manage cookie preferences through your browser, but disabling cookies may affect certain features.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Third-Party Sharing</h2>
          <p className="leading-7">
            We may share information with payment processors, shipping partners, analytics providers, and other trusted service providers that support our operations. We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
          <p className="leading-7">
            You may request access to, correction of, or deletion of your information. You can also unsubscribe from marketing messages and update your profile settings at any time in your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
          <p className="leading-7">
            If you have privacy questions or want to exercise your rights, email us at <span className="text-blue-400">support@lynxpetshop.com</span> or visit our help center.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicyPage;
