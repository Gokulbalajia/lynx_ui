import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, User, LogOut, Heart, Search, Menu, X } from 'lucide-react';

const Header = ({ cartCount }) => {
  const { isAuthenticated, logout, user, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const showUserLinks = isUser && !isAdmin;

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Heart size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Lynx Pet Shop</h1>
        </Link>

        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search for pets, food, or toys..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/products" className="text-zinc-300 hover:text-white transition">Products</Link>
          <Link to="/pets" className="text-zinc-300 hover:text-white transition">Pets</Link>

          {showUserLinks && (
            <>
              <Link to="/orders" className="text-zinc-300 hover:text-white transition">Orders</Link>
              <Link to="/addresses" className="text-zinc-300 hover:text-white transition">Addresses</Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-xs font-bold
                bg-red-600/20 border border-red-500/40 text-red-300
                px-3 py-1.5 rounded-full hover:bg-red-600/30 transition"
            >
              ⚙️ Admin Panel
            </Link>
          )}
        </div>

        {/* Right Side Items */}
        <div className="flex items-center gap-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <User size={20} />
                <span className="hidden sm:inline text-sm text-zinc-200">
                  Hi, {user?.name?.split(' ')[0] || 'there'}
                  {!isAdmin && isUser && (
                    <span className="ml-2 text-[10px] bg-blue-600 text-white
                      px-1.5 py-0.5 rounded-full font-bold">USER</span>
                  )}
                </span>
              </button>
            )}
            <button 
              onClick={() => navigate('/cart')}
              className="p-2 text-zinc-400 hover:text-white transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-zinc-800 pt-4 space-y-3">
          <button 
            onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          >
            <ShoppingCart size={18} />
            <span>Cart ({cartCount})</span>
          </button>
          {isAuthenticated && (
            <button 
              onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            >
              <User size={18} />
              <span>Hi, {user?.name || 'there'}</span>
            </button>
          )}
          {isAuthenticated ? (
            <button 
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <button 
              onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            >
              <span>Login</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;