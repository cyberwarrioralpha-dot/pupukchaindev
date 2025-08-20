import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Factory, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Zap,
  Activity,
  BarChart3,
  Settings,
  QrCode,
  Truck,
  Shield,
  Eye,
  RefreshCw,
  Download,
  Bell
} from 'lucide-react';

const productionData = [
  { month: 'Jan', production: 45000, target: 42000, efficiency: 107 },
  { month: 'Feb', production: 48000, target: 45000, efficiency: 107 },
  { month: 'Mar', production: 52000, target: 48000, efficiency: 108 },
  { month: 'Apr', production: 49000, target: 50000, efficiency: 98 },
  { month: 'Mei', production: 55000, target: 52000, efficiency: 106 },
  { month: 'Jun', production: 58000, target: 55000, efficiency: 105 }
];

const qualityData = [
  { category: 'Grade A', value: 75, color: '#10b981' },
  { category: 'Grade B', value: 20, color: '#f59e0b' },
  { category: 'Grade C', value: 4, color: '#ef4444' },
  { category: 'Reject', value: 1, color: '#6b7280' }
];

const equipmentData = [
  { name: 'Line Produksi 1', status: 'active', efficiency: 95, maintenance: 'Due in 5 days' },
  { name: 'Line Produksi 2', status: 'active', efficiency: 92, maintenance: 'OK' },
  { name: 'Line Produksi 3', status: 'maintenance', efficiency: 0, maintenance: 'In Progress' },
  { name: 'Line Produksi 4', status: 'active', efficiency: 88, maintenance: 'OK' }
];

const recentBatches = [
  { id: 'BTH-2024-001', product: 'Urea 46%', quantity: 25000, quality: 'A', status: 'completed', date: '2024-07-15' },
  { id: 'BTH-2024-002', product: 'NPK 15-15-15', quantity: 18000, quality: 'A', status: 'completed', date: '2024-07-15' },
  { id: 'BTH-2024-003', product: 'ZA 21%', quantity: 22000, quality: 'B', status: 'in_progress', date: '2024-07-15' },
  { id: 'BTH-2024-004', product: 'SP-36', quantity: 15000, quality: 'A', status: 'scheduled', date: '2024-07-16' }
];

export function ProductionDashboard() {
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('production');

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-yellow-500';
      case 'C': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getBatchStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'scheduled': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Produksi</h1>
          <p className="text-muted-foreground">
            Monitor dan kelola operasional produksi pupuk secara real-time
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Live Update - Terakhir: {refreshTime.toLocaleTimeString('id-ID')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="relative">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
            <Badge className="absolute -top-2 -right-2 px-1 min-w-0 h-5 text-xs bg-red-500">
              3
            </Badge>
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produksi Hari Ini</p>
                <p className="text-2xl font-bold text-blue-600">1,250 Ton</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 1,200 ton</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Factory className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+4.2% vs target</span>
            </div>
            <Progress value={104.2} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efisiensi Operasional</p>
                <p className="text-2xl font-bold text-green-600">94.7%</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 92%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+2.7% dari target</span>
            </div>
            <Progress value={94.7} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quality Pass Rate</p>
                <p className="text-2xl font-bold text-purple-600">98.3%</p>
                <p className="text-xs text-muted-foreground mt-1">Grade A + B</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">Standar industri</span>
            </div>
            <Progress value={98.3} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Equipment Uptime</p>
                <p className="text-2xl font-bold text-orange-600">91.2%</p>
                <p className="text-xs text-muted-foreground mt-1">3/4 lines active</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
              <span className="text-yellow-600">Line 3 maintenance</span>
            </div>
            <Progress value={91.2} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tren Produksi Bulanan</span>
              <Badge variant="outline">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${(value as number).toLocaleString()} ton`, 
                    name === 'production' ? 'Produksi' : 'Target'
                  ]}
                />
                <Line type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={3} name="production" />
                <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kualitas Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={qualityData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.category}: ${entry.value}%`}
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Persentase']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Status Equipment Produksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipmentData.map((equipment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{equipment.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(equipment.status)}`}></div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efisiensi</span>
                      <span className="font-bold">{equipment.efficiency}%</span>
                    </div>
                    <Progress value={equipment.efficiency} className="h-2" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Maintenance: {equipment.maintenance}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      Monitor
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="w-3 h-3 mr-1" />
                      Control
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Batch Produksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBatches.map((batch, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{batch.id}</h4>
                    <p className="text-sm text-muted-foreground">{batch.product}</p>
                    <p className="text-xs text-muted-foreground">{batch.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{batch.quantity.toLocaleString()} kg</p>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                  </div>
                  
                  <Badge className={`${getQualityColor(batch.quality)} text-white`}>
                    Grade {batch.quality}
                  </Badge>
                  
                  <Badge variant="secondary" className={getBatchStatusColor(batch.status)}>
                    {batch.status === 'completed' ? 'Selesai' : 
                     batch.status === 'in_progress' ? 'Proses' : 'Terjadwal'}
                  </Badge>
                  
                  <Button size="sm" variant="outline">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium">Batch Baru</h4>
            <p className="text-sm text-muted-foreground">Mulai produksi batch baru</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <QrCode className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium">Generate QR</h4>
            <p className="text-sm text-muted-foreground">Cetak QR code produk</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-medium">Shipping</h4>
            <p className="text-sm text-muted-foreground">Kelola pengiriman</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium">Laporan</h4>
            <p className="text-sm text-muted-foreground">Analisis produksi</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}