import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useAdminToast, AdminToastContainer } from '../../hooks/useAdminToast';
import { Plus, Loader2, Pencil, Trash2, Search, X, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { PUBLIC_IMAGES, normalizeImagePath, getProductImage, getRecommendedImages, PRODUCT_SORT_ORDER } from '../../utils/assetUtils';

const defaultForm = {
  name: '',
  brand: '',
  category_id: '',
  short_description: '',
  price: '',
  stock: 0,
  sku: '',
  image_url: '',
  is_active: true,
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString('en-IN')}`;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const { toasts, addToast, removeToast } = useAdminToast();
  const location = useLocation();
  const [showAssetSelector, setShowAssetSelector] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'create') {
      openForm();
    }
  }, [location.search]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, categoriesRes] = await Promise.all([axios.get('/products/'), axios.get('/categories/')]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
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

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        `${product.name || ''} ${product.brand || ''}`.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const indexA = PRODUCT_SORT_ORDER.findIndex(name => 
          a.name?.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(a.name?.toLowerCase())
        );
        const indexB = PRODUCT_SORT_ORDER.findIndex(name => 
          b.name?.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(b.name?.toLowerCase())
        );

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return parseInt(b.id || 0, 10) - parseInt(a.id || 0, 10);
      });
  }, [products, query]);

  const openForm = () => {
    setEditingItem(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingItem(product);
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      category_id: product.category_id || product.category?.id || '',
      short_description: product.short_description || '',
      price: product.variants?.[0]?.price || '',
      stock: product.variants?.[0]?.stock || 0,
      sku: product.variants?.[0]?.sku || '',
      image_url: product.images?.[0]?.image_url || '',
      is_active: product.is_active ?? true,
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

    if (!form.name.trim() || !form.category_id || !form.price || Number(form.price) <= 0 || Number(form.stock) < 0 || (!editingItem && !form.sku.trim())) {
      setError('Please fill valid values for required fields before submitting.');
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name,
      brand: form.brand,
      category_id: form.category_id,
      short_description: form.short_description,
      is_active: form.is_active,
      variants: [
        {
          sku: form.sku,
          price: Number(form.price),
          stock: Number(form.stock),
        },
      ],
      images: [
        {
          image_url: form.image_url || '',
          is_primary: true,
        },
      ],
      details: {
        ingredients_material: '',
        pet_species_tags: [],
        lifestyle_tags: [],
        weight: '',
        flavor: '',
        expiry_date: null,
      },
    };

    try {
      if (editingItem) {
        await axios.put(`/products/${editingItem.id}`, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await axios.post('/products/', payload);
        addToast('Product created successfully!', 'success');
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

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete product "${product.name}"?`);
    if (!confirmed) return;
    setSubmitting(true);
    setError('');
    try {
      await axios.delete(`/products/${product.id}`);
      addToast('Product deleted successfully!', 'success');
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
    <AdminLayout title="Products" subtitle="Manage your product catalog.">
      {/* Recommended images logic hook */}
      {(() => {
        // This is a bit of a hack to get useMemo-like behavior in the main component scope for the form
        // but since we are already inside the component, we just calculate it.
        // For better performance, we could put this in a sub-component.
      })()}

      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Products ({products.length})</p>
            <h2 className="text-2xl font-semibold text-white">Product Catalog</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[260px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-11 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={openForm}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <div className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#000000]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#2A2A2A] bg-[#000000]">
              <tr>
                <th className="px-4 py-4 text-zinc-400">Product</th>
                <th className="px-4 py-4 text-zinc-400">Category</th>
                <th className="px-4 py-4 text-zinc-400">Price</th>
                <th className="px-4 py-4 text-zinc-400">Stock</th>
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
                    <td className="px-4 py-4">&nbsp;</td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-zinc-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const variant = product.variants?.[0] || {};
                  const category = categories.find((cat) => cat.id === product.category_id) || {};
                  const stockLabel = Number(variant.stock);
                  const stockColor = stockLabel === 0 ? 'text-red-400' : stockLabel <= 3 ? 'text-amber-400' : 'text-emerald-400';
                  return (
                    <tr key={product.id} className="border-b border-[#2A2A2A] hover:bg-[#000000]/70 transition-colors">
                      <td className="px-4 py-4 max-w-[220px]">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#111111]">
                            <img 
                              src={getProductImage(product)} 
                              alt={product.name} 
                              className="h-full w-full object-cover transition-transform hover:scale-110" 
                            />
                            {!product.images?.[0]?.image_url && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                <ImageIcon size={16} className="text-zinc-500/50" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base leading-tight mb-1">{product.name}</p>
                            <p className="text-zinc-500 text-xs font-medium tracking-wider uppercase">{product.sku || variant.sku || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{category.name || product.category_id || 'Unknown'}</td>
                      <td className="px-4 py-4 text-amber-400">{formatCurrency(variant.price)}</td>
                      <td className={`px-4 py-4 ${stockColor}`}>{variant.stock ?? 'N/A'}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs ${product.is_active ? 'bg-green-500/10 text-green-300 border border-green-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-300">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-600/10 px-3 py-2 text-blue-300 hover:bg-blue-600/20"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
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
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{editingItem ? 'Edit product' : 'New product'}</p>
                <h3 className="text-2xl font-semibold text-white">{editingItem ? 'Update product' : 'Add product'}</h3>
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
                <label className="text-sm text-zinc-300">Brand</label>
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Category *</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Short description</label>
                <textarea
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  rows={3}
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              {!editingItem && (
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">SKU *</label>
                  <input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] px-4 py-3 text-white outline-none focus:border-blue-500"
                    required={!editingItem}
                  />
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-300">Product Image</label>
                  <button
                    type="button"
                    onClick={() => setShowAssetSelector(!showAssetSelector)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ImageIcon size={14} />
                    {showAssetSelector ? 'Close Gallery' : 'Browse Local Gallery'}
                  </button>
                </div>

                {showAssetSelector && (
                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 font-bold">Local Assets Library</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {PUBLIC_IMAGES.map((imgName) => (
                        <button
                          key={imgName}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, image_url: imgName });
                            setShowAssetSelector(false);
                          }}
                          className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                            form.image_url === imgName ? 'border-blue-500' : 'border-[#2A2A2A] hover:border-zinc-500'
                          }`}
                        >
                          <img src={`/images/${imgName}`} alt={imgName} className="h-full w-full object-cover" title={imgName} />
                          {form.image_url === imgName && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 rounded-full p-1 shadow-lg">
                                <Plus size={12} className="text-white rotate-45" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Related / Recommended Images Section */}
                {(() => {
                  const recommendations = getRecommendedImages(form);
                  if (recommendations.length > 0) {
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400/80">Related Images Found</p>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                          {recommendations.slice(0, 5).map((imgName) => (
                            <button
                              key={imgName}
                              type="button"
                              onClick={() => setForm({ ...form, image_url: imgName })}
                              className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                                form.image_url === imgName 
                                  ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.05]' 
                                  : 'border-zinc-800/50 hover:border-blue-500/50 hover:scale-[1.02]'
                              }`}
                            >
                              <img src={`/images/${imgName}`} alt="related" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              {form.image_url === imgName && (
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                                  <div className="bg-blue-500 rounded-full p-1 shadow-lg transform scale-100 animate-in zoom-in-50">
                                    <Plus size={10} className="text-white rotate-45" />
                                  </div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex items-center gap-4 rounded-2xl border border-[#2A2A2A]/50 bg-gradient-to-r from-[#0A0A0A] to-[#000000] p-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#111111]">
                    <img 
                      src={form.image_url ? normalizeImagePath(form.image_url) : getProductImage(form)} 
                      alt="preview" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      {form.image_url ? 'Custom Image Preview' : 'Smart Fallback Icon'}
                    </p>
                    <p className="text-sm text-zinc-300 truncate font-mono">
                      {form.image_url || 'Using best match for product name'}
                    </p>
                    {form.image_url && (
                      <button 
                        type="button" 
                        onClick={() => setForm({ ...form, image_url: '' })}
                        className="text-[10px] text-zinc-500 hover:text-red-400 mt-1 font-bold uppercase tracking-widest transition-colors"
                      >
                        Remove selection
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="Enter image URL or select from gallery"
                    className="w-full rounded-2xl border border-[#2A2A2A] bg-[#000000] pl-4 pr-12 py-3.5 text-sm text-white outline-none focus:border-blue-500 transition-all placeholder:text-zinc-600 font-medium"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Search size={16} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {editingItem ? 'Update Product' : 'Add Product'}
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

export default AdminProducts;
