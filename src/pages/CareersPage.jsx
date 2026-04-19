import React from 'react';
import { Link } from 'react-router-dom';

const CareersPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Careers</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Join the Lynx Pet Shop team and help build the next great pet care brand.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>
      <div className="space-y-6 text-zinc-300 leading-7">
        <p>
          We are always looking for passionate people who love pets and want to deliver outstanding customer experiences. Explore roles in operations, product, support, and logistics.
        </p>
        <p>
          If you are interested in building exceptional pet care services, please get in touch through our support page or submit your resume to careers@lynxpetshop.com.
        </p>
      </div>
    </div>
  </div>
);

export default CareersPage;
