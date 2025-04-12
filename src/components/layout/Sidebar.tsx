
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Settings,
  User
} from "lucide-react";
import { useState } from "react";
import FeedMeLogo from "../FeedMeLogo";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Restaurants",
    href: "/restaurants",
    icon: Store,
  },
  {
    title: "GRH",
    href: "/grh",
    icon: Users,
  },
  {
    title: "Menu",
    href: "/menu",
    icon: UtensilsCrossed,
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={cn(
        "bg-sidebar h-screen flex flex-col border-r transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center p-4 justify-between">
        {!collapsed && <FeedMeLogo className="w-32" />}
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="space-y-1 px-3 py-4 flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center py-3 px-3 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-feedme-500 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>

      <div className="px-3 pb-4 space-y-1">
        <Link
          to="/settings"
          className={cn(
            "flex items-center py-3 px-3 rounded-md text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-feedme-500 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          )}
        >
          <Settings className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Link
          to="/profile"
          className={cn(
            "flex items-center py-3 px-3 rounded-md text-sm font-medium transition-colors",
            pathname === "/profile"
              ? "bg-feedme-500 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          )}
        >
          <User className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
          {!collapsed && <span>Profile</span>}
        </Link>
      </div>

      <div className="p-4 border-t border-gray-800">
        {!collapsed && (
          <div className="text-xs text-gray-400 font-medium">
            HoussemHouse Admin v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
