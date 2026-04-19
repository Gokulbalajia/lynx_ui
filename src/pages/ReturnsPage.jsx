import React from 'react';
import { Link } from 'react-router-dom';

const ReturnsPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Returns</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Start your return or review return eligibility and the refund process.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>
      <div className="space-y-6 text-zinc-300 leading-7">
        <p>
          Returns are accepted within 7 days of delivery for eligible products. Please ensure items are in good condition and include all original packaging when possible.
        </p>
      </div>
    </div>
  </div>
);

export default ReturnsPage;
