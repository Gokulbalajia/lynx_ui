import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import Addresses from './pages/Addresses';
import OrderDetailPage from './pages/OrderDetailPage';
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

function AppRoutes() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios.get('/').catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) {
      setCartItems([]);
      return;
    }

    const loadServerCart = async () => {
      try {
        const response = await axios.get('/cart/');
        if (Array.isArray(response.data)) {
          const serverItems = response.data.map((entry) => {
            const itemType = entry.item_type || (entry.pet_id ? 'pet' : 'product');
            return {
              item_type: itemType,
              id: entry.pet_id || entry.product_id || entry.product_variant_id || entry.id,
              cart_item_id: entry.id,
              name:
                entry.product?.name || entry.pet?.name || entry.name ||
                (itemType === 'pet' ? 'Pet item' : 'Product item'),
              img:
                entry.product_variant?.images?.[0]?.image_url ||
                entry.pet?.images?.[0]?.image_url ||
                entry.image_url ||
                '',
              price: parseFloat(entry.price || entry.product_variant?.price || entry.pet?.price || 0),
              quantity: entry.quantity || 1,
              category: entry.product?.category || entry.pet?.pet_type?.name || entry.category || '',
            };
          });
          setCartItems(serverItems);
        }
      } catch (error) {
        console.error('Unable to restore cart from server', error.response?.data || error);
      }
    };

    loadServerCart();
  }, [token]);

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

  const handleRemoveFromCart = async (itemId, itemType) => {
    const itemToRemove = cartItems.find((item) => (item.id === itemId || item.cart_item_id === itemId) && item.item_type === itemType);
    if (itemToRemove?.cart_item_id) {
      try {
        await axios.delete(`/cart/${itemToRemove.cart_item_id}`);
      } catch (error) {
        console.error('Failed to remove item from cart API:', error);
      }
    }
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => !(
          (item.id === itemId || item.cart_item_id === itemId) && item.item_type === itemType
        )
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateCartQuantity = async (itemId, itemType, quantity) => {
    const itemToUpdate = cartItems.find((item) => (item.id === itemId || item.cart_item_id === itemId) && item.item_type === itemType);
    const newQuantity = Math.max(0, quantity);

    // Update local state optimistically
    setCartItems((currentItems) => {
      const updatedItems = currentItems.map((item) => {
        if ((item.id === itemId || item.cart_item_id === itemId) && item.item_type === itemType) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedItems.filter((item) => item.quantity > 0);
    });

    if (itemToUpdate?.cart_item_id) {
      try {
        if (newQuantity <= 0) {
          await axios.delete(`/cart/${itemToUpdate.cart_item_id}`);
        } else {
          await axios.put(`/cart/${itemToUpdate.cart_item_id}`, { quantity: newQuantity });
        }
      } catch (error) {
        console.error('Failed to update cart quantity API:', error);
      }
    }
  };

  return (
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
            <Route path="/cart" element={<Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateCartQuantity} />} />
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
            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <OrderDetailPage />
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
                <Addresses />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
