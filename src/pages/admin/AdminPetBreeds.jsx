import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useAdminToast, AdminToastContainer } from '../../hooks/useAdminToast';
import { Plus, Loader2, Pencil, Trash2, Search, X } from 'lucide-react';

const defaultForm = {
  name: '',
  description: '',
  pet_type_id: '',
  is_active: true,
};


const AdminPetBreeds = () => {
  const [breeds, setBreeds] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const { toasts, addToast, removeToast } = useAdminToast();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [breedsRes, typesRes] = await Promise.all([axios.get('/pet-breeds/'), axios.get('/pet-types/')]);
      setBreeds(breedsRes.data || []);
      setPetTypes(typesRes.data || []);
    } catch (err) {
      const status = err.response?.status;
      const message =
        status === 401 || status === 403
          ? 'Session expired. Please log out and log in again.'
          : status === 404
          ? `Endpoint not found: ${err.config?.url}`
          : `Failed to load: ${err.response?.data?.detail || err.message}`;
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredBreeds = useMemo(() => {
    return breeds.filter((breed) => `${breed.name || ''} ${breed.description || ''}`.toLowerCase().includes(query.toLowerCase()));
  }, [breeds, query]);

  const openForm = () => {
    setEditingItem(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const handleEdit = (breed) => {
    setEditingItem(breed);
    setForm({
      name: breed.name || '',
      description: breed.description || '',
      pet_type_id: breed.pet_type_id || breed.pet_type?.id || '',
      is_active: breed.is_active ?? true,
    });
    setShowForm(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!axios.defaults.headers.common['Authorization']) {
      setError('You must be logged in as admin to save changes. Please log in and try again.');
      setSubmitting(false);
      return;
    }

    if (!form.name.trim()) {
      setError('Please enter a pet breed name.');
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      pet_type_id: form.pet_type_id || null,
      is_active: form.is_active,
    };

    try {
      if (editingItem) {
        await axios.put(`/pet-breeds/${editingItem.id}`, payload);
        addToast('Breed updated successfully!', 'success');
      } else {
        await axios.post('/pet-breeds/', payload);
        addToast('Breed created successfully!', 'success');
      }
      setShowForm(false);
      setEditingItem(null);
      setForm(defaultForm);
      await loadData();
    } catch (err) {
      const status = err.response?.status;
      const message =
        status === 401 || status === 403
          ? 'Session expired. Please log out and log in again.'
          : status === 404
          ? `Endpoint not found: ${err.config?.url}`
          : `Failed to save: ${err.response?.data?.detail || err.message}`;
      setError(message);
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (breed) => {
    const confirmed = window.confirm(`Delete breed "${breed.name}"?`);
    if (!confirmed) return;
    setSubmitting(true);
    setError('');
    try {
      await axios.delete(`/pet-breeds/${breed.id}`);
      addToast('Breed deleted successfully!', 'success');
      await loadData();
    } catch (err) {
      const status = err.response?.status;
      const message =
        status === 401 || status === 403
          ? 'Session expired. Please log out and log in again.'
          : status === 404
          ? `Endpoint not found: ${err.config?.url}`
          : `Failed to delete: ${err.response?.data?.detail || err.message}`;
      setError(message);
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getPetTypeName = (item) => {
    if (!item) return null;
    // Check both singular and plural forms (backend consistency)
    if (item.pet_types?.name) return item.pet_types.name;
    if (item.pet_type?.name) return item.pet_type.name;
    if (item.pet_type_name) return item.pet_type_name;
    if (item.type_name) return item.type_name;
    if (item.species) return item.species;
    
    const petTypeId = item.pet_type_id || (typeof item.pet_type === 'string' || typeof item.pet_type === 'number' ? item.pet_type : item.pet_type?.id);
    if (!petTypeId) return null;
    
    const match = petTypes.find(t => String(t.id) === String(petTypeId));
    return match ? match.name : String(petTypeId).slice(0, 8);
  };



  return (

    <AdminLayout title="Pet Breeds" subtitle="Manage breed options for pets.">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Breeds ({breeds.length})</p>
            <h2 className="text-2xl font-semibold text-white">Pet Breed Catalog</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[260px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search breeds"
                className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-11 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={openForm}
              className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-500 transition"
            >
              <Plus size={16} /> Add Breed
            </button>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <div className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#000000]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#2A2A2A] bg-[#000000]">
              <tr>
                <th className="px-4 py-4 text-zinc-400">Breed</th>
                <th className="px-4 py-4 text-zinc-400">Pet Type </th>
                <th className="px-4 py-4 text-zinc-400">Description</th>

                <th className="px-4 py-4 text-zinc-400">Status</th>
                <th className="px-4 py-4 text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse border-b border-[#2A2A2A] bg-[#000000]">
                    <td className="px-4 py-4">&nbsp;</td>
                    <td className="px-4 py-4">&nbsp;</td>
                    <td className="px-4 py-4">&nbsp;</td>
                    <td className="px-4 py-4">&nbsp;</td>
                    <td className="px-4 py-4">&nbsp;</td>
                  </tr>
                ))
              ) : filteredBreeds.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-zinc-500">
                    No breeds found.
                  </td>
                </tr>
              ) : (
                filteredBreeds.map((breed) => (
                  <tr key={breed.id} className="border-b border-[#2A2A2A] hover:bg-[#000000]/70 transition-colors">
                    <td className="px-4 py-4 font-semibold text-white">{breed.name}</td>
                    <td className="px-4 py-4 text-zinc-300">
                      {getPetTypeName(breed) || 'Unknown'}
                    </td>


                    <td className="px-4 py-4 text-zinc-300">
                      {breed.description || breed.short_description || breed.desc || 'No description'}
                    </td>

                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${breed.is_active ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'}`}>
                        {breed.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-300">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(breed)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-600/10 px-3 py-2 text-blue-300 hover:bg-blue-600/20"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(breed)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-600/10 px-3 py-2 text-red-300 hover:bg-red-600/20"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative z-10 w-full max-w-3xl max-h-[calc(100vh-4rem)] overflow-y-auto rounded-3xl border border-[#2A2A2A] bg-[#000000] shadow-2xl p-8">
              <div className="flex items-center justify-between gap-4 border-b border-[#2A2A2A] p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{editingItem ? 'Edit breed' : 'New breed'}</p>
                  <h3 className="text-2xl font-semibold text-white">{editingItem ? 'Update breed' : 'Add breed'}</h3>
                </div>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-full p-2 text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Pet Type Name *</label>
                  <select

                    value={form.pet_type_id}
                    onChange={(e) => setForm({ ...form, pet_type_id: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select pet type name</option>
                    {petTypes.map((type) => (

                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    id="breed-active"
                    className="h-4 w-4 rounded border-[#2A2A2A] bg-[#000000] text-pink-500 focus:ring-pink-500"
                  />
                  <label htmlFor="breed-active" className="text-sm text-zinc-300">
                    Keep breed active
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {editingItem ? 'Save Breed' : 'Add Breed'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setForm(defaultForm);
                    }}
                    className="rounded-2xl border border-[#2A2A2A] bg-[#000000] px-5 py-3 text-sm text-zinc-300 hover:border-zinc-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <AdminToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default AdminPetBreeds;
