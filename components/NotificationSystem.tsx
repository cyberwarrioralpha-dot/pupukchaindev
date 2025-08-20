import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Truck,
  UserCheck,
  X,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: 'stock' | 'distribution' | 'verification' | 'system';
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Stok Pupuk Menipis',
    message: 'Stok pupuk NPK di gudang Surabaya tersisa 15% (750 ton dari target 5000 ton)',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false,
    category: 'stock',
    priority: 'high',
    actionUrl: '/stok'
  },
  {
    id: '2',
    type: 'success',
    title: 'Distribusi Selesai',
    message: 'Pengiriman 500 ton pupuk urea ke Jawa Timur telah selesai',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    category: 'distribution',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'info',
    title: 'Kios Baru Mendaftar',
    message: '15 kios tani baru mendaftar dan menunggu verifikasi',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true,
    category: 'verification',
    priority: 'medium',
    actionUrl: '/verifikasi'
  },
  {
    id: '4',
    type: 'error',
    title: 'Gangguan Sistem',
    message: 'Terjadi gangguan konektivitas pada gudang Medan, data mungkin tertunda',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isRead: true,
    category: 'system',
    priority: 'high'
  },
  {
    id: '5',
    type: 'warning',
    title: 'Keterlambatan Distribusi',
    message: 'Pengiriman ke Kalimantan Selatan mengalami keterlambatan 2 hari',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isRead: false,
    category: 'distribution',
    priority: 'medium'
  }
];

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationSystem({ isOpen, onClose, onNotificationClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notification every 30 seconds for demo
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'warning' : 'info',
          title: 'Update Real-time',
          message: 'Pembaruan status stok otomatis dari sistem monitoring',
          timestamp: new Date(),
          isRead: false,
          category: 'stock',
          priority: 'low'
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep only 20 latest

        // Show toast for high priority notifications
        if (newNotification.priority === 'high' && soundEnabled) {
          toast.warning(newNotification.title, {
            description: newNotification.message,
          });
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const getNotificationIcon = (type: string, category: string) => {
    if (type === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (type === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (type === 'error') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    
    switch (category) {
      case 'stock':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'distribution':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'verification':
        return <UserCheck className="h-4 w-4 text-cyan-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Tinggi</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Sedang</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Rendah</Badge>;
      default:
        return null;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'high') return notification.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-16 pr-4">
      <Card className="w-96 max-h-[80vh] shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifikasi</CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-red-500">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="h-8 w-8"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <CardDescription>
            Monitor peringatan dan update sistem real-time
          </CardDescription>

          {/* Filter Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Semua
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Belum Dibaca ({unreadCount})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              Prioritas Tinggi
            </Button>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Tandai Semua Sebagai Dibaca
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-1 p-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tidak ada notifikasi</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-background'
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      onNotificationClick?.(notification);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type, notification.category)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <div className="flex items-center space-x-1">
                            {getPriorityBadge(notification.priority)}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Real-time notification hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter(n => !n.isRead).length
  );

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    addNotification
  };
}