import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminPets from './admin/AdminPets';
import AdminCategories from './admin/AdminCategories';
import AdminPetTypes from './admin/AdminPetTypes';

const Admin = () => {
  return (
    <Routes>
      <Route path="" element={<AdminDashboard />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="pets" element={<AdminPets />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="pet-types" element={<AdminPetTypes />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default Admin;
