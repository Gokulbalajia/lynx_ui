import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Package, Search, Heart, X, ShoppingCart, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Food & Treats', description: 'Premium nutrition for every pet' },
  { id: 'cat-2', name: 'Accessories', description: 'Bowls, leashes, collars & more' },
  { id: 'cat-3', name: 'Cages & Habitats', description: 'Safe and comfortable homes' },
  { id: 'cat-4', name: 'Toys', description: 'Keep your pet entertained' },
  { id: 'cat-5', name: 'Grooming', description: 'Brushes, shampoos & grooming tools' }
];

const SPECIES = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit'];
const SPECIES_STYLES = {
  Dog: 'bg-blue-600 text-white',
  Cat: 'bg-pink-600 text-white',
  Bird: 'bg-amber-500 text-zinc-950',
  Fish: 'bg-teal-500 text-zinc-950',
  Rabbit: 'bg-violet-500 text-white'
};

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

const formatCurrency = (value) => `₹${parseFloat(value || 0).toLocaleString('en-IN')}`;

const getLowestVariantPrice = (product) => {
  const prices = product.variants?.map((variant) => parseFloat(variant.price || 0)) || [0];
  return Math.min(...prices);
};

const getStockStatus = (variant) => {
  if (variant.stock === 0) return { text: 'Out of stock', klass: 'text-red-400' };
  if (variant.stock <= 3) return { text: `Only ${variant.stock} left`, klass: 'text-amber-400' };
  return { text: 'In stock', klass: 'text-green-400' };
};

const ProductCardSkeleton = () => (
  <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 animate-pulse">
    <div className="h-48 rounded-3xl bg-zinc-800 mb-4" />
    <div className="h-4 bg-zinc-800 rounded mb-3" />
    <div className="h-3 bg-zinc-800 rounded mb-3 w-5/6" />
    <div className="h-3 bg-zinc-800 rounded mb-3 w-2/3" />
    <div className="h-12 bg-zinc-800 rounded" />
  </div>
);

const ProductsPage = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState(SEED_CATEGORIES);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(SEED_CATEGORIES.map((category) => category.id));
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [stockOnly, setStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [wishlist, setWishlist] = useState([]);
  const [variantSelection, setVariantSelection] = useState({});
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [cartStatus, setCartStatus] = useState({ text: '', type: '', productId: null });
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories/');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data);
          setSelectedCategoryIds(response.data.map((category) => category.id.toString()));
        }
      } catch {
        setCategories(SEED_CATEGORIES);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    const queryCategory = searchParams.get('category_id');
    if (queryCategory) {
      const normalized = queryCategory.toString();
      if (categories.some((category) => category.id.toString() === normalized)) {
        setSelectedCategoryIds([normalized]);
        return;
      }
    }
    setSelectedCategoryIds(categories.map((category) => category.id.toString()));
  }, [categories, searchParams]);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    setError('');
    try {
      const params = {};
      if (selectedCategoryIds.length === 1 && selectedCategoryIds[0]) {
        params.category_id = selectedCategoryIds[0];
      }
      const res = await axios.get('/products/', { params });
      setAllProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Unable to load products. Please try again.';
      console.error('Products fetch failed:', err);
      setError(message);
      setAllProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategoryIds]);

  useEffect(() => {
    if (!categories.length) return;
    if (selectedCategoryIds.length === 1 && selectedCategoryIds[0]) {
      setSearchParams({ category_id: selectedCategoryIds[0] }, { replace: true });
      return;
    }
    setSearchParams({}, { replace: true });
  }, [selectedCategoryIds, setSearchParams, categories.length]);

  const baseProducts = allProducts;

  const categoryFilteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      if (!selectedCategoryIds.length) return true;
      return selectedCategoryIds.some((id) => id?.toString() === product.category_id?.toString());
    });
  }, [baseProducts, selectedCategoryIds]);

  const availableBrands = useMemo(() => {
    return Array.from(
      new Set(categoryFilteredProducts.map((product) => product.brand).filter(Boolean))
    ).sort();
  }, [categoryFilteredProducts]);

  const filteredProducts = useMemo(() => {
    return categoryFilteredProducts
      .filter((product) => {
        if (selectedSpecies.length > 0) {
          const tags = product.details?.pet_species_tags || [];
          if (!selectedSpecies.some((species) => tags.includes(species))) {
            return false;
          }
        }

        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }

        const lowestPrice = getLowestVariantPrice(product);
        if (lowestPrice < priceRange[0] || lowestPrice > priceRange[1]) {
          return false;
        }

        if (stockOnly && product.variants?.every((variant) => variant.stock === 0)) {
          return false;
        }

        const query = searchQuery.trim().toLowerCase();
        if (query) {
          const nameMatch = product.name.toLowerCase().includes(query);
          const descMatch = product.short_description?.toLowerCase().includes(query);
          if (!nameMatch && !descMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return getLowestVariantPrice(a) - getLowestVariantPrice(b);
          case 'price-desc':
            return getLowestVariantPrice(b) - getLowestVariantPrice(a);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return parseInt(b.id, 10) - parseInt(a.id, 10);
        }
      });
  }, [categoryFilteredProducts, selectedBrands, selectedSpecies, priceRange, stockOnly, searchQuery, sortBy]);

  const countsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = allProducts.filter(p => p.category_id?.toString() === category.id?.toString()).length;
      return acc;
    }, {});
  }, [allProducts, categories]);

  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const toggleSpecies = (species) => {
    setSelectedSpecies((prev) =>
      prev.includes(species) ? prev.filter((item) => item !== species) : [...prev, species]
    );
  };

  const toggleBrand = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((item) => item !== brandName) : [...prev, brandName]
    );
  };

  const clearFilters = () => {
    setSelectedCategoryIds(categories.map((category) => category.id.toString()));
    setSelectedSpecies([]);
    setSelectedBrands([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setStockOnly(false);
    setSearchQuery('');
    setSortBy('newest');
    setSearchParams({});
  };

  const handleAdd = async (product, variant) => {
    if (!variant?.id) {
      setCartStatus({
        text: 'Unable to add this product. Please select a valid option.',
        type: 'error',
        productId: product.id
      });
      return;
    }

    if (variant.stock === 0) {
      setCartStatus({
        text: 'This variant is out of stock.',
        type: 'error',
        productId: product.id
      });
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const currentUserId = user?.id || userId;
    if (!currentUserId) {
      setCartStatus({
        text: 'Unable to determine user. Please sign in again.',
        type: 'error',
        productId: product.id
      });
      return;
    }

    setAddingToCartId(product.id);
    setCartStatus({ text: '', type: '', productId: null });
    let cartSynced = false;

    try {
      const response = await axios.post('/cart/', {
        item_type: 'product',
        product_variant_id: variant.id,
        pet_id: null,
        quantity: 1,
        user_id: currentUserId
      });
      if (response?.data?.id) {
        cartSynced = true;
        variant.cart_item_id = response.data.id;
      }
    } catch (error) {
      console.error('Cart sync failed, falling back to local cart', error.response?.data || error);
    }

    onAddToCart({
      item_type: 'product',
      product_variant_id: variant.id,
      id: product.id,
      cart_item_id: variant.cart_item_id || null,
      name: product.name,
      img: product.images?.[0]?.image_url || '',
      price: parseFloat(variant.price || '0'),
      quantity: 1,
      category: product.category
    });

    setCartStatus({
      text: cartSynced
        ? 'Added to cart successfully.'
        : 'Added locally. Sign in to sync with your account.',
      type: cartSynced ? 'success' : 'warning',
      productId: product.id
    });
    setAddingToCartId(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const updatePriceMin = (value) => {
    setPriceRange(([min, max]) => [Math.min(value, max), max]);
  };

  const updatePriceMax = (value) => {
    setPriceRange(([min, max]) => [min, Math.max(value, min)]);
  };

  const getSelectedVariant = (product) => {
    return (
      variantSelection[product.id] || product.variants?.[0] || { price: '0', stock: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-200"
            >
              <Package size={16} /> Back to home
            </Link>
            <div>
              <h1 className="text-4xl font-black">Shop Products</h1>
              <p className="text-zinc-500 mt-2">Browse product essentials with live filters and fast checkout.</p>
            </div>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition md:hidden"
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadProducts}
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sticky top-24 self-start h-fit">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={clearFilters} className="text-sm text-blue-400 hover:text-white">Clear</button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 cursor-pointer hover:border-blue-500">
                      <span className="text-sm text-white">{category.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{countsByCategory[category.id] || 0}</span>
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(category.id.toString())}
                          onChange={() => toggleCategory(category.id.toString())}
                          className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Pet species</h3>
                <div className="grid gap-3">
                  {SPECIES.map((species) => (
                    <label key={species} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 cursor-pointer hover:border-blue-500">
                      <span className="text-sm text-white">{species}</span>
                      <input
                        type="checkbox"
                        checked={selectedSpecies.includes(species)}
                        onChange={() => toggleSpecies(species)}
                        className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Brand</h3>
                <div className="space-y-3">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 cursor-pointer hover:border-blue-500">
                      <span className="text-sm text-white">{brand}</span>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Price range</h3>
                <div className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-300">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      value={priceRange[0]}
                      onChange={(e) => updatePriceMin(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      value={priceRange[1]}
                      onChange={(e) => updatePriceMax(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4">
                <label className="flex items-center justify-between gap-3 text-sm text-zinc-300">
                  <span>In stock only</span>
                  <input
                    type="checkbox"
                    checked={stockOnly}
                    onChange={() => setStockOnly((prev) => !prev)}
                    className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                  />
                </label>
              </div>
            </div>
          </aside>

          <div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm text-zinc-400">Showing {filteredProducts.length} products</div>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, snacks, toys..."
                  className="w-full rounded-full border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-zinc-800 bg-zinc-950 py-3 px-4 text-sm text-white outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>

            {loadingProducts ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const selectedVariant = getSelectedVariant(product);
                  const stockStatus = getStockStatus(selectedVariant);
                  const productBrand = product.brand || 'Brand';

                  return (
                    <div key={product.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                      <Link to={`/products/${product.id}`} className="block relative overflow-hidden bg-zinc-800 h-[260px]">
                        {product.images?.length > 0 ? (
                          <img
                            src={product.images.find((image) => image.is_primary)?.image_url || product.images[0].image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-4xl text-zinc-600">🛍️</div>
                        )}
                      </Link>
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">{productBrand}</span>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="rounded-full bg-zinc-900 p-2 text-zinc-300 hover:text-white transition"
                            type="button"
                          >
                            <Heart className={wishlist.includes(product.id) ? 'text-rose-500' : 'text-zinc-300'} size={18} />
                          </button>
                        </div>
                        <Link to={`/products/${product.id}`} className="block">
                          <h3 className="text-lg font-bold text-white leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-zinc-400" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.short_description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(product.details?.pet_species_tags || []).map((species) => (
                            <span key={species} className={`rounded-full px-2 py-1 text-xs font-semibold ${SPECIES_STYLES[species] || 'bg-zinc-700 text-white'}`}>
                              {species}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(product.variants || []).map((variant) => (
                            <button
                              key={variant.id}
                              onClick={() => setVariantSelection((prev) => ({ ...prev, [product.id]: variant }))}
                              type="button"
                              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                variant.id === selectedVariant.id
                                  ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-400 hover:text-white'
                              }`}
                            >
                              {variant.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm text-zinc-400">Price</p>
                            <p className="text-2xl font-bold text-amber-400">{formatCurrency(selectedVariant.price)}</p>
                          </div>
                          <p className={`text-sm font-semibold ${stockStatus.klass}`}>{stockStatus.text}</p>
                        </div>
                        <button
                          onClick={() => handleAdd(product, selectedVariant)}
                          disabled={selectedVariant.stock === 0 || addingToCartId === product.id}
                          className={`w-full rounded-2xl py-3 text-sm font-semibold transition ${
                            selectedVariant.stock === 0 || addingToCartId === product.id
                              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                              : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                          }`}
                        >
                          {addingToCartId === product.id ? 'Adding…' : 'Add to Cart'}
                        </button>
                        {cartStatus.productId === product.id && cartStatus.text && (
                          <p className={`mt-3 text-sm ${cartStatus.type === 'success' ? 'text-green-400' : 'text-rose-400'}`}>
                            {cartStatus.text}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : !loadingProducts && allProducts.length === 0 ? (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-16 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h2 className="text-2xl font-bold text-white mb-2">No products yet</h2>
                <p className="text-zinc-500 mb-2">Admin hasn't added any products yet.</p>
                <p className="text-zinc-600 text-sm">Check back soon!</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center text-3xl">🔍</div>
                <h2 className="text-2xl font-bold text-white mb-2">No products found for your filters</h2>
                <p className="text-zinc-500 mb-6">Try a different combination or clear your filters.</p>
                <button onClick={clearFilters} className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-zinc-950 border border-zinc-800 p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Filters</h2>
                <p className="text-sm text-zinc-400">Tap a filter to refine products.</p>
              </div>
              <button onClick={() => setMobileFiltersOpen(false)} className="rounded-full bg-zinc-900 p-2 text-zinc-300 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 cursor-pointer hover:border-blue-500">
                      <span className="text-sm text-white">{category.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(category.id.toString())}
                        onChange={() => toggleCategory(category.id.toString())}
                        className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Pet species</h3>
                <div className="grid gap-3">
                  {SPECIES.map((species) => (
                    <label key={species} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 cursor-pointer hover:border-blue-500">
                      <span className="text-sm text-white">{species}</span>
                      <input
                        type="checkbox"
                        checked={selectedSpecies.includes(species)}
                        onChange={() => toggleSpecies(species)}
                        className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Brand</h3>
                <div className="space-y-3">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 cursor-pointer hover:border-blue-500">
                      <span className="text-sm text-white">{brand}</span>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Price range</h3>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="mb-4 flex items-center justify-between text-sm text-zinc-300">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    value={priceRange[0]}
                    onChange={(e) => updatePriceMin(Number(e.target.value))}
                    className="w-full accent-blue-500 mb-4"
                  />
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    value={priceRange[1]}
                    onChange={(e) => updatePriceMax(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4">
                <label className="flex items-center justify-between gap-3 text-sm text-zinc-300">
                  <span>In stock only</span>
                  <input
                    type="checkbox"
                    checked={stockOnly}
                    onChange={() => setStockOnly((prev) => !prev)}
                    className="h-4 w-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded"
                  />
                </label>
              </div>
              <button onClick={clearFilters} className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Clear filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
