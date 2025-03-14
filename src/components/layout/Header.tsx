
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell,
  CalendarDays,
  LogOut, 
  Settings, 
  User 
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <header className="border-b bg-white py-3 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Restaurant Management Dashboard
        </h1>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-feedme-500"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificationCount > 0 ? (
              <>
                <DropdownMenuItem className="cursor-pointer">
                  <div>
                    <p className="font-medium">Inventory Alert</p>
                    <p className="text-xs text-gray-500">FeedMe Downtown is low on essential ingredients</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div>
                    <p className="font-medium">Staff Schedule Update</p>
                    <p className="text-xs text-gray-500">New shifts have been published for next week</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div>
                    <p className="font-medium">Sales Milestone</p>
                    <p className="text-xs text-gray-500">FeedMe Business District reached $10K daily sales</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-feedme-600" onClick={clearNotifications}>
                  Mark all as read
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-feedme-500 text-white">JD</AvatarFallback>
              </Avatar>
              <div className="text-sm text-left hidden sm:block">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Admin Manager</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
