import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, MapPin, Users, Package, AlertTriangle, CheckCircle, Target, Bell, Eye, Brain } from 'lucide-react';
import { GovernmentNotificationTicker } from './GovernmentNotificationTicker';

const nationalData = [
  { month: 'Jan', distributed: 850000, target: 900000, efficiency: 94 },
  { month: 'Feb', distributed: 920000, target: 950000, efficiency: 97 },
  { month: 'Mar', distributed: 1050000, target: 1000000, efficiency: 105 },
  { month: 'Apr', distributed: 1150000, target: 1100000, efficiency: 104 },
  { month: 'Mei', distributed: 1280000, target: 1200000, efficiency: 107 },
  { month: 'Jun', distributed: 1180000, target: 1150000, efficiency: 103 }
];

const provinceData = [
  { name: 'Jawa Barat', distributed: 2800000, percentage: 18.5 },
  { name: 'Jawa Timur', distributed: 2650000, percentage: 17.2 },
  { name: 'Jawa Tengah', distributed: 2200000, percentage: 14.8 },
  { name: 'Sumatera Utara', distributed: 1850000, percentage: 12.1 },
  { name: 'Sulawesi Selatan', distributed: 1450000, percentage: 9.7 },
  { name: 'Lainnya', distributed: 4050000, percentage: 27.7 }
];

const warningData = [
  { region: 'Sulawesi Tengah', issue: 'Stok Kritis', level: 'high', stock: 2.3 },
  { region: 'Maluku Utara', issue: 'Keterlambatan Distribusi', level: 'medium', delay: '3 hari' },
  { region: 'Papua Barat', issue: 'Cuaca Ekstrem', level: 'high', impact: 'Akses Terbatas' },
  { region: 'Kalimantan Tengah', issue: 'Anomali Distribusi', level: 'medium', variance: '+15%' }
];

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface GovernmentDashboardProps {
  onNavigateToAI?: () => void;
  onNavigateToMap?: () => void;
  onNavigateToEmergency?: () => void;
  onNavigateToAllocation?: () => void;
}

export function GovernmentDashboard({ onNavigateToAI, onNavigateToMap, onNavigateToEmergency, onNavigateToAllocation }: GovernmentDashboardProps) {
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('distribution');
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header with Live Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Pemerintah</h1>
          <p className="text-muted-foreground">
            Monitoring distribusi pupuk bersubsidi secara nasional
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Live Update - Terakhir: {refreshTime.toLocaleTimeString('id-ID')}
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowNotificationCenter(!showNotificationCenter)}
          className="relative"
        >
          <Bell className="w-4 h-4 mr-2" />
          Pusat Notifikasi
          <Badge className="absolute -top-2 -right-2 px-1 min-w-0 h-5 text-xs bg-red-500">
            12
          </Badge>
        </Button>
      </div>

      {/* Government Notification Ticker */}
      <GovernmentNotificationTicker />

      {/* Real-time Alerts Section */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="w-5 h-5" />
            Peringatan Real-time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warningData.map((warning, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  warning.level === 'high' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{warning.region}</span>
                  <Badge variant={warning.level === 'high' ? 'destructive' : 'secondary'}>
                    {warning.level.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{warning.issue}</p>
                <div className="text-xs mt-1 opacity-75">
                  {warning.stock && `Stok: ${warning.stock}%`}
                  {warning.delay && `Keterlambatan: ${warning.delay}`}
                  {warning.impact && `Dampak: ${warning.impact}`}
                  {warning.variance && `Varians: ${warning.variance}`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* National KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Distribusi Nasional</p>
                <p className="text-2xl font-bold text-blue-600">9.2M Ton</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 8.8M Ton</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+4.5% vs target</span>
            </div>
            <Progress value={104.5} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efisiensi Distribusi</p>
                <p className="text-2xl font-bold text-green-600">96.7%</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 95%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+1.7% vs target</span>
            </div>
            <Progress value={96.7} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Petani Terlayani</p>
                <p className="text-2xl font-bold text-purple-600">8.7M</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 8.5M</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+2.4% vs target</span>
            </div>
            <Progress value={102.4} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subsidi Tersalurkan</p>
                <p className="text-2xl font-bold text-orange-600">Rp 2.1T</p>
                <p className="text-xs text-muted-foreground mt-1">Budget: Rp 2.5T</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">84% terrealisasi</span>
            </div>
            <Progress value={84} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tren Distribusi Nasional</span>
              <Badge variant="outline">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nationalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${(value as number / 1000000).toFixed(1)}M ton`, 
                    name === 'distributed' ? 'Terdistribusi' : 'Target'
                  ]}
                />
                <Line type="monotone" dataKey="distributed" stroke="#3b82f6" strokeWidth={3} name="distributed" />
                <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Provinces */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Provinsi - Distribusi Pupuk</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={provinceData}
                  dataKey="distributed"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.percentage}%`}
                >
                  {provinceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${(value as number / 1000000).toFixed(1)}M ton`, 'Distribusi']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Peta Interaktif Distribusi Indonesia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-lg p-8 text-center">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Peta Distribusi Real-time</h3>
            <p className="text-muted-foreground mb-4">
              Visualisasi real-time distribusi pupuk bersubsidi di seluruh Indonesia dengan indikator status stok dan jalur distribusi aktif.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm" onClick={onNavigateToMap}>
                <Eye className="w-4 h-4 mr-2" />
                Lihat Peta Lengkap
              </Button>
              <Button size="sm" onClick={onNavigateToAI} className="bg-blue-600 hover:bg-blue-700">
                <Brain className="w-4 h-4 mr-2" />
                Analisis Regional
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToEmergency}>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h4 className="font-medium">Laporan Darurat</h4>
            <p className="text-sm text-muted-foreground">Analisis AI untuk situasi kritis</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToAllocation}>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium">Alokasi Darurat</h4>
            <p className="text-sm text-muted-foreground">Optimisasi alokasi berbasis AI</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToAI}>
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium">AI Regional Analysis</h4>
            <p className="text-sm text-muted-foreground">Analisis cerdas berbasis AI</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}