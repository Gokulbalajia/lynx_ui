import React from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="min-h-screen bg-black pt-8">
      <div className="container mx-auto px-6">
        <Link to="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <User size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          </div>

          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-white">Account Details</h2>
                <div className="mt-4 space-y-3 text-zinc-300">
                  <p><span className="font-semibold text-white">Name:</span> {user?.name || 'Customer'}</p>
                  <p><span className="font-semibold text-white">Email:</span> {user?.email || 'Not available'}</p>
                  <p><span className="font-semibold text-white">Phone:</span> {user?.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white">Member Status</h3>
                <p className="mt-3 text-zinc-400">You are signed in and can manage your orders, wishlist, and profile details.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-400 text-lg">You need to sign in to view your profile details.</p>
              <Link to="/login" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;