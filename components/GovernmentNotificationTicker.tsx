import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  MapPin, 
  FileText, 
  Users, 
  Package, 
  Clock,
  X,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';

interface GovernmentNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'policy' | 'achievement';
  title: string;
  message: string;
  location?: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'stock' | 'distribution' | 'policy' | 'compliance' | 'system';
  isRead: boolean;
  actionRequired?: boolean;
}

const mockGovernmentNotifications: GovernmentNotification[] = [
  {
    id: 'gov-001',
    type: 'critical',
    title: 'Stok Pupuk Kritis di Sulawesi Tengah',
    message: 'Stok pupuk urea di 5 kabupaten Sulawesi Tengah mencapai level kritis < 10%. Diperlukan tindakan segera.',
    location: 'Sulawesi Tengah',
    timestamp: new Date(),
    priority: 'high',
    category: 'stock',
    isRead: false,
    actionRequired: true
  },
  {
    id: 'gov-002',
    type: 'policy',
    title: 'Perubahan Regulasi Subsidi Pupuk 2024',
    message: 'Permen Pertanian No. 15/2024 tentang penyesuaian besaran subsidi pupuk telah diterbitkan dan berlaku mulai 1 Februari 2024.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    priority: 'high',
    category: 'policy',
    isRead: false,
    actionRequired: true
  },
  {
    id: 'gov-003',
    type: 'warning',
    title: 'Keterlambatan Distribusi di Jawa Timur',
    message: 'Distribusi pupuk ke 12 kecamatan di Jawa Timur mengalami keterlambatan 3 hari dari jadwal. Sedang dilakukan koordinasi dengan distributor.',
    location: 'Jawa Timur',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    priority: 'medium',
    category: 'distribution',
    isRead: false,
    actionRequired: false
  },
  {
    id: 'gov-004',
    type: 'achievement',
    title: 'Target Penyaluran Q1 2024 Tercapai 105%',
    message: 'Penyaluran pupuk bersubsidi Q1 2024 mencapai 105% dari target nasional. Apresiasi untuk seluruh tim koordinasi.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    priority: 'medium',
    category: 'system',
    isRead: false,
    actionRequired: false
  },
  {
    id: 'gov-005',
    type: 'info',
    title: 'Pembaruan Sistem Monitoring Real-time',
    message: 'Sistem monitoring pupuk nasional telah diperbarui dengan fitur tracking real-time dan dashboard prediktif AI.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    priority: 'low',
    category: 'system',
    isRead: false,
    actionRequired: false
  },
  {
    id: 'gov-006',
    type: 'warning',
    title: 'Anomali Pola Distribusi Terdeteksi',
    message: 'AI mendeteksi pola distribusi yang tidak biasa di 3 provinsi. Tim audit diminta untuk melakukan investigasi.',
    location: 'Multi Provinsi',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    priority: 'high',
    category: 'compliance',
    isRead: false,
    actionRequired: true
  },
  {
    id: 'gov-007',
    type: 'critical',
    title: 'Gangguan Sistem di Data Center Jakarta',
    message: 'Gangguan jaringan menyebabkan delay update data real-time. Tim IT sedang melakukan perbaikan darurat.',
    location: 'Jakarta',
    timestamp: new Date(Date.now() - 1000 * 60 * 150),
    priority: 'high',
    category: 'system',
    isRead: false,
    actionRequired: true
  }
];

export function GovernmentNotificationTicker() {
  const [notifications, setNotifications] = useState<GovernmentNotification[]>(mockGovernmentNotifications);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 4000); // Change notification every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, notifications.length]);

  // Simulate new notifications
  useEffect(() => {
    const addNewNotification = () => {
      const newNotifications = [
        {
          id: `gov-${Date.now()}`,
          type: 'info' as const,
          title: 'Update Stok Real-time',
          message: 'Data stok pupuk nasional telah diperbarui. Total stok tersedia: 9.8 juta ton.',
          timestamp: new Date(),
          priority: 'low' as const,
          category: 'stock' as const,
          isRead: false,
          actionRequired: false
        },
        {
          id: `gov-${Date.now() + 1}`,
          type: 'warning' as const,
          title: 'Cuaca Ekstrem Berpotensi Mengganggu Distribusi',
          message: 'BMKG memprediksi hujan lebat di wilayah Sumatra dalam 48 jam ke depan. Persiapkan mitigasi distribusi.',
          location: 'Sumatra',
          timestamp: new Date(),
          priority: 'medium' as const,
          category: 'distribution' as const,
          isRead: false,
          actionRequired: true
        }
      ];

      setNotifications(prev => [
        newNotifications[Math.floor(Math.random() * newNotifications.length)],
        ...prev.slice(0, 10) // Keep only latest 10 notifications
      ]);
    };

    const interval = setInterval(addNewNotification, 30000); // Add new notification every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'policy': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'achievement': return <TrendingUp className="w-5 h-5 text-green-600" />;
      default: return <Package className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'border-l-red-500 bg-red-50';
    }
    switch (type) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'policy': return 'border-l-blue-500 bg-blue-50';
      case 'achievement': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const currentNotification = notifications[currentIndex];
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Notifikasi Pemerintah Live</span>
          </div>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="bg-red-500">
              {criticalCount} Kritis
            </Badge>
          )}
          {actionRequiredCount > 0 && (
            <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">
              {actionRequiredCount} Perlu Tindakan
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <span className="text-sm opacity-75">
            {currentIndex + 1} / {notifications.length}
          </span>
        </div>
      </div>

      {/* Current Notification Display */}
      {currentNotification && (
        <Card className={`border-l-4 ${getNotificationColor(currentNotification.type, currentNotification.priority)} transition-all duration-500`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getNotificationIcon(currentNotification.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{currentNotification.title}</h4>
                    {currentNotification.location && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {currentNotification.location}
                      </Badge>
                    )}
                    {currentNotification.actionRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Perlu Tindakan
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {currentNotification.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {currentNotification.timestamp.toLocaleTimeString('id-ID')}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {currentNotification.category}
                    </Badge>
                    <Badge 
                      variant={currentNotification.priority === 'high' ? 'destructive' : 'outline'} 
                      className="text-xs"
                    >
                      {currentNotification.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {!currentNotification.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(currentNotification.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismiss(currentNotification.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-blue-600 h-1 rounded-full transition-all duration-100 ease-linear"
          style={{ 
            width: isPlaying ? `${((currentIndex + 1) / notifications.length) * 100}%` : `${((currentIndex + 1) / notifications.length) * 100}%`
          }}
        ></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {notifications.filter(n => n.type === 'critical').length}
          </div>
          <div className="text-xs text-red-700">Kritis</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {notifications.filter(n => n.type === 'warning').length}
          </div>
          <div className="text-xs text-yellow-700">Peringatan</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {notifications.filter(n => n.actionRequired).length}
          </div>
          <div className="text-xs text-blue-700">Perlu Tindakan</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {notifications.filter(n => n.type === 'achievement').length}
          </div>
          <div className="text-xs text-green-700">Prestasi</div>
        </div>
      </div>
    </div>
  );
}