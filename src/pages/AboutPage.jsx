import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">About Lynx Pet Shop</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Learn more about our mission to deliver exceptional pet care products to every home.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>
      <div className="space-y-6 text-zinc-300 leading-7">
        <p>
          Lynx Pet Shop is dedicated to helping pets and their people with premium products, fast delivery, and trusted support. We believe every pet deserves warmth, care, and comfort.
        </p>
        <p>
          Our team curates products from trusted brands and works tirelessly to make shopping easy, safe, and reliable for pet owners across India.
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;
