import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            This Privacy Policy describes how Lynx Pet Shop collects, uses, and protects your information in accordance with Indian laws.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">
          Back to home
        </Link>
      </div>

      <div className="space-y-10 text-zinc-300">

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
          <p className="leading-7">
            Welcome to Lynx Pet Shop. We are committed to protecting your personal information in compliance with the Information Technology Act, 2000 and applicable Indian data protection rules. By using our platform, you agree to the terms of this Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
          <p className="leading-7">
            We collect personal information such as your name, email address, phone number, shipping and billing address, and order details. We may also collect device information, IP address, and browsing behavior to improve our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. Use of Information</h2>
          <p className="leading-7">
            Your information is used to process orders, deliver products and pets, provide customer support, improve user experience, send updates, and ensure security of our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Sale of Pets</h2>
          <p className="leading-7">
            As a pet-based e-commerce platform, we follow ethical practices and comply with the Prevention of Cruelty to Animals Act, 1960. We may verify customer details to ensure responsible pet ownership and safe delivery.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Cookies & Tracking</h2>
          <p className="leading-7">
            We use cookies to enhance your experience, remember preferences, and analyze website traffic. You can control cookies through your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">6. Sharing of Information</h2>
          <p className="leading-7">
            We do not sell your personal data. We may share information with payment gateways, delivery partners, and service providers as required to operate our business or comply with legal obligations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">7. Data Security</h2>
          <p className="leading-7">
            We implement reasonable security measures to protect your data, including secure servers and restricted access. However, no online system is completely secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">8. Your Rights</h2>
          <p className="leading-7">
            You have the right to access, update, or request deletion of your personal information. You may also withdraw consent where applicable by contacting us.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">9. Children’s Privacy</h2>
          <p className="leading-7">
            Our services are not intended for individuals under the age of 18. We do not knowingly collect data from minors.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">10. Changes to Policy</h2>
          <p className="leading-7">
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated effective date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">11. Contact Us</h2>
          <p className="leading-7">
            If you have any questions, please contact us at{" "}
            <span className="text-blue-400">support@lynxpetshop.com</span>.
          </p>
        </section>

      </div>
    </div>
  </div>
);


export default PrivacyPolicyPage;
