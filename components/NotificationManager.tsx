
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Bell, AlertTriangle, Package, TrendingDown, Truck, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  requestPermission: () => Promise<boolean>;
  hasPermission: boolean;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

interface AppNotification {
  id: string;
  type: 'low_stock' | 'critical_stock' | 'delivery' | 'system' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
  read: boolean;
  persistent?: boolean;
}

interface StockAlert {
  product: string;
  currentStock: number;
  threshold: number;
  unit: string;
  location: string;
  trend: 'declining' | 'stable' | 'increasing';
  projectedOutDate?: Date;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Define all functions first before useEffect
  const sendBrowserNotification = (notification: AppNotification) => {
    if (!hasPermission) return;

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.type,
      requireInteraction: notification.priority === 'urgent',
      data: notification.data
    });

    browserNotification.onclick = () => {
      window.focus();
      browserNotification.close();
    };

    if (notification.priority !== 'urgent') {
      setTimeout(() => browserNotification.close(), 5000);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
      case 'critical_stock':
        return <Package className="w-4 h-4" />;
      case 'delivery':
        return <Truck className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getToastFunction = (type: string) => {
    switch (type) {
      case 'critical_stock':
        return toast.error;
      case 'low_stock':
      case 'warning':
        return toast.warning;
      case 'success':
        return toast.success;
      default:
        return toast.info;
    }
  };

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    if (isEnabled && hasPermission && notification.priority !== 'low') {
      sendBrowserNotification(newNotification);
    }

    const icon = getNotificationIcon(notification.type);
    const toastFn = getToastFunction(notification.type);
    
    toastFn(notification.title, {
      description: notification.message,
      icon,
      duration: notification.priority === 'urgent' ? 10000 : 5000,
    });
  }, [isEnabled, hasPermission]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Browser tidak mendukung push notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setHasPermission(granted);
    
    if (granted) {
      toast.success('Push notifications diaktifkan');
    } else {
      toast.error('Push notifications ditolak');
    }
    
    return granted;
  };

  const startStockMonitoring = useCallback(() => {
    const stockAlerts: StockAlert[] = [
      {
        product: 'NPK Premium',
        currentStock: 2.5,
        threshold: 5,
        unit: 'Ton',
        location: 'Gudang Utama',
        trend: 'declining',
        projectedOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        product: 'KCl Import',
        currentStock: 1.2,
        threshold: 3,
        unit: 'Ton',
        location: 'Gudang Cabang',
        trend: 'declining',
        projectedOutDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      }
    ];

    const checkStockLevels = () => {
      stockAlerts.forEach(alert => {
        const stockPercentage = (alert.currentStock / alert.threshold) * 100;

        if (stockPercentage <= 25) {
          addNotification({
            type: 'critical_stock',
            title: 'STOK KRITIS!',
            message: `${alert.product} di ${alert.location} tinggal ${alert.currentStock} ${alert.unit}. Perlu restock segera!`,
            priority: 'urgent',
            data: alert,
            persistent: true
          });
        } else if (stockPercentage <= 50) {
          addNotification({
            type: 'low_stock',
            title: 'Stok Rendah',
            message: `${alert.product} di ${alert.location} tinggal ${alert.currentStock} ${alert.unit}. Pertimbangkan untuk restock.`,
            priority: 'high',
            data: alert
          });
        }
      });
    };

    const updateStock = () => {
      stockAlerts.forEach(alert => {
        if (alert.trend === 'declining') {
          alert.currentStock = Math.max(0, alert.currentStock - (Math.random() * 0.5));
        }
      });
    };

    const stockInterval = setInterval(checkStockLevels, 30000);
    const updateInterval = setInterval(updateStock, 60000);

    return () => {
      clearInterval(stockInterval);
      clearInterval(updateInterval);
    };
  }, [addNotification]);

  const startSystemHealthChecks = useCallback(() => {
    const timeouts: NodeJS.Timeout[] = [];

    timeouts.push(setTimeout(() => {
      addNotification({
        type: 'system',
        title: 'Sistem Berhasil Diperbarui',
        message: 'Dashboard telah diperbarui ke versi terbaru dengan fitur QR scanner terintegrasi.',
        priority: 'low'
      });
    }, 5000));

    timeouts.push(setTimeout(() => {
      addNotification({
        type: 'delivery',
        title: 'Pengiriman Tiba',
        message: 'Truk pengiriman dengan 15 ton Urea telah tiba di gudang. Silakan lakukan penerimaan barang.',
        priority: 'medium'
      });
    }, 15000));

    timeouts.push(setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Transaksi Blockchain Berhasil',
        message: 'Transaksi TXN-20240120-001 telah dikonfirmasi di blockchain. Hash: 0x1a2b3c...',
        priority: 'medium'
      });
    }, 25000));

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [addNotification]);

  useEffect(() => {
    checkNotificationPermission();
    const cleanupStock = startStockMonitoring();
    const cleanupHealth = startSystemHealthChecks();
    
    return () => {
      cleanupStock();
      cleanupHealth();
    };
  }, [startStockMonitoring, startSystemHealthChecks]);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    requestPermission,
    hasPermission,
    isEnabled,
    setEnabled: setIsEnabled
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, removeNotification, clearAll, hasPermission, requestPermission } = useNotifications();

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="w-4 h-4 text-yellow-500" />;
      case 'critical_stock':
        return <Package className="w-4 h-4 text-red-500" />;
      case 'delivery':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    return 'Baru saja';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50">
      <div className="bg-white w-96 h-full shadow-xl">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifikasi</h2>
            <div className="flex items-center gap-2">
              {!hasPermission && (
                <Button size="sm" variant="outline" onClick={requestPermission}>
                  Izinkan Push
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={clearAll}>
                Bersihkan
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-16">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                              {notification.priority}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-400">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StockAlertWidget() {
  const { addNotification } = useNotifications();

  const triggerTestAlert = () => {
    addNotification({
      type: 'critical_stock',
      title: 'STOK KRITIS - TEST',
      message: 'Ini adalah test notifikasi stok kritis. Pupuk NPK Premium tinggal 1.2 ton di Gudang Utama.',
      priority: 'urgent',
      persistent: true
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Test Notifikasi</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={triggerTestAlert} className="w-full">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Trigger Test Alert
        </Button>
      </CardContent>
    </Card>
  );
}
