import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Filter, SortAsc, SortDesc, ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PetCardSkeleton = () => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-zinc-800"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
      <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
      <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
      <div className="h-6 bg-zinc-800 rounded w-1/3"></div>
      <div className="h-8 bg-zinc-800 rounded w-full"></div>
    </div>
  </div>
);

const PetCard = ({ pet, onAddToCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, userId } = useAuth();
  const primaryImage = pet.images?.find(img => img.is_primary) || pet.images?.[0];

  const formatAge = (months) => {
    if (months === 0) return "Newborn";
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} yr ${remainingMonths} mo` : `${years} yr`;
  };

  const genderColor = pet.gender === 'Male' ? 'bg-blue-600' : pet.gender === 'Female' ? 'bg-pink-600' : 'bg-zinc-600';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div className="relative aspect-[4/3] overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <Heart size={48} className="text-zinc-600" />
          </div>
        )}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${
          pet.is_available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {pet.is_available ? 'Available' : 'Sold Out'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white text-lg mb-1">{pet.name}</h3>
        <p className="text-zinc-500 text-sm mb-2">{pet.breed?.name || pet.breed || 'Unknown breed'} • {pet.pet_type?.name || pet.pet_type || 'Unknown type'}</p>
        <p className="text-zinc-400 text-sm mb-2">{formatAge(pet.age_months)}</p>
        <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${genderColor} mb-3`}>
          {pet.gender}
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {(pet.tags || []).slice(0, 2).map((tag, idx) => (
            <span key={idx} className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {(pet.tags || []).length > 2 && (
            <span className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full text-xs">
              +{(pet.tags || []).length - 2} more
            </span>
          )}
        </div>
        <p className="text-amber-400 font-bold text-xl mb-4">₹{parseFloat(pet.price).toLocaleString('en-IN')}</p>
        <div className="space-y-2">
          <button
            onClick={() => navigate(`/pets/${pet.id}`)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View Details
          </button>
          <button
            onClick={async () => {
              if (!isAuthenticated) {
                navigate('/login');
                return;
              }

              const currentUserId = user?.id || userId;
              if (!currentUserId) {
                console.error('Unable to determine user id; please sign in again.');
                return;
              }

              try {
                await axios.post('/cart/', {
                  item_type: 'pet',
                  pet_id: pet.id,
                  product_variant_id: null,
                  quantity: 1,
                  user_id: currentUserId
                });
              } catch (error) {
                console.error('Failed to add pet to cart', error.response?.data || error);
              }

              onAddToCart({
                item_type: 'pet',
                pet_id: pet.id,
                id: pet.id,
                name: pet.name,
                img: primaryImage?.image_url || '',
                price: parseFloat(pet.price),
                quantity: 1,
                category: pet.pet_type?.name || pet.pet_type || 'Pet',
              });
            }}
            disabled={!pet.is_available || pet.stock === 0}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
              pet.is_available && pet.stock > 0
                ? 'bg-amber-600 hover:bg-amber-700 text-black'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const PetsPage = ({ onAddToCart }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'All',
    gender: 'All',
    availableOnly: false,
    sortBy: 'name'
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('/pets/');
        if (Array.isArray(response.data)) {
          setPets(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const filteredAndSortedPets = useMemo(() => {
    let filtered = pets.filter(pet => {
      if (filters.type !== 'All' && (pet.pet_type?.name || pet.pet_type) !== filters.type) return false;
      if (filters.gender !== 'All' && pet.gender !== filters.gender) return false;
      if (filters.availableOnly && !pet.is_available) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'youngest':
          return a.age_months - b.age_months;
        case 'oldest':
          return b.age_months - a.age_months;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [pets, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-4">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold">
          ← Back to Home
        </a>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 p-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {/* Pet Type Pills */}
            <div className="flex gap-2">
              {['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Rabbit'].map(type => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('type', type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    filters.type === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Gender Toggle */}
            <div className="flex gap-2">
              {['All', 'Male', 'Female'].map(gender => (
                <button
                  key={gender}
                  onClick={() => handleFilterChange('gender', gender)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    filters.gender === gender
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="name">Name</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="youngest">Youngest</option>
              <option value="oldest">Oldest</option>
            </select>

            {/* Available Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-zinc-400">Available only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Find Your Perfect Pet</h1>
          <p className="text-zinc-500">Browse our collection of adorable pets waiting for their forever homes.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="text-2xl font-bold text-white mb-2">No pets available yet</h2>
            <p className="text-zinc-500">Admin will add pets soon. Check back!</p>
          </div>
        ) : filteredAndSortedPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedPets.map(pet => (
              <PetCard key={pet.id} pet={pet} onAddToCart={onAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart size={64} className="text-zinc-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No pets found</h2>
            <p className="text-zinc-500 mb-6">Try adjusting your filters to see more pets.</p>
            <button
              onClick={() => setFilters({ type: 'All', gender: 'All', availableOnly: false, sortBy: 'name' })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-all"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;