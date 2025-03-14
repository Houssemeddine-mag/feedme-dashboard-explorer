
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">FeedMe Dashboard</h3>
            <p className="text-sm text-gray-600">
              Comprehensive restaurant chain management solution for operational excellence.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-feedme-600 hover:underline">Documentation</a></li>
              <li><a href="#" className="text-feedme-600 hover:underline">Support Center</a></li>
              <li><a href="#" className="text-feedme-600 hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Contact Support</h3>
            <p className="text-sm text-gray-600 mb-2">Need help with something?</p>
            <p className="text-sm text-gray-600">support@feedmechain.com</p>
            <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} FeedMe Restaurant Chain. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <p className="text-sm text-gray-600 flex items-center">
              Made with <Heart size={14} className="text-feedme-500 mx-1" /> by FeedMe Tech Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
