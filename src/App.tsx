/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BusinessSetup from "./pages/BusinessSetup";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import NewInvoice from "./pages/NewInvoice";
import InvoiceDetail from "./pages/InvoiceDetail";
import DashboardLayout from "./components/layout/DashboardLayout";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  
  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center font-sans">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

function BusinessRequiredRoute({ children }: { children: React.ReactNode }) {
  const { business, isLoading } = useAuth();
  
  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center font-sans">Loading...</div>;
  if (!business) return <Navigate to="/setup-business" />;
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="setup-business" element={<BusinessSetup />} />
        
        <Route path="dashboard" element={
          <BusinessRequiredRoute>
            <Dashboard />
          </BusinessRequiredRoute>
        } />
        
        <Route path="products" element={
          <BusinessRequiredRoute>
            <Products />
          </BusinessRequiredRoute>
        } />
        
        <Route path="invoices" element={
          <BusinessRequiredRoute>
            <Invoices />
          </BusinessRequiredRoute>
        } />
        
        <Route path="invoices/new" element={
          <BusinessRequiredRoute>
            <NewInvoice />
          </BusinessRequiredRoute>
        } />

        <Route path="invoices/:id" element={
          <BusinessRequiredRoute>
            <InvoiceDetail />
          </BusinessRequiredRoute>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
