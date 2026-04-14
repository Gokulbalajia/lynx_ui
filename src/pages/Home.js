import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, CheckCircle2, CreditCard, Truck, X, Mail, MapPin, Phone, ExternalLink, Camera, Globe } from 'lucide-react';

const PET_CATEGORIES = [
  { id: 'dog', name: 'Dog', image: '/images/pexels-hnoody93-58997.jpg' },
  { id: 'cat', name: 'Cat', image: '/images/cat-7094808_1280.jpg' },
  { id: 'fish', name: 'Fish', image: '/images/make-realistic-colourful-fish-swimming-gracefully-tranquil-underwater-garden-photo-realist_1098360-2533.png' },
  { id: 'rabbit', name: 'Rabbit', image: '/images/white-hotot-rabbit-eating-grass-509265984-5c0da06546e0fb0001366ac0.jpg' },
  { id: 'bird', name: 'Bird', image: '/images/popugai-pticy-zhivotnye-31997.jpg' }
];

const HERO_SLIDES = [
  { id: 1, title: "Premium Dog Nutrition", subtitle: "Give your best friend the best fuel.", img: "/images/493584.jpg", color: "from-blue-600" },
  { id: 2, title: "Cozy Cat Kingdoms", subtitle: "Comfortable beds for your feline royalty.", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1200", color: "from-purple-600" },
  { id: 3, title: "Aquarium Essentials", subtitle: "Everything for a vibrant underwater world.", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200", color: "from-teal-600" },
  { id: 4, title: "Happy Bunny Haven", subtitle: "Everything your rabbit needs for a cozy and playful life.", img: "/images/2962543.jpg", color: "from-teal-600" },
  { id: 5, title: "Feathered Friends Paradise", subtitle: "All essentials to keep your birds happy, active, and chirping.", img: "/images/776717-lovebirds-wallpaper-1920x1080-for-full-hd.jpg", color: "from-teal-600"},
];

const AVAILABLE_PETS = [
  { id: 'pet-1', name: 'Golden Retriever Puppy', price: 24999, category: 'Dog', img: '/images/dog-puppy.jpg' },
  { id: 'pet-2', name: 'Siamese Kitten', price: 21999, category: 'Cat', img: '/images/siamese-kitten.jpg' },
  { id: 'pet-3', name: 'Betta Fish', price: 899, category: 'Fish', img: '/images/betta-fish.jpg' },
  { id: 'pet-4', name: 'Mini Lop Bunny', price: 15999, category: 'Rabbit', img: '/images/rabbit-pet.jpg' },
  { id: 'pet-5', name: 'Parakeet Pair', price: 4999, category: 'Bird', img: '/images/bird-pair.jpg' },
];

const ProductCard = ({ product, onAddToCart, linkTo }) => (
  <Link
    to={linkTo}
    className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all flex-shrink-0 w-64 cursor-pointer"
  >
    <div className="h-48 overflow-hidden relative">
      <img src={product.img || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart(product);
        }}
        className="absolute bottom-3 right-3 bg-blue-600 p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-blue-700"
      >
        <ShoppingCart size={20} />
      </button>
    </div>
    <div className="p-4">
      <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{product.category || 'Product'}</div>
      <h3 className="font-semibold text-white truncate">{product.name}</h3>
      <div className="flex items-center justify-between mt-2">
        <span className="text-lg font-bold text-white">₹{(product.price || 0).toLocaleString('en-IN')}</span>
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-current" />
          ))}
        </div>
      </div>
    </div>
  </Link>
);

const CheckoutModal = ({ isOpen, onClose, cartItems, onClearCart }) => {
  const [step, setStep] = useState('summary');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '' });
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Your Order</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'summary' && (
            <div className="space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <img src={item.img || 'https://via.placeholder.com/64'} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-zinc-500 text-sm capitalize">{item.category || 'Product'}</p>
                    </div>
                    <span className="text-white font-bold">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-zinc-500 py-10">Your cart is empty.</p>
              )}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="First Name" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" 
                />
                <input 
                  placeholder="Last Name" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" 
                />
              </div>
              <input 
                placeholder="Address" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" 
              />
              <div className="bg-zinc-950 p-4 rounded-xl border border-blue-500/30 flex items-center gap-3">
                <div className="text-blue-500"><CreditCard size={20} /></div>
                <span className="text-white">Pay Securely via Credit Card / UPI</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10">
              <div className="bg-green-500/10 text-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
              <p className="text-zinc-400">Thank you for shopping with Lynx. Your pets will love it!</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
          <div className="flex justify-between mb-4">
            <span className="text-zinc-400">Total Amount</span>
            <span className="text-2xl font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
          </div>
          {step === 'summary' && cartItems.length > 0 && (
            <button 
              onClick={() => setStep('details')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Proceed to Payment <Truck size={20} />
            </button>
          )}
          {step === 'details' && (
            <button 
              onClick={() => setStep('success')} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all"
            >
              Complete Order
            </button>
          )}
          {step === 'success' && (
            <button 
              onClick={() => { onClearCart(); onClose(); setStep('summary'); }} 
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HeroCarousel = ({ onAddToCart }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const mockProduct = { id: 0, name: 'Featured Product', price: 9999, category: 'featured', img: HERO_SLIDES[current]?.img };

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-zinc-900">
      {HERO_SLIDES.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-40`} />
          <img src={slide.img} alt={slide.title} className="absolute inset-0 w-full h-full object-cover -z-10" />
          <div className="container mx-auto px-10 relative z-20">
            <h2 className="text-5xl font-black text-white mb-4 transition-all duration-700">{slide.title}</h2>
            <p className="text-xl text-zinc-200 mb-8 max-w-lg">{slide.subtitle}</p>
            <button 
              onClick={() => onAddToCart(mockProduct)}
              className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              Shop Now
            </button>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {HERO_SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = ({ cartItems, onAddToCart, onClearCart }) => {
  const [mockCategories] = useState([
    // 🐶 DOG
    { id: 1, category: 'dog', name: 'Food', price: 2499, img: '/images/Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png' },
    { id: 2, category: 'dog', name: 'Treats', price: 499, img: '/images/2Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png' },
    { id: 3, category: 'dog', name: 'Toys', price: 799, img: '/images/4Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png' },
    { id: 4, category: 'dog', name: 'Grooming', price: 1299, img: '/images/3Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png' },
    { id: 5, category: 'dog', name: 'Accessories', price: 599, img: '/images/5Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png' },
    { id: 6, category: 'dog', name: 'Beds', price: 4599, img: '/images/6Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png' },
    { id: 7, category: 'dog', name: 'Health', price: 899, img: '/images/7Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png' },

    // 🐱 CAT
    { id: 8, category: 'cat', name: 'Food', price: 1899, img: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (7).png' },
    { id: 9, category: 'cat', name: 'Treats', price: 349, img: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (3).png' },
    { id: 10, category: 'cat', name: 'Toys', price: 299, img: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (4).png' },
    { id: 11, category: 'cat', name: 'Grooming', price: 999, img: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (5).png' },
    { id: 12, category: 'cat', name: 'Accessories', price: 499, img: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (6).png' },
    { id: 13, category: 'cat', name: 'Litter', price: 799, img: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (1).png' },
    { id: 14, category: 'cat', name: 'Beds', price: 3299, img: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh.png' },

    // 🐟 FISH
    { id: 15, category: 'fish', name: 'Food', price: 299, img: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=300' },
    { id: 16, category: 'fish', name: 'Aquarium', price: 8999, img: '/images/FGemini_Generated_Image_dx17y1dx17y1dx17.png' },
    { id: 17, category: 'fish', name: 'Accessories', price: 599, img: '/images/f1Gemini_Generated_Image_dx17y1dx17y1dx17.png' },

    // 🐰 RABBIT
    { id: 18, category: 'rabbit', name: 'Food', price: 699, img: '/images/fGemini_Generated_Image_xd5bcaxd5bcaxd5b.png' },
    { id: 19, category: 'rabbit', name: 'Toys', price: 399, img: '/images/Gemini_Generated_Image_xd5bcaxd5bcaxd5b.png' },
    { id: 20, category: 'rabbit', name: 'Beds', price: 1299, img: '/images/bGemini_Generated_Image_xd5bcaxd5bcaxd5b.png' },
    { id: 21, category: 'rabbit', name: 'Cage', price: 7999, img: '/images/cGemini_Generated_Image_xd5bcaxd5bcaxd5b.png' },

    // 🐦 BIRD
    { id: 22, category: 'bird', name: 'Food', price: 450, img: '/images/Gemini_Generated_Image_19gho819gho819gh.png' },
    { id: 23, category: 'bird', name: 'Toys', price: 299, img: '/images/tGemini_Generated_Image_19gho819gho819gh.png' },
    { id: 24, category: 'bird', name: 'Cage', price: 5999, img: '/images/cGemini_Generated_Image_19gho819gho819gh.png' },
    { id: 25, category: 'bird', name: 'Accessories', price: 399, img: '/images/aGemini_Generated_Image_19gho819gho819gh.png' },
  ]);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <HeroCarousel onAddToCart={onAddToCart} />

      <main className="container mx-auto px-6 py-16 space-y-24">
        {/* Pet Categories */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-2">Who are you shopping for?</h2>
            <p className="text-zinc-500">Pick a category to find specific items.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {PET_CATEGORIES.map((pet) => (
              <button key={pet.id} className="group relative h-48 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-blue-500 transition-all flex flex-col cursor-pointer">
                <div className="flex-1 relative overflow-hidden">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                </div>
                <div className="p-4 bg-zinc-900">
                  <span className="font-bold text-lg text-white">{pet.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Pets */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Pets</h2>
              <p className="text-zinc-500">View all available pets from the Pets API.</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 h-64 md:h-72">
            <img
              src="/images/e9a15fad-2221-4b54-b7d1-d560a9053d98.jpg"
              alt="Adopt a pet"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16">
              <span className="text-xs uppercase tracking-[0.35em] text-blue-300">Ready to adopt?</span>
              <h3 className="mt-4 text-4xl md:text-5xl font-black text-white">Find your new companion</h3>
              <Link
                to="/pets"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-blue-700"
              >
                Adopt Now
              </Link>
            </div>
          </div>
        </section>

        {/* Products by Category */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white">Shop pet products by Category</h2>
          {PET_CATEGORIES.map((cat) => (
            <div key={cat.id} className="bg-zinc-800 rounded-3xl p-8 border border-zinc-700">
              <div className="flex items-center gap-4 border-l-4 border-blue-600 pl-4 mb-6">
                <h3 className="text-2xl font-bold text-white">For {cat.name}s</h3>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
                {mockCategories
                  .filter(p => p.category === cat.id)
                  .map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={onAddToCart}
                      linkTo={`/products?category=${cat.id}&tag=${encodeURIComponent(prod.name.toLowerCase())}`}
                    />
                  ))
                }
              </div>
            </div>
          ))}
        </section>

        {/* Product Gallery */}
        <section className="bg-zinc-900 rounded-[3rem] p-12 border border-zinc-800">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white">Product Gallery</h2>
              <p className="text-zinc-500">Premium gear selection.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockCategories.slice(0, 3).map(prod => (
              <div key={prod.id} className="flex gap-4 items-center">
                <img src={prod.img} className="w-24 h-24 rounded-2xl object-cover" alt={prod.name} />
                <div>
                  <h4 className="font-bold text-white">{prod.name}</h4>
                  <p className="text-blue-500 font-bold">₹{prod.price.toLocaleString('en-IN')}</p>
                  <button 
                    onClick={() => onAddToCart(prod)}
                    className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full mt-2 hover:bg-blue-600 transition-all"
                  >
                    + Quick Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 pt-20 pb-6 px-6 mt-20">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1.2fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white text-lg">❤️</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Lynx Pet Shop</h1>
                <p className="text-zinc-500 text-sm">Premium care for premium friends, delivered with warmth and trust.</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <span>123 Pet Lane, Mumbai, IN</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                <span>support@lynxpetshop.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-zinc-500 text-sm">
              <li className="cursor-pointer hover:text-white">About Us</li>
              <li className="cursor-pointer hover:text-white">Careers</li>
              <li className="cursor-pointer hover:text-white">Press</li>
              <li className="cursor-pointer hover:text-white">Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-zinc-500 text-sm">
              <li className="cursor-pointer hover:text-white">Help Center</li>
              <li className="cursor-pointer hover:text-white">Shipping Info</li>
              <li className="cursor-pointer hover:text-white">Returns</li>
              <li className="cursor-pointer hover:text-white">Track Order</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-zinc-500 text-sm mb-4">Get pet care tips and special offers delivered to your inbox.</p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input id="footer-email" name="email" type="email" placeholder="Enter your email" className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white text-sm w-full focus:border-blue-500 focus:outline-none" />
              <button type="submit" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">Subscribe</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-300 hover:bg-blue-600 hover:text-white transition" aria-label="Facebook">
                <ExternalLink size={16} />
              </button>
              <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-300 hover:bg-purple-500 hover:text-white transition" aria-label="Instagram">
                <Camera size={16} />
              </button>
              <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-300 hover:bg-sky-500 hover:text-white transition" aria-label="Website">
                <Globe size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-6 text-zinc-500 text-xs sm:text-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Lynx Pet Shop. Built for pet lovers everywhere.</p>
            <div className="flex flex-wrap items-center gap-4 text-zinc-400">
              <span className="hover:text-white cursor-pointer">Terms</span>
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal - triggered by cart button */}
      <CheckoutModal 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cartItems}
        onClearCart={onClearCart}
      />
    </div>
  );
};

export default Home;