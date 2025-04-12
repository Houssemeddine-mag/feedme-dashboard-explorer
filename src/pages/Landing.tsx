
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ChefHat, Users, UtensilsCrossed, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-feedme-50/30 to-transparent z-0"></div>
        
        <motion.div 
          className="z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-feedme-600 to-feedme-800 mb-6">
            FeedMe
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            The complete restaurant management solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-medium">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-medium">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10"
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2
          }}
        >
          <ArrowDown className="h-8 w-8 text-feedme-500" />
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrollY > 100 ? 1 : 0, y: scrollY > 100 ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            Streamline Your Restaurant Operations
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <ChefHat className="h-12 w-12 text-feedme-500" />, 
                title: "Kitchen Management", 
                description: "Efficiently manage orders with real-time updates between kitchen staff and servers."
              },
              { 
                icon: <Users className="h-12 w-12 text-feedme-500" />, 
                title: "Staff Management", 
                description: "Handle employee scheduling, performance tracking, and role assignments in one place."
              },
              { 
                icon: <UtensilsCrossed className="h-12 w-12 text-feedme-500" />, 
                title: "Menu Planning", 
                description: "Create and update daily menus with automatic inventory tracking and cost calculation."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: scrollY > 200 ? 1 : 0, 
                  y: scrollY > 200 ? 0 : 30 
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollY > 500 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            Trusted by Restaurant Owners
          </motion.h2>
          
          <motion.div 
            className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: scrollY > 600 ? 1 : 0,
              scale: scrollY > 600 ? 1 : 0.9
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <div className="flex text-feedme-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-lg text-gray-700 italic mb-6">
              "FeedMe has transformed how we manage our restaurant. From kitchen operations to staff scheduling, everything is now streamlined in one elegant system."
            </p>
            <div>
              <p className="font-semibold text-gray-800">Marie Laurent</p>
              <p className="text-gray-600">Owner, Le Bistro Parisien</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-feedme-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: scrollY > 900 ? 1 : 0,
              y: scrollY > 900 ? 0 : 30
            }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to elevate your restaurant management?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of restaurant owners who have streamlined their operations with FeedMe.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="font-medium">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-feedme-600 font-medium">
                <Link to="/signup">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold">
                <span className="text-feedme-500">Feed</span>Me
                <span className="ml-1 bg-feedme-500 w-2 h-2 rounded-full inline-block"></span>
              </div>
              <p className="text-gray-400 mt-2">The complete restaurant management solution</p>
            </div>
            <div className="text-center md:text-right text-gray-400">
              <p>© 2023 FeedMe. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
