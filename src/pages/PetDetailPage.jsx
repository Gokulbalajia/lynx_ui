import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, X, Syringe, Home, Utensils, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PetCard = ({ pet, onAddToCart }) => {
  const navigate = useNavigate();
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all flex-shrink-0 w-64">
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
            View Details
          </button>
          <button
            onClick={() => onAddToCart({
              item_type: 'pet',
              pet_id: pet.id,
              id: pet.id,
              name: pet.name,
              img: primaryImage?.image_url || '',
              price: parseFloat(pet.price),
              quantity: 1,
              category: pet.pet_type?.name || pet.pet_type || 'Pet',
            })}
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

const PetDetailPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, userId, isAdmin } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/pets/${id}`);
        setPet(response.data);
      } catch (error) {
        console.error('Failed to fetch pet:', error);
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const formatAge = (months) => {
    if (months === 0) return 'Newborn';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} yr ${remainingMonths} mo` : `${years} yr`;
  };

  const genderColor = pet?.gender === 'Male' ? 'text-blue-400' : pet?.gender === 'Female' ? 'text-pink-400' : 'text-zinc-400';

  const getHealthCareInfo = (petType, ageMonths) => {
    const info = {
      vaccinations: ageMonths < 6 ? 'First dose complete' : 'Up to date',
      livingSpace: petType === 'Dog' ? 'Needs outdoor space' : 'Apartment OK',
      diet: {
        Dog: '2x daily kibble',
        Cat: 'Wet + dry mix',
        Bird: 'Seeds + pellets',
        Fish: 'Flake food daily',
        Rabbit: 'Hay + pellets',
      }[petType] || 'Balanced diet',
      activity: {
        Dog: 'Daily walks + play',
        Cat: 'Indoor play + scratching',
        Bird: 'Flight time + toys',
        Fish: 'Swim space + plants',
        Rabbit: 'Hopping space + toys',
      }[petType] || 'Regular exercise',
    };
    return info;
  };

  const healthInfo = getHealthCareInfo(pet?.pet_type, pet?.age_months);

  const [relatedPets, setRelatedPets] = useState([]);

  useEffect(() => {
    if (!pet?.pet_type) {
      setRelatedPets([]);
      return;
    }

    const fetchRelatedPets = async () => {
      try {
        const response = await axios.get('/pets/');
        if (Array.isArray(response.data)) {
          setRelatedPets(
            response.data
              .filter((p) => p.pet_type === pet.pet_type && p.id !== pet.id)
              .slice(0, 3)
          );
        }
      } catch (error) {
        console.error('Failed to fetch related pets:', error);
        setRelatedPets([]);
      }
    };

    fetchRelatedPets();
  }, [pet?.pet_type, pet?.id]);

  const handleAddToCart = async () => {
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
      img: pet.images?.[0]?.image_url || '',
      price: parseFloat(pet.price),
      quantity,
      category: pet.pet_type?.name || pet.pet_type || 'Pet',
    });
  };

  const openWhatsApp = () => {
    const message = `Hi, I'm interested in adopting ${pet.name}. Can you provide more information?`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen bg-black p-8 text-white">Loading pet details…</div>;
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <p>Pet not found.</p>
        <button
          onClick={() => navigate('/pets')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-full text-white"
        >
          Back to pets
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Link */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/pets')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Pets
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={pet.images?.[currentImageIndex]?.image_url || '/images/placeholder.jpg'}
                alt={pet.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Heart size={24} className="text-white" />
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {pet.images && pet.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {pet.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-zinc-700'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${pet.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Pet Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white">{pet.name}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  pet.is_available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {pet.is_available ? 'Available' : 'Sold Out'}
                </div>
              </div>
              <p className="text-amber-400 text-3xl font-bold">₹{parseFloat(pet.price).toLocaleString('en-IN')}</p>
            </div>

            {/* Detail Grid */}
            <div className="bg-zinc-800 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">🐾</span>
                <div>
                  <p className="text-zinc-500 text-sm">Type</p>
                  <p className="text-white font-semibold">{pet.pet_type?.name || pet.pet_type || 'Unknown type'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">🧬</span>
                <div>
                  <p className="text-zinc-500 text-sm">Breed</p>
                  <p className="text-white font-semibold">{pet.breed?.name || pet.breed || 'Unknown breed'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">📅</span>
                <div>
                  <p className="text-zinc-500 text-sm">Age</p>
                  <p className="text-white font-semibold">{formatAge(pet.age_months)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">⚥</span>
                <div>
                  <p className="text-zinc-500 text-sm">Gender</p>
                  <p className={`font-semibold ${genderColor}`}>{pet.gender}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-zinc-400">📦</span>
                <div>
                  <p className="text-zinc-500 text-sm">Stock</p>
                  <p className={`font-semibold ${pet.stock <= 2 ? 'text-amber-400' : 'text-white'}`}>
                    {pet.stock <= 2 ? `Only ${pet.stock} left!` : 'In stock'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(pet.tags || []).map((tag, idx) => (
                  <span key={idx} className="bg-amber-900 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">About {pet.name}</h3>
              <p className="text-zinc-300 leading-relaxed">{pet.description}</p>
            </div>

            {/* Health & Care */}
            <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Health & Care</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <Syringe size={20} className="text-zinc-400" />
                  <div>
                    <p className="text-zinc-500 text-sm">Vaccinations</p>
                    <p className="text-white">{healthInfo.vaccinations}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home size={20} className="text-zinc-400" />
                  <div>
                    <p className="text-zinc-500 text-sm">Living space</p>
                    <p className="text-white">{healthInfo.livingSpace}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils size={20} className="text-zinc-400" />
                  <div>
                    <p className="text-zinc-500 text-sm">Diet</p>
                    <p className="text-white">{healthInfo.diet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-zinc-400" />
                  <div>
                    <p className="text-zinc-500 text-sm">Activity</p>
                    <p className="text-white">{healthInfo.activity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {pet.stock > 1 && (
              <div className="flex items-center gap-4">
                <span className="text-zinc-400">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(pet.stock, quantity + 1))}
                    className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              {!isAdmin && (
                <button
                  onClick={handleAddToCart}
                  disabled={!pet.is_available || pet.stock === 0}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                    pet.is_available && pet.stock > 0
                      ? 'bg-amber-600 hover:bg-amber-700 text-black'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
              )}
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Enquire via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        {relatedPets.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">You might also like</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {relatedPets.map(relatedPet => (
                <PetCard key={relatedPet.id} pet={relatedPet} onAddToCart={onAddToCart} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-zinc-400 transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src={pet.images?.[currentImageIndex]?.image_url || '/images/placeholder.jpg'}
            alt={pet.name}
            className="max-w-full max-h-full object-contain"
          />
          {pet.images && pet.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + pet.images.length) % pet.images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-zinc-400 transition-colors"
              >
                <ChevronLeft size={48} />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % pet.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-zinc-400 transition-colors"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PetDetailPage;