import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Categories = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/categories/');
      setCategories(res.data || []);
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post('/categories/', { name: form.name, description: form.description });
      setForm({ name: '', description: '' });
      setShowForm(false);
      setSuccess('Category created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create category.');
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
              <List size={28} className="text-blue-500" /> Product Categories
            </h1>
            <p className="text-zinc-400 mt-1">{categories.length} categories total</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                text-white font-semibold px-5 py-3 rounded-xl transition"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Cancel' : 'Add Category'}
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
            <h2 className="text-xl font-semibold text-white mb-4">New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category name *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-3 text-white focus:border-blue-500 outline-none"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl
                  px-4 py-3 text-white focus:border-blue-500 outline-none resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700
                  disabled:opacity-50 text-white font-semibold px-6 py-3
                  rounded-xl transition"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <List size={64} className="text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No categories yet</h3>
            <p className="text-zinc-500">Add your first product category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5
                  hover:border-zinc-600 transition">
                <h3 className="text-white font-semibold text-lg mb-2">{cat.name}</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  {cat.description || 'No description'}
                </p>
                <p className="text-zinc-600 text-xs">
                  {new Date(cat.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Categories;
