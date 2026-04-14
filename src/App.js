import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PetsPage from './pages/PetsPage';
import PetDetailPage from './pages/PetDetailPage';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex((item) => item.id === product.id && item.item_type === product.item_type);
      if (existingIndex >= 0) {
        const updatedItems = [...currentItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: (updatedItems[existingIndex].quantity || 1) + 1,
        };
        return updatedItems;
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId, itemType) => {
    setCartItems((currentItems) => currentItems.filter((item) => !(item.id === itemId && item.item_type === itemType)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App bg-black text-zinc-100 min-h-screen">
          <Header cartCount={cartItems.length} />
          <main>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    cartItems={cartItems}
                    onAddToCart={handleAddToCart}
                    onClearCart={handleClearCart}
                  />
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout cartItems={cartItems} onClearCart={handleClearCart} />
                </ProtectedRoute>
              } />
              <Route path="/products" element={<ProductsPage onAddToCart={handleAddToCart} />} />
              <Route path="/products/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} />} />
              <Route path="/pets" element={<PetsPage onAddToCart={handleAddToCart} />} />
              <Route path="/pets/:id" element={<PetDetailPage onAddToCart={handleAddToCart} />} />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
              <Route path="/addresses" element={
                <ProtectedRoute>
                  <Checkout cartItems={cartItems} onClearCart={handleClearCart} />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
