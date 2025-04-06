
import { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/utils/web3Auth";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'info';
  timestamp: Date;
  read: boolean;
}

const NotificationsPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Fetch notifications on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      fetchNotifications();
    }
  }, []);

  // Mock function to fetch notifications
  const fetchNotifications = async () => {
    // In a real app, this would make an API call
    // For demo, we'll use mock data
    const mockNotifications: Notification[] = [
      {
        id: "n1",
        title: "Report Verified",
        message: "Your theft report has been verified by 2 other witnesses",
        type: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
      },
      {
        id: "n2",
        title: "New Emergency Report",
        message: "A new emergency has been reported in your area",
        type: "alert",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false
      },
      {
        id: "n3",
        title: "Blockchain Confirmation",
        message: "Your report has been confirmed on the blockchain",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: `n${Date.now()}`,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Also show a toast for realtime notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
    });
  };

  // Function to simulate receiving a new notification (for demo)
  const simulateNewNotification = () => {
    addNotification({
      title: "New Verification",
      message: "Someone has verified one of your reports",
      type: "success"
    });
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info': default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <Card className="absolute right-0 mt-2 w-80 max-h-[450px] overflow-y-auto z-50 animate-in fade-in-0 zoom-in-95">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={markAllAsRead}
                >
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 flex gap-3 ${notification.read ? 'bg-background' : 'bg-muted/30'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <p className="text-muted-foreground text-xs">{notification.message}</p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatTimeAgo(notification.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Demo button to simulate new notification - remove in production */}
          <div className="p-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={simulateNewNotification}
            >
              Simulate New Notification
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPanel;
