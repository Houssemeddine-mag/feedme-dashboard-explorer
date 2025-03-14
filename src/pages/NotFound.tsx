
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-feedme-100 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-feedme-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for can't be found.
        </p>
        <p className="text-gray-500 mb-8">
          The page you are trying to access might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Button asChild className="bg-feedme-500 hover:bg-feedme-600">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
