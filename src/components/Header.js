import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, User, LogOut, LogIn, Heart, Search, Menu, X, Package, MapPin, Settings, PawPrint, Store } from 'lucide-react';

const Header = ({ cartCount }) => {
  const { isAuthenticated, logout, user, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const showUserLinks = isUser && !isAdmin;
  const menuRef = useRef(null);
  const welcomeRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (welcomeRef.current && !welcomeRef.current.contains(event.target)) {
        setWelcomeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
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
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Right Side - Unified Menu */}
        <div className="relative flex items-center gap-4" ref={menuRef}>
          {isAuthenticated && user ? (
            <div className="relative hidden sm:block" ref={welcomeRef}>
              <button 
                onClick={() => setWelcomeOpen(!welcomeOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <User size={18} />
              </button>
              
              {welcomeOpen && (
                <div className="absolute top-full right-0 mt-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl px-5 py-3 z-50 whitespace-nowrap min-w-max transform origin-top-right transition-all">
                  <p className="text-sm text-zinc-400">
                    Welcome, <span className="font-bold text-white text-base ml-1">{user?.name || 'User'}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => handleNavigation('/login')}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Login / Sign Up"
            >
              <User size={18} />
            </button>
          )}
          
          <button 
            className={`p-2 transition border rounded-lg flex items-center gap-2 ${
              menuOpen 
                ? 'bg-zinc-800 border-zinc-700 text-white' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-3 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 flex flex-col z-50 overflow-hidden transform origin-top-right transition-all">
              {isAuthenticated && (
                <div className="px-4 py-3 border-b border-zinc-800 mb-2 bg-zinc-900/50">
                  <p className="text-xs text-zinc-500 font-medium mb-0.5">Welcome,</p>
                  <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                  {isAdmin && <span className="inline-block mt-1 text-[10px] bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full font-bold">ADMIN</span>}
                  {showUserLinks && <span className="inline-block mt-1 text-[10px] bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full font-bold">USER</span>}
                </div>
              )}

              <button onClick={() => handleNavigation('/products')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                <Store size={18} className="text-zinc-400" /> Products
              </button>
              <button onClick={() => handleNavigation('/pets')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                <PawPrint size={18} className="text-zinc-400" /> Pets
              </button>

              {showUserLinks && (
                <>
                  <button onClick={() => handleNavigation('/orders')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition border-t border-zinc-800/50 mt-1 pt-2">
                    <Package size={18} className="text-zinc-400" /> Orders
                  </button>
                  <button onClick={() => handleNavigation('/addresses')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                    <MapPin size={18} className="text-zinc-400" /> Addresses
                  </button>
                </>
              )}

              {isAdmin && (
                <button onClick={() => handleNavigation('/admin')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition border-t border-zinc-800/50 mt-1 pt-2">
                  <Settings size={18} /> Admin Panel
                </button>
              )}

              {isAuthenticated && (
                <button onClick={() => handleNavigation('/profile')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition border-t border-zinc-800/50 mt-1 pt-2">
                  <User size={18} className="text-zinc-400" /> Profile
                </button>
              )}

              {!isAdmin && (
                <button onClick={() => handleNavigation('/cart')} className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition">
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={18} className="text-zinc-400" /> Cart
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition border-t border-zinc-800/50 mt-1 pt-2">
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <button onClick={() => handleNavigation('/login')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition border-t border-zinc-800/50 mt-1 pt-2">
                  <User size={18} className="text-zinc-400" /> Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;