import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  MapPin, 
  FileText, 
  Users, 
  Package, 
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  Award,
  Eye,
  Trash2,
  Archive,
  Bell,
  BellRing
} from 'lucide-react';

interface DetailedNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'policy' | 'achievement';
  title: string;
  message: string;
  description?: string;
  location?: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'stock' | 'distribution' | 'policy' | 'compliance' | 'system' | 'weather' | 'security';
  isRead: boolean;
  actionRequired?: boolean;
  assignedTo?: string;
  relatedData?: {
    affectedRegions?: string[];
    stockLevels?: { [key: string]: number };
    distributionData?: any;
  };
  actions?: {
    label: string;
    type: 'primary' | 'secondary' | 'danger';
    callback: () => void;
  }[];
}

const mockDetailedNotifications: DetailedNotification[] = [
  {
    id: 'gov-det-001',
    type: 'critical',
    title: 'Stok Pupuk Urea Hampir Habis - Sulawesi Tengah',
    message: 'Stok pupuk urea di 5 kabupaten Sulawesi Tengah mencapai level kritis < 5%. Diperlukan tindakan darurat.',
    description: 'Berdasarkan laporan real-time dari sistem monitoring, stok pupuk urea di Kabupaten Poso, Tojo Una-Una, Morowali, Banggai, dan Tolitoli telah mencapai level kritis. Diperkirakan stok akan habis dalam 3-5 hari jika tidak ada pasokan segera.',
    location: 'Sulawesi Tengah',
    timestamp: new Date(),
    priority: 'high',
    category: 'stock',
    isRead: false,
    actionRequired: true,
    assignedTo: 'Tim Logistik Wilayah Sulawesi',
    relatedData: {
      affectedRegions: ['Poso', 'Tojo Una-Una', 'Morowali', 'Banggai', 'Tolitoli'],
      stockLevels: {
        'Poso': 2.3,
        'Tojo Una-Una': 1.8,
        'Morowali': 3.1,
        'Banggai': 2.7,
        'Tolitoli': 1.9
      }
    },
    actions: [
      { label: 'Koordinasi Distributor', type: 'primary', callback: () => {} },
      { label: 'Lapor ke Pusat', type: 'secondary', callback: () => {} },
      { label: 'Buat Laporan Darurat', type: 'danger', callback: () => {} }
    ]
  },
  {
    id: 'gov-det-002',
    type: 'policy',
    title: 'Implementasi Peraturan Menteri Pertanian No. 15/2024',
    message: 'Peraturan baru tentang penyesuaian mekanisme subsidi pupuk akan berlaku efektif mulai 1 Februari 2024.',
    description: 'Permen Pertanian No. 15/2024 mengatur: 1) Penyesuaian besaran subsidi pupuk berdasarkan indeks harga global, 2) Mekanisme distribusi langsung ke petani melalui e-RDKK, 3) Sistem monitoring dan evaluasi berbasis digital, 4) Sanksi bagi pelanggaran distribusi.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    priority: 'high',
    category: 'policy',
    isRead: false,
    actionRequired: true,
    assignedTo: 'Semua Dinas Pertanian Provinsi',
    actions: [
      { label: 'Sosialisasi Aturan', type: 'primary', callback: () => {} },
      { label: 'Update SOP', type: 'secondary', callback: () => {} }
    ]
  },
  {
    id: 'gov-det-003',
    type: 'warning',
    title: 'Prediksi Cuaca Ekstrem - Potensi Gangguan Distribusi',
    message: 'BMKG memprediksi hujan lebat disertai angin kencang di wilayah Jawa Barat dalam 48 jam ke depan.',
    description: 'Berdasarkan analisis cuaca BMKG, akan terjadi cuaca ekstrem dengan intensitas hujan 50-100mm/hari disertai angin kencang 25-35 km/jam. Kondisi ini berpotensi mengganggu jalur distribusi utama pupuk ke wilayah Jawa Barat bagian selatan.',
    location: 'Jawa Barat',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    priority: 'medium',
    category: 'weather',
    isRead: false,
    actionRequired: true,
    assignedTo: 'Koordinator Distribusi Jabar',
    relatedData: {
      affectedRegions: ['Sukabumi', 'Cianjur', 'Bandung', 'Garut', 'Tasikmalaya']
    },
    actions: [
      { label: 'Koordinasi Jalur Alternatif', type: 'primary', callback: () => {} },
      { label: 'Siaga Darurat', type: 'secondary', callback: () => {} }
    ]
  },
  {
    id: 'gov-det-004',
    type: 'achievement',
    title: 'Pencapaian Luar Biasa - Target Q1 2024 Terlampaui',
    message: 'Penyaluran pupuk bersubsidi Q1 2024 mencapai 110% dari target nasional dengan efisiensi distribusi meningkat 15%.',
    description: 'Capaian luar biasa di Q1 2024: Total penyaluran 2.75 juta ton (target 2.5 juta ton), efisiensi distribusi naik 15%, tingkat kepuasan petani 94%, dan pengurangan waktu tunggu distribusi hingga 40%. Apresiasi khusus untuk tim koordinasi nasional.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    priority: 'medium',
    category: 'system',
    isRead: false,
    actionRequired: false,
    relatedData: {
      affectedRegions: ['Seluruh Indonesia']
    }
  },
  {
    id: 'gov-det-005',
    type: 'info',
    title: 'Update Sistem Monitoring Nasional v2.1',
    message: 'Sistem monitoring pupuk nasional telah diperbarui dengan fitur AI prediktif dan dashboard real-time yang lebih responsif.',
    description: 'Pembaruan sistem meliputi: 1) AI engine untuk prediksi kebutuhan pupuk, 2) Dashboard real-time dengan latency < 5 detik, 3) Integrasi blockchain untuk tracking, 4) Mobile app untuk petugas lapangan, 5) Automated reporting system.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    priority: 'low',
    category: 'system',
    isRead: false,
    actionRequired: false,
    actions: [
      { label: 'Lihat Panduan', type: 'primary', callback: () => {} },
      { label: 'Training Online', type: 'secondary', callback: () => {} }
    ]
  },
  {
    id: 'gov-det-006',
    type: 'warning',
    title: 'Anomali Pola Distribusi Terdeteksi AI',
    message: 'Sistem AI mendeteksi pola distribusi tidak normal di 3 provinsi yang memerlukan investigasi lebih lanjut.',
    description: 'AI mendeteksi anomali: 1) Volume distribusi tidak sesuai data RDKK di Kalimantan Selatan, 2) Frekuensi pengambilan pupuk berlebihan di beberapa kios Sumatra Utara, 3) Ketidaksesuaian waktu distribusi dengan pola normal di Nusa Tenggara Barat.',
    location: 'Multi Provinsi',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    priority: 'high',
    category: 'compliance',
    isRead: false,
    actionRequired: true,
    assignedTo: 'Tim Audit Internal',
    relatedData: {
      affectedRegions: ['Kalimantan Selatan', 'Sumatra Utara', 'Nusa Tenggara Barat']
    },
    actions: [
      { label: 'Mulai Investigasi', type: 'danger', callback: () => {} },
      { label: 'Suspend Distribusi', type: 'secondary', callback: () => {} }
    ]
  }
];

export function GovernmentNotificationCenter() {
  const [notifications, setNotifications] = useState<DetailedNotification[]>(mockDetailedNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    
    if (selectedTab === 'unread') return matchesSearch && matchesType && matchesPriority && !notification.isRead;
    if (selectedTab === 'action-required') return matchesSearch && matchesType && matchesPriority && notification.actionRequired;
    if (selectedTab === 'critical') return matchesSearch && matchesType && matchesPriority && notification.type === 'critical';
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'policy': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'achievement': return <Award className="w-5 h-5 text-green-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBorder = (type: string, priority: string) => {
    if (priority === 'high') return 'border-l-red-500';
    switch (type) {
      case 'critical': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'policy': return 'border-l-blue-500';
      case 'achievement': return 'border-l-green-500';
      case 'info': return 'border-l-blue-400';
      default: return 'border-l-gray-400';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.isRead).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pusat Notifikasi Pemerintah</h1>
          <p className="text-muted-foreground">
            Monitor dan kelola semua notifikasi sistem pupuk nasional
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-sm">
            <BellRing className="w-4 h-4 mr-1" />
            {unreadCount} Belum dibaca
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari notifikasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="critical">Kritis</SelectItem>
            <SelectItem value="warning">Peringatan</SelectItem>
            <SelectItem value="policy">Kebijakan</SelectItem>
            <SelectItem value="achievement">Prestasi</SelectItem>
            <SelectItem value="info">Informasi</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prioritas</SelectItem>
            <SelectItem value="high">Tinggi</SelectItem>
            <SelectItem value="medium">Sedang</SelectItem>
            <SelectItem value="low">Rendah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Semua ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Belum dibaca ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="action-required">
            Perlu Tindakan ({actionRequiredCount})
          </TabsTrigger>
          <TabsTrigger value="critical">
            Kritis ({criticalCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${getNotificationBorder(notification.type, notification.priority)} ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>

                        {notification.description && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm">{notification.description}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.timestamp.toLocaleString('id-ID')}
                          </Badge>
                          {notification.location && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {notification.location}
                            </Badge>
                          )}
                          <Badge 
                            variant={notification.priority === 'high' ? 'destructive' : 'secondary'} 
                            className="text-xs"
                          >
                            {notification.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {notification.category}
                          </Badge>
                          {notification.actionRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Perlu Tindakan
                            </Badge>
                          )}
                        </div>

                        {notification.assignedTo && (
                          <div className="text-xs text-muted-foreground mb-3">
                            <Users className="w-3 h-3 inline mr-1" />
                            Ditugaskan ke: {notification.assignedTo}
                          </div>
                        )}

                        {notification.relatedData?.affectedRegions && (
                          <div className="mb-3">
                            <p className="text-xs font-medium mb-1">Wilayah Terdampak:</p>
                            <div className="flex flex-wrap gap-1">
                              {notification.relatedData.affectedRegions.map((region, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {region}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {notification.actions && (
                          <div className="flex flex-wrap gap-2">
                            {notification.actions.map((action, index) => (
                              <Button 
                                key={index}
                                size="sm" 
                                variant={action.type === 'primary' ? 'default' : action.type === 'danger' ? 'destructive' : 'outline'}
                                onClick={action.callback}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Tidak ada notifikasi</h3>
                  <p className="text-muted-foreground">Tidak ada notifikasi yang sesuai dengan filter yang dipilih.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}