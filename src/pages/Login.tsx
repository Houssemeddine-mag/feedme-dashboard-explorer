import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import FeedMeLogo from "@/components/FeedMeLogo";
import { UserRole } from "@/types/database";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', email)
        .single();

      if (userError) {
        console.error("Login error:", userError);
        throw new Error("Invalid username or password");
      }

      if (userData && userData.password_hash === password) {
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast({
          title: `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} login successful`,
          description: `Welcome to the ${userData.role} dashboard.`,
        });

        // Redirect based on role
        switch(userData.role as UserRole) {
          case 'admin':
            navigate("/admin");
            break;
          case 'director':
            navigate("/director");
            break;
          case 'chef':
            navigate("/chef");
            break;
          case 'cashier':
            navigate("/cashier");
            break;
          case 'client':
            navigate("/customer");
            break;
          default:
            navigate("/");
        }
        return;
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid username or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/">
            <FeedMeLogo className="w-40" />
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-feedme-500 hover:text-feedme-600"
            >
              create a new account
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Username</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="text"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="#"
                  className="font-medium text-feedme-500 hover:text-feedme-600"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo accounts
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 mb-1 font-medium">Admin Access:</p>
                <p className="text-sm text-gray-600">Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
                <p className="text-sm text-gray-600">Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 mb-1 font-medium">Chef Access:</p>
                <p className="text-sm text-gray-600">Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">chef</span></p>
                <p className="text-sm text-gray-600">Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">chef</span></p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 mb-1 font-medium">Director Access:</p>
                <p className="text-sm text-gray-600">Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">director</span></p>
                <p className="text-sm text-gray-600">Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">director</span></p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 mb-1 font-medium">Cashier Access:</p>
                <p className="text-sm text-gray-600">Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">cashier</span></p>
                <p className="text-sm text-gray-600">Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">cashier</span></p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 mb-1 font-medium">Customer Access:</p>
                <p className="text-sm text-gray-600">Sign up for a new account with the "client" role.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
