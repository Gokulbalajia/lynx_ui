import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useAdminToast, AdminToastContainer } from '../../hooks/useAdminToast';
import { Plus, Loader2, Pencil, Trash2, Search, X } from 'lucide-react';

const defaultForm = {
  name: '',
  pet_type_id: '',
  breed_id: '',
  gender: 'Male',
  age_months: 0,
  price: '',
  stock: 1,
  description: '',
  image_url: '',
  is_available: true,
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatAge = (months) => {
  if (months === 0) return 'Newborn';
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return `${years} yr${years > 1 ? 's' : ''}${remainder ? ` ${remainder} mo` : ''}`;
};

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [petBreeds, setPetBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const { toasts, addToast, removeToast } = useAdminToast();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const petsRes = await axios.get('/pets/');
      const typesRes = await axios.get('/pet-types/');
      const breedsRes = await axios.get('/pet-breeds/');
      setPets(petsRes.data || []);
      setPetTypes(typesRes.data || []);
      setPetBreeds(breedsRes.data || []);
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

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => `${pet.name || ''} ${pet.gender || ''}`.toLowerCase().includes(query.toLowerCase()));
  }, [pets, query]);

  const openForm = () => {
    setEditingItem(null);
    setForm(defaultForm);
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setShowForm(true);
  };

  const handleEdit = (pet) => {
    setEditingItem(pet);
    setForm({
      name: pet.name || '',
      pet_type_id: pet.pet_type_id || pet.pet_type?.id || '',
      breed_id: pet.breed_id || pet.breed?.id || '',
      gender: pet.gender || 'Male',
      age_months: pet.age_months || 0,
      price: pet.price || '',
      stock: pet.stock || 1,
      description: pet.description || '',
      image_url: pet.images?.[0]?.image_url || '',
      is_available: pet.is_available ?? true,
    });
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setShowForm(true);
  };

  const uploadImageFile = async () => {
    if (!selectedImageFile) return null;

    const uploadFormData = new FormData();
    uploadFormData.append('file', selectedImageFile);

    setImageUploading(true);
    try {
      const response = await axios.post('/upload/upload-image', uploadFormData);
      return response.data?.image_url || response.data?.url || response.data?.data?.image_url || null;
    } finally {
      setImageUploading(false);
    }
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

    if (!form.name.trim() || !form.pet_type_id || Number(form.age_months) < 0 || !form.price || Number(form.price) <= 0 || Number(form.stock) < 0) {
      setError('Please fill valid values for required fields before submitting.');
      setSubmitting(false);
      return;
    }

    let imageUrl = form.image_url || '';
    if (selectedImageFile) {
      const uploadedUrl = await uploadImageFile();
      if (!uploadedUrl) {
        throw new Error('Image upload failed.');
      }
      imageUrl = uploadedUrl;
    }

    const payload = {
      name: form.name,
      pet_type_id: form.pet_type_id,
      breed_id: form.breed_id || null,
      gender: form.gender,
      age_months: Number(form.age_months),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description,
      is_available: form.is_available,
    };

    if (!editingItem) {
      payload.images = [
        {
          image_url: imageUrl,
          is_primary: true,
        },
      ];
    }

    try {
      if (editingItem) {
        await axios.put(`/pets/${editingItem.id}`, payload);
        addToast('Pet updated successfully!', 'success');
      } else {
        await axios.post('/pets/', payload);
        addToast('Pet created successfully!', 'success');
      }
      setShowForm(false);
      setEditingItem(null);
      setForm(defaultForm);
      await loadData();
    } catch (err) {
      const status = err.response?.status;
      let errorMessage = err.message;
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else {
          errorMessage = JSON.stringify(err.response.data.detail);
        }
      }
      const message =
        status === 401 || status === 403
          ? 'Session expired. Please log out and log in again.'
          : status === 404
          ? `Endpoint not found: ${err.config?.url}`
          : `Failed to save: ${errorMessage}`;
      setError(message);
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (pet) => {
    const confirmed = window.confirm(`Delete pet "${pet.name}"?`);
    if (!confirmed) return;
    setSubmitting(true);
    setError('');
    try {
      await axios.delete(`/pets/${pet.id}`);
      addToast('Pet deleted successfully!', 'success');
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

  return (
    <AdminLayout title="Pets" subtitle="Manage available pets.">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Pets ({pets.length})</p>
            <h2 className="text-2xl font-semibold text-white">Pet inventory</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[260px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pets"
                className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-11 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={openForm}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              <Plus size={16} /> Add Pet
            </button>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <div className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#000000]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#2A2A2A] bg-[#000000]">
              <tr>
                <th className="px-4 py-4 text-zinc-400">Pet</th>
                <th className="px-4 py-4 text-zinc-400">Type</th>
                <th className="px-4 py-4 text-zinc-400">Gender</th>
                <th className="px-4 py-4 text-zinc-400">Age</th>
                <th className="px-4 py-4 text-zinc-400">Price</th>
                <th className="px-4 py-4 text-zinc-400">Available</th>
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
                    <td className="px-4 py-4">&nbsp;</td>
                    <td className="px-4 py-4">&nbsp;</td>
                  </tr>
                ))
              ) : filteredPets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-zinc-500">
                    No pets found.
                  </td>
                </tr>
              ) : (
                filteredPets.map((pet) => {
                  const petType = petTypes.find((type) => type.id === pet.pet_type_id) || {};
                  const genderClass =
                    pet.gender === 'Female' ? 'bg-pink-600/10 text-pink-300 border border-pink-500/20' : pet.gender === 'Male' ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20' : 'bg-[#111111] text-zinc-300 border border-[#2A2A2A]';
                  return (
                    <tr key={pet.id} className="border-b border-[#2A2A2A] hover:bg-[#000000]/70 transition-colors">
                      <td className="px-4 py-4 max-w-[220px]">
                        <div className="flex items-center gap-3">
                          {pet.images?.[0]?.image_url ? (
                            <img src={pet.images[0].image_url} alt={pet.name} className="h-12 w-12 rounded-xl object-cover" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111111] text-zinc-500">🐾</div>
                          )}
                          <div>
                            <p className="font-semibold text-white">{pet.name}</p>
                            <p className="text-zinc-500 text-xs">{pet.breed?.name || pet.breed_id || 'Breed unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{petType.name || pet.pet_type_id?.toString().slice(0, 8) || 'Unknown'}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${genderClass}`}>{pet.gender || 'Other'}</span>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{formatAge(pet.age_months)}</td>
                      <td className="px-4 py-4 text-amber-400">{formatCurrency(pet.price)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pet.is_available ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'}`}>
                          {pet.is_available ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-300">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(pet)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-600/10 px-3 py-2 text-blue-300 hover:bg-blue-600/20"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(pet)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-600/10 px-3 py-2 text-red-300 hover:bg-red-600/20"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{editingItem ? 'Edit pet' : 'New pet'}</p>
                <h3 className="text-2xl font-semibold text-white">{editingItem ? 'Update pet' : 'Add pet'}</h3>
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
                <label className="text-sm text-zinc-300">Pet Type *</label>
                <select
                  value={form.pet_type_id}
                  onChange={(e) => setForm({ ...form, pet_type_id: e.target.value })}
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  {petTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Breed</label>
                  <select
                    value={form.breed_id}
                    onChange={(e) => setForm({ ...form, breed_id: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select breed</option>
                    {petBreeds
                      .filter((breed) => !form.pet_type_id || breed.pet_type_id === form.pet_type_id)
                      .map((breed) => (
                        <option key={breed.id} value={breed.id}>
                          {breed.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Age (months)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.age_months}
                    onChange={(e) => setForm({ ...form, age_months: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedImageFile(file);
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreviewUrl(previewUrl);
                      } else {
                        setImagePreviewUrl('');
                      }
                    }}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-zinc-500">Select an image file to upload it automatically.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Image URL</label>
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              {((selectedImageFile && imagePreviewUrl) || form.image_url) && (
                <div className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#000000] p-3">
                  <img
                    src={selectedImageFile ? imagePreviewUrl : form.image_url}
                    alt="preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm text-zinc-300">Image preview</p>
                    {selectedImageFile && <p className="text-xs text-zinc-500">{selectedImageFile.name}</p>}
                    {imageUploading && <p className="text-xs text-blue-400">Uploading image…</p>}
                  </div>
                </div>
              )}
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
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {editingItem ? 'Update Pet' : 'Add Pet'}
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
            </form>            </div>          </div>
        )}
      </div>
      <AdminToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

export default AdminPets;
