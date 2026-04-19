import React from 'react';
import { Link } from 'react-router-dom';

const TrackOrderPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Track Order</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Enter your tracking details to follow your delivery every step of the way.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>
      <div className="space-y-6 text-zinc-300 leading-7">
        <p>
          Once your order ships, your tracking information will be available here. Check your email for the latest shipping updates and expected delivery time.
        </p>
      </div>
    </div>
  </div>
);

export default TrackOrderPage;
