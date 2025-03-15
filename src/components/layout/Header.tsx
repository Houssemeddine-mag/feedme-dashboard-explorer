
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
  User,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
};

const Header = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Inventory Alert",
      message: "FeedMe Downtown is low on essential ingredients",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: 2,
      title: "Staff Schedule Update",
      message: "New shifts have been published for next week",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      id: 3,
      title: "Sales Milestone",
      message: "FeedMe Business District reached $10K daily sales",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    },
  ]);

  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(currentTime, "HH:mm:ss");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
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
        <div className="flex items-center text-gray-700 font-medium">
          <Clock className="h-5 w-5 mr-1 text-gray-500" />
          <span>{formattedTime}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-feedme-500"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <>
                {notifications.map(notification => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`cursor-pointer ${notification.isRead ? 'bg-gray-50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${notification.isRead ? 'text-gray-600' : ''}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(notification.timestamp, 'HH:mm')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-feedme-600" onClick={markAllAsRead}>
                  Mark all as read
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
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

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {selectedNotification?.timestamp && format(selectedNotification.timestamp, 'PPpp')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>{selectedNotification?.message}</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedNotification(null)}
            >
              Close
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedNotification && deleteNotification(selectedNotification.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
