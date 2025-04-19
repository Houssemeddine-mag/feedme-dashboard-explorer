
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FeedMeLogo from "@/components/FeedMeLogo";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-feedme-50/30 to-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <FeedMeLogo className="w-48 mx-auto" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-feedme-600 to-feedme-800 mb-6">
            Welcome to FeedMe
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Your complete restaurant management solution
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Restaurant Image Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
        >
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
            alt="Restaurant management"
            className="rounded-lg shadow-lg h-48 w-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
            alt="Restaurant tech"
            className="rounded-lg shadow-lg h-48 w-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Restaurant service"
            className="rounded-lg shadow-lg h-48 w-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
