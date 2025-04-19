
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Main layouts and components
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import GRH from "@/pages/GRH";
import Director from "@/pages/Director";
import Chef from "@/pages/Chef";
import Cashier from "@/pages/Cashier";
import Customer from "@/pages/Customer";
import Restaurants from "@/pages/Restaurants";
import Menu from "@/pages/Menu";
import NotFound from "@/pages/NotFound";
import Landing from "@/pages/Landing";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import "./App.css";

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const { user } = useAuth();
  
  if (!user) {
    // Redirect to login if no user
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'director':
        return <Navigate to="/director" replace />;
      case 'chef':
        return <Navigate to="/chef" replace />;
      case 'cashier':
        return <Navigate to="/cashier" replace />;
      case 'client':
        return <Navigate to="/customer" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/grh" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <GRH />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/restaurants" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <Restaurants />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/menu" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <Menu />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Role-specific routes */}
          <Route path="/director" element={
            <ProtectedRoute requiredRole="director">
              <Director />
            </ProtectedRoute>
          } />
          <Route path="/chef" element={
            <ProtectedRoute requiredRole="chef">
              <Chef />
            </ProtectedRoute>
          } />
          <Route path="/cashier" element={
            <ProtectedRoute requiredRole="cashier">
              <Cashier />
            </ProtectedRoute>
          } />
          <Route path="/customer" element={
            <ProtectedRoute requiredRole="client">
              <Customer />
            </ProtectedRoute>
          } />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
