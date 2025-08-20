
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Package, AlertTriangle, TrendingUp, Truck, Users, BarChart3, Brain, Bell, Zap, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StockAlertWidget, useNotifications } from './NotificationManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { PredictiveAnalytics } from './PredictiveAnalytics';

// Mock data for the dashboard
const stockData = [
  { name: 'Urea', stock: 50, unit: 'Ton', status: 'normal', color: 'bg-blue-500', trend: '+2.5%', prediction: 48 },
  { name: 'NPK', stock: 25, unit: 'Ton', status: 'low', color: 'bg-green-500', trend: '-8.2%', prediction: 22 },
  { name: 'TSP', stock: 15, unit: 'Ton', status: 'normal', color: 'bg-purple-500', trend: '+1.8%', prediction: 16 },
  { name: 'KCl', stock: 8, unit: 'Ton', status: 'critical', color: 'bg-orange-500', trend: '-12.5%', prediction: 5 },
];

const salesTrendData = [
  { day: 'Sen', sales: 12, predicted: 11.5 },
  { day: 'Sel', sales: 18, predicted: 17.8 },
  { day: 'Rab', sales: 15, predicted: 16.2 },
  { day: 'Kam', sales: 22, predicted: 21.5 },
  { day: 'Jum', sales: 19, predicted: 19.8 },
  { day: 'Sab', sales: 25, predicted: 24.2 },
  { day: 'Min', sales: 16, predicted: 18.5 },
];

const stockDistribution = [
  { name: 'Urea', value: 45, color: '#3b82f6' },
  { name: 'NPK', value: 28, color: '#10b981' },
  { name: 'TSP', value: 18, color: '#8b5cf6' },
  { name: 'KCl', value: 9, color: '#f59e0b' },
];

const lowStockAlerts = [
  { product: 'NPK Premium', currentStock: 2.5, threshold: 5, unit: 'Ton', trend: 'declining', urgency: 'high' },
  { product: 'KCl Import', currentStock: 1.2, threshold: 3, unit: 'Ton', trend: 'declining', urgency: 'critical' },
];

const aiInsights = [
  {
    title: 'Prediksi Lonjakan Permintaan',
    message: 'NPK Premium diprediksi naik 35% dalam 10 hari ke depan',
    confidence: 87,
    type: 'opportunity'
  },
  {
    title: 'Risiko Stok Habis',
    message: 'KCl Import akan habis dalam 3 hari jika tidak di-restock',
    confidence: 92,
    type: 'warning'
  },
  {
    title: 'Optimasi Inventaris',
    message: 'Kurangi stok Urea 7 ton untuk efisiensi biaya',
    confidence: 78,
    type: 'optimization'
  }
];

export function DistributorDashboard() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { addNotification } = useNotifications();

  const triggerStockAlert = (product: string) => {
    addNotification({
      type: 'critical_stock',
      title: `STOK KRITIS: ${product}`,
      message: `Stok ${product} mencapai batas kritis. Segera lakukan restock untuk menghindari kehabisan stok.`,
      priority: 'urgent',
      persistent: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'optimization': return <Zap className="w-4 h-4 text-blue-500" />;
      default: return <Brain className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard Stok Distributor</h1>
          <p className="text-muted-foreground">
            Pantau inventaris dan penjualan pupuk bersubsidi dengan AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Advanced AI Analytics</DialogTitle>
              </DialogHeader>
              <PredictiveAnalytics />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => triggerStockAlert('NPK Premium')}>
            <Bell className="w-4 h-4 mr-2" />
            Test Alert
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{insight.confidence}% confidence</Badge>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stockData.map((item) => (
          <Card key={item.name} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stok {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold mb-1">
                    {item.stock} {item.unit}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={item.status === 'critical' ? 'destructive' : 
                              item.status === 'low' ? 'secondary' : 'default'}
                    >
                      {item.status === 'critical' ? 'Kritis' : 
                       item.status === 'low' ? 'Rendah' : 'Normal'}
                    </Badge>
                    <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.trend}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    AI Prediksi: {item.prediction} {item.unit}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center`}>
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
              {item.status === 'critical' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => triggerStockAlert(item.name)}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Alert
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tren Penjualan & Prediksi AI
            </CardTitle>
            <CardDescription>
              Perbandingan data aktual vs prediksi machine learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  name="Aktual"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981' }}
                  name="Prediksi AI"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Distribusi Stok
            </CardTitle>
            <CardDescription>
              Komposisi stok berdasarkan jenis pupuk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Low Stock Alerts */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Peringatan Stok Rendah & AI Recommendations
          </CardTitle>
          <CardDescription>
            Produk yang memerlukan restock dengan rekomendasi AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowStockAlerts.map((alert, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      {alert.urgency === 'critical' && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{alert.product}</p>
                      <p className="text-sm text-muted-foreground">
                        Stok tersisa: {alert.currentStock} {alert.unit} (Ambang batas: {alert.threshold} {alert.unit})
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={alert.urgency === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.urgency === 'critical' ? 'Kritis' : 'Rendah'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Trend: {alert.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      AI Recommendation
                    </Button>
                    <Button size="sm" onClick={() => triggerStockAlert(alert.product)}>
                      Pesan Ulang
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">89</div>
                <p className="text-sm text-muted-foreground">Transaksi Hari Ini</p>
                <p className="text-xs text-green-600">+12% dari kemarin</p>
              </div>
              <div className="relative">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <Activity className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">Petani Terlayani</p>
                <p className="text-xs text-blue-600">Bulan ini</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">Pengiriman Pending</p>
                <p className="text-xs text-orange-600">Memerlukan perhatian</p>
              </div>
              <Truck className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
                <p className="text-xs text-purple-600">Prediction model</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Widget */}
      <div className="flex justify-center">
        <StockAlertWidget />
      </div>
    </div>
  );
}
