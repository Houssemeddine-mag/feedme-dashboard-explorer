
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chef from "./pages/Chef";
import Director from "./pages/Director";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import GRH from "./pages/GRH";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Emails from "./pages/Emails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Chef route (no header/footer) */}
          <Route path="/chef" element={<Chef />} />
          
          {/* Director route (custom layout) */}
          <Route path="/director" element={<Director />} />
          
          {/* Admin routes with MainLayout */}
          <Route path="/admin" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/restaurants" element={<MainLayout><Restaurants /></MainLayout>} />
          <Route path="/grh" element={<MainLayout><GRH /></MainLayout>} />
          <Route path="/menu" element={<MainLayout><Menu /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/emails/:id?" element={<MainLayout><Emails /></MainLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
