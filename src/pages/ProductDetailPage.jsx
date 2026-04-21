import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Copy, MessageCircle, Star, X } from 'lucide-react';
import { getProductImage, normalizeImagePath } from '../utils/assetUtils';

const formatCurrency = (value) => `₹${parseFloat(value || 0).toLocaleString('en-IN')}`;

const formatExpiry = (expiryDate) => {
  if (!expiryDate) return 'No expiry';
  const date = new Date(expiryDate);
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

const getVariantStatus = (variant) => {
  if (variant.stock === 0) return { text: 'Out of stock', badge: 'bg-zinc-800 text-zinc-400', strike: true };
  if (variant.stock <= 3) return { text: `Only ${variant.stock} left`, badge: 'bg-amber-500/10 text-amber-300', strike: false };
  return { text: 'In stock', badge: 'bg-green-500/10 text-green-300', strike: false };
};

const getSpeciesPill = (species) => {
  const map = {
    Dog: 'bg-blue-500 text-white',
    Cat: 'bg-pink-500 text-white',
    Bird: 'bg-amber-500 text-zinc-950',
    Fish: 'bg-teal-500 text-zinc-950',
    Rabbit: 'bg-violet-500 text-white'
  };
  return map[species] || 'bg-zinc-700 text-white';
};

const ProductDetailPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, userId, isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePane, setActivePane] = useState('ingredients');
  const [wishlisted, setWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      setMainImageIndex(0);
    }
  }, [product?.id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        if (response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setLoading(false);
      }
    };

    if (!product || product.id !== id) {
      loadProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!product?.category_id) {
      setRelatedProducts([]);
      return;
    }

    axios.get('/products/', { params: { category_id: product.category_id } })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRelatedProducts(
            res.data.filter((p) => p.id !== product.id).slice(0, 4)
          );
        }
      })
      .catch(() => setRelatedProducts([]));
  }, [product?.category_id, product?.id]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setMainImageIndex((prev) => Math.max(0, prev - 1));
      }
      if (event.key === 'ArrowRight') {
        setMainImageIndex((prev) => Math.min((product?.images?.length || 1) - 1, prev + 1));
      }
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, product?.images]);

  const handleAddToCartClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedVariant) return;

    const currentUserId = user?.id || userId;
    if (!currentUserId) {
      console.error('Unable to determine user id; please sign in again.');
      return;
    }

    try {
      await axios.post('/cart/', {
        item_type: 'product',
        product_variant_id: selectedVariant.id,
        pet_id: null,
        quantity,
        user_id: currentUserId
      });
    } catch (error) {
      console.error('Failed to add product to cart', error.response?.data || error);
    }

    onAddToCart({
      item_type: 'product',
      product_variant_id: selectedVariant.id,
      id: product.id,
      name: product.name,
      img: getProductImage(product),
      price: parseFloat(selectedVariant.price || '0'),
      quantity,
      category: product.category
    });
  };

  const handleBuyNow = async () => {
    await handleAddToCartClick();
    navigate('/cart');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    } catch {
      console.error('Copy failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black p-8 text-white">Loading product details…</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <p>Product not found.</p>
        <Link to="/products" className="mt-4 inline-flex bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-full text-white">
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.images?.length 
    ? product.images.map(img => ({ ...img, image_url: normalizeImagePath(img.image_url) })) 
    : [{ image_url: getProductImage(product), is_primary: true }];
  
  const mainImage = images[mainImageIndex] || images[0];
  const selectedVariantStock = selectedVariant?.stock ?? 0;

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div
              className="relative overflow-hidden rounded-3xl bg-zinc-900 cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              <img src={mainImage.image_url} alt={product.name} className="w-full h-[480px] object-cover transition duration-500 hover:scale-[1.03]" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMainImageIndex(index)}
                  className={`flex-shrink-0 h-20 w-28 overflow-hidden rounded-2xl border ${index === mainImageIndex ? 'border-blue-500' : 'border-zinc-800'} bg-zinc-900`}
                >
                  <img src={image.image_url} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 space-y-6">
            <div className="space-y-3">
              <div className="text-sm text-amber-400">
                {product.brand} /{' '}
                <Link to={`/products?category_id=${product.category_id}`} className="text-amber-200 hover:text-amber-100">
                  {product.category}
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-zinc-100">{product.name}</h1>
              <p className="text-zinc-400">{product.short_description}</p>
              <div className="flex items-center gap-2 text-amber-400">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={16} />
                ))}
                <span className="text-sm text-zinc-500">(24 reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Choose size / variant</h2>
                    <p className="text-sm text-zinc-500">Select the best fit for your pet.</p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300"
                    onClick={() => setWishlisted((prev) => !prev)}
                  >
                    <Heart size={18} className={wishlisted ? 'text-rose-500' : 'text-zinc-400'} />
                  </button>
                </div>
                <div className="grid gap-3">
                  {product.variants?.map((variant) => {
                    const status = getVariantStatus(variant);
                    const selected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`rounded-3xl border px-5 py-4 text-left transition ${
                          selected ? 'border-amber-400 bg-amber-400/10' : 'border-zinc-800 bg-zinc-900 hover:border-amber-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm text-zinc-400">{variant.label}</div>
                            <div className="text-base font-semibold text-white">SKU: {variant.sku}</div>
                          </div>
                          <div className={`rounded-full px-3 py-1 text-sm font-semibold ${status.badge}`}>
                            {status.text}
                          </div>
                        </div>
                        <div className="mt-3 text-2xl font-bold text-amber-400">{formatCurrency(variant.price)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm text-zinc-400">Selected price</p>
                <p className="text-4xl font-bold text-amber-400 mt-2">{formatCurrency(selectedVariant?.price)}</p>
              </div>

              {selectedVariantStock > 1 && (
                <div className="flex items-center gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
                  <button
                    type="button"
                    onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                    className="rounded-full bg-zinc-800 px-4 py-2 text-lg"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((qty) => Math.min(selectedVariantStock, qty + 1))}
                    className="rounded-full bg-zinc-800 px-4 py-2 text-lg"
                  >
                    +
                  </button>
                  <span className="text-sm text-zinc-400">Max {selectedVariantStock}</span>
                </div>
              )}

              {!isAdmin && (
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCartClick}
                    disabled={selectedVariantStock === 0}
                    className={`w-full rounded-3xl py-4 text-lg font-semibold transition ${
                      selectedVariantStock === 0
                        ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                        : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                    }`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full rounded-3xl bg-zinc-700 py-4 text-lg font-semibold text-white hover:bg-zinc-600 transition"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <button
                type="button"
                onClick={() => setActivePane((prev) => (prev === 'ingredients' ? '' : 'ingredients'))}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-semibold text-white">Ingredients & Material</span>
                <span className="text-zinc-400">{activePane === 'ingredients' ? '-' : '+'}</span>
              </button>
              {activePane === 'ingredients' && (
                <p className="text-zinc-400">{product.details?.ingredients_material || 'No ingredients details available.'}</p>
              )}
            </div>
            <div className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <button
                type="button"
                onClick={() => setActivePane((prev) => (prev === 'compatibility' ? '' : 'compatibility'))}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-semibold text-white">Pet compatibility</span>
                <span className="text-zinc-400">{activePane === 'compatibility' ? '-' : '+'}</span>
              </button>
              {activePane === 'compatibility' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(product.details?.pet_species_tags || []).map((tag) => (
                    <span key={tag} className={`${getSpeciesPill(tag)} rounded-full px-3 py-1 text-xs font-semibold`}>
                      {tag}
                    </span>
                  ))}
                  {(product.details?.lifestyle_tags || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <button
                type="button"
                onClick={() => setActivePane((prev) => (prev === 'weight' ? '' : 'weight'))}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-semibold text-white">Weight & Packaging</span>
                <span className="text-zinc-400">{activePane === 'weight' ? '-' : '+'}</span>
              </button>
              {activePane === 'weight' && (
                <div className="mt-4 space-y-2 text-zinc-400 text-sm">
                  <p><span className="font-semibold text-white">Weight:</span> {product.details?.weight || 'N/A'}</p>
                  <p><span className="font-semibold text-white">Flavor:</span> {product.details?.flavor || 'Unflavored'}</p>
                  <p><span className="font-semibold text-white">Expiry:</span> {formatExpiry(product.details?.expiry_date)}</p>
                  <p><span className="font-semibold text-white">SKU:</span> {selectedVariant?.sku || 'N/A'}</p>
                </div>
              )}
            </div>
            <div className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <button
                type="button"
                onClick={() => setActivePane((prev) => (prev === 'delivery' ? '' : 'delivery'))}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-semibold text-white">Delivery & Returns</span>
                <span className="text-zinc-400">{activePane === 'delivery' ? '-' : '+'}</span>
              </button>
              {activePane === 'delivery' && (
                <div className="mt-4 space-y-2 text-zinc-400 text-sm">
                  <p>Free delivery on orders above ₹499</p>
                  <p>Delivered in 2–4 business days</p>
                  <p>Easy 7-day return policy</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center gap-3 text-zinc-400 mb-4">
                <Copy size={18} /> <span className="text-sm">Share</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyLink}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white hover:border-blue-500"
                >
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} on Lynx Pet Shop ${window.location.href}`)}`, '_blank')}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white hover:border-green-500"
                >
                  <MessageCircle size={18} /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Related products</h2>
            <div className="flex gap-5 overflow-x-auto pb-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/products/${related.id}`}
                  className="min-w-[260px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950"
                >
                  <div className="h-40 overflow-hidden bg-zinc-800">
                    <img
                      src={getProductImage(related)}
                      alt={related.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-2">{related.brand}</p>
                    <h3 className="text-white font-semibold mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {related.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-3">{formatCurrency(related.variants?.[0]?.price)}</p>
                    <div className="flex flex-wrap gap-2">
                      {(related.details?.pet_species_tags || []).map((tag) => (
                        <span key={tag} className={`${getSpeciesPill(tag)} rounded-full px-2 py-1 text-xs font-semibold`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-h-full w-full max-w-5xl">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxOpen(false);
              }}
              className="absolute right-4 top-4 z-20 rounded-full bg-zinc-900 p-2 text-white"
            >
              <X size={24} />
            </button>
            <img src={mainImage.image_url} alt={product.name} className="h-full w-full object-contain" />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900 p-3 text-white"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMainImageIndex((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900 p-3 text-white"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
