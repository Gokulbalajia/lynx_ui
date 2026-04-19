import React from 'react';
import { Link } from 'react-router-dom';

const BlogPage = () => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            Read tips, stories, and advice from the Lynx Pet Shop community.
          </p>
        </div>
        <Link to="/" className="text-blue-400 hover:text-blue-200 font-semibold">Back to home</Link>
      </div>
      <div className="space-y-6 text-zinc-300 leading-7">
        <p>
          Explore articles on pet health, training, nutrition, and lifestyle. Our blog helps pet owners make smarter choices for their furry family members.
        </p>
      </div>
    </div>
  </div>
);

export default BlogPage;
