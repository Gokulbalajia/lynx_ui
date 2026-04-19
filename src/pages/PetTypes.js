import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PET_EMOJIS = {
  dog: '🐕', cat: '🐈', bird: '🦜', fish: '🐟',
  rabbit: '🐇', hamster: '🐹', turtle: '🐢', snake: '🐍',
};

const getPetEmoji = (name) => {
  const key = (name || '').toLowerCase();
  return PET_EMOJIS[key] || '🐾';
};

const PetTypes = () => {
  const { isAdmin } = useAuth();
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => { fetchPetTypes(); }, []);

  const fetchPetTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/pet-types/');
      setPetTypes(res.data || []);
    } catch {
      setError('Failed to load pet types.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post('/pet-types/', { name: name.trim() });
      setName('');
      setShowForm(false);
      setSuccess('Pet type created!');
      setTimeout(() => setSuccess(''), 3000);
      fetchPetTypes();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create pet type.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Heart size={28} className="text-blue-500" /> Pet Types
            </h1>
            <p className="text-zinc-400 mt-1">{petTypes.length} types total</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                text-white font-semibold px-5 py-3 rounded-xl transition"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Cancel' : 'Add Pet Type'}
            </button>
          )}
        </div>

        {success && (
          <div className="mb-4 bg-green-500/10 border border-green-500
            text-green-300 rounded-xl p-4">{success}</div>
        )}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500
            text-red-300 rounded-xl p-4">{error}</div>
        )}

        {showForm && isAdmin && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">New Pet Type</h2>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. Dog, Cat, Bird..."
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-3 text-white focus:border-blue-500 outline-none"
                required minLength={2} maxLength={50}
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700
                  disabled:opacity-50 text-white font-semibold px-6 py-3
                  rounded-xl transition"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'Saving...' : 'Create'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : petTypes.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No pet types yet</h3>
            <p className="text-zinc-500">Add your first pet type.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {petTypes.map(pt => (
              <div key={pt.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6
                  text-center hover:border-zinc-600 transition">
                <div className="text-4xl mb-3">{getPetEmoji(pt.name)}</div>
                <h3 className="text-white font-semibold text-lg">{pt.name}</h3>
                <p className="text-zinc-600 text-xs mt-1 font-mono">
                  {pt.id?.toString().slice(0, 8)}...
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PetTypes;
