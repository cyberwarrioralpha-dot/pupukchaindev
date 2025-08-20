import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Brain, AlertTriangle, Target, Calendar, Package, Users, Activity, Zap } from 'lucide-react';

interface PredictionModel {
  id: string;
  name: string;
  accuracy: number;
  lastUpdated: Date;
  status: 'active' | 'training' | 'maintenance';
}

interface DemandForecast {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
  seasonal: number;
  trend: number;
}

interface InventoryOptimization {
  product: string;
  currentStock: number;
  optimalStock: number;
  reorderPoint: number;
  safetyStock: number;
  leadTime: number;
  turnoverRate: number;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface SeasonalPattern {
  month: string;
  demandIndex: number;
  historical: number;
  predicted: number;
}

interface AlertInsight {
  id: string;
  type: 'demand_spike' | 'seasonal_change' | 'supply_risk' | 'optimization';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
  expectedDate?: string;
  probability: number;
}

export function PredictiveAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for demonstration
  const [models] = useState<PredictionModel[]>([
    { id: '1', name: 'Demand Forecasting LSTM', accuracy: 94.2, lastUpdated: new Date(), status: 'active' },
    { id: '2', name: 'Seasonal ARIMA', accuracy: 87.5, lastUpdated: new Date(), status: 'active' },
    { id: '3', name: 'Supply Chain Prophet', accuracy: 91.8, lastUpdated: new Date(), status: 'training' }
  ]);

  const [demandForecast] = useState<DemandForecast[]>([
    { date: '2024-01-21', predicted: 125, actual: 118, confidence: 0.89, seasonal: 1.05, trend: 0.98 },
    { date: '2024-01-22', predicted: 132, actual: 128, confidence: 0.92, seasonal: 1.08, trend: 1.02 },
    { date: '2024-01-23', predicted: 145, confidence: 0.85, seasonal: 1.12, trend: 1.05 },
    { date: '2024-01-24', predicted: 138, confidence: 0.88, seasonal: 1.15, trend: 1.08 },
    { date: '2024-01-25', predicted: 152, confidence: 0.82, seasonal: 1.18, trend: 1.12 },
    { date: '2024-01-26', predicted: 148, confidence: 0.86, seasonal: 1.22, trend: 1.15 },
    { date: '2024-01-27', predicted: 165, confidence: 0.79, seasonal: 1.25, trend: 1.18 },
  ]);

  const [inventoryOptimization] = useState<InventoryOptimization[]>([
    {
      product: 'Pupuk Urea',
      currentStock: 45,
      optimalStock: 38,
      reorderPoint: 25,
      safetyStock: 12,
      leadTime: 5,
      turnoverRate: 8.2,
      recommendation: 'Kurangi stok sebesar 7 ton untuk optimasi biaya',
      priority: 'medium'
    },
    {
      product: 'NPK Premium',
      currentStock: 18,
      optimalStock: 25,
      reorderPoint: 15,
      safetyStock: 8,
      leadTime: 3,
      turnoverRate: 12.5,
      recommendation: 'Tingkatkan stok sebesar 7 ton untuk antisipasi demand',
      priority: 'high'
    },
    {
      product: 'TSP',
      currentStock: 8,
      optimalStock: 12,
      reorderPoint: 8,
      safetyStock: 4,
      leadTime: 4,
      turnoverRate: 6.8,
      recommendation: 'Restock segera - mendekati reorder point',
      priority: 'urgent'
    }
  ]);

  const [seasonalPatterns] = useState<SeasonalPattern[]>([
    { month: 'Jan', demandIndex: 0.95, historical: 1250, predicted: 1305 },
    { month: 'Feb', demandIndex: 1.12, historical: 1480, predicted: 1502 },
    { month: 'Mar', demandIndex: 1.35, historical: 1780, predicted: 1825 },
    { month: 'Apr', demandIndex: 1.28, historical: 1690, predicted: 1720 },
    { month: 'May', demandIndex: 1.18, historical: 1550, predicted: 1580 },
    { month: 'Jun', demandIndex: 0.87, historical: 1150, predicted: 1175 },
    { month: 'Jul', demandIndex: 0.76, historical: 1000, predicted: 1025 },
    { month: 'Aug', demandIndex: 0.82, historical: 1080, predicted: 1100 },
    { month: 'Sep', demandIndex: 1.05, historical: 1380, predicted: 1400 },
    { month: 'Oct', demandIndex: 1.22, historical: 1610, predicted: 1635 },
    { month: 'Nov', demandIndex: 1.08, historical: 1420, predicted: 1450 },
    { month: 'Dec', demandIndex: 0.93, historical: 1225, predicted: 1250 }
  ]);

  const [alerts] = useState<AlertInsight[]>([
    {
      id: '1',
      type: 'demand_spike',
      title: 'Lonjakan Permintaan NPK Diprediksi',
      description: 'Model AI mendeteksi pola yang menunjukkan lonjakan permintaan NPK Premium sebesar 35% dalam 10 hari ke depan',
      impact: 'high',
      recommendation: 'Tingkatkan stok NPK Premium menjadi 45 ton dan siapkan supplier backup',
      expectedDate: '2024-01-30',
      probability: 0.87
    },
    {
      id: '2',
      type: 'seasonal_change',
      title: 'Perubahan Pola Musiman',
      description: 'Pola konsumsi pupuk menunjukkan pergeseran musiman lebih awal 2 minggu dari biasanya',
      impact: 'medium',
      recommendation: 'Sesuaikan strategi distribusi dengan pola musiman yang baru',
      expectedDate: '2024-02-05',
      probability: 0.73
    },
    {
      id: '3',
      type: 'supply_risk',
      title: 'Risiko Gangguan Supply Chain',
      description: 'Analisis eksternal menunjukkan potensi keterlambatan pengiriman dari supplier utama',
      impact: 'high',
      recommendation: 'Diversifikasi supplier dan tingkatkan safety stock 20%',
      expectedDate: '2024-02-10',
      probability: 0.65
    }
  ]);

  const runPredictionAnalysis = async () => {
    setIsLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Analitik Prediktif & AI</h1>
          <p className="text-muted-foreground">
            Gunakan machine learning untuk prediksi permintaan, optimasi inventaris, dan insight bisnis
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">90 Hari</SelectItem>
              <SelectItem value="1y">1 Tahun</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runPredictionAnalysis} disabled={isLoading}>
            {isLoading ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Jalankan Analisis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Models Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{model.name}</h3>
                <Badge className={getStatusColor(model.status)}>
                  {model.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {model.accuracy}%
              </div>
              <p className="text-xs text-muted-foreground">
                Akurasi Model
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI Insights & Peringatan
          </CardTitle>
          <CardDescription>
            Insight otomatis dari analisis machine learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    <h4 className="font-medium">{alert.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(alert.impact)}>
                      {alert.impact} impact
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(alert.probability * 100)}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Rekomendasi:</p>
                  <p className="text-sm text-blue-700">{alert.recommendation}</p>
                </div>
                {alert.expectedDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Perkiraan tanggal: {formatDate(alert.expectedDate)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different analytics */}
      <Tabs defaultValue="demand" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demand">Prediksi Permintaan</TabsTrigger>
          <TabsTrigger value="inventory">Optimasi Inventaris</TabsTrigger>
          <TabsTrigger value="seasonal">Analisis Musiman</TabsTrigger>
          <TabsTrigger value="risk">Analisis Risiko</TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediksi Permintaan 7 Hari ke Depan</CardTitle>
              <CardDescription>
                Model LSTM dengan akurasi 94.2% berdasarkan historical data dan faktor eksternal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={demandForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => formatDate(label)}
                    formatter={(value: number, name: string) => [
                      `${value} ton`,
                      name === 'predicted' ? 'Prediksi' : 'Aktual'
                    ]}
                  />
                  <Bar dataKey="actual" fill="#10b981" name="Aktual" />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Prediksi"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.1}
                    name="Confidence"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Rata-rata Prediksi</span>
                </div>
                <div className="text-2xl font-bold">142 ton</div>
                <p className="text-sm text-muted-foreground">+12% dari minggu lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Akurasi Model</span>
                </div>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-sm text-muted-foreground">Berdasarkan 1000+ data points</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Confidence Level</span>
                </div>
                <div className="text-2xl font-bold">85.7%</div>
                <p className="text-sm text-muted-foreground">Tingkat kepercayaan rata-rata</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rekomendasi Optimasi Inventaris</CardTitle>
              <CardDescription>
                AI-powered inventory optimization berdasarkan demand forecasting dan cost analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryOptimization.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{item.product}</h4>
                      <Badge variant={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Stok Saat Ini</p>
                        <p className="font-semibold">{item.currentStock} ton</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Stok Optimal</p>
                        <p className="font-semibold text-green-600">{item.optimalStock} ton</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reorder Point</p>
                        <p className="font-semibold text-orange-600">{item.reorderPoint} ton</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Turnover Rate</p>
                        <p className="font-semibold">{item.turnoverRate}x/tahun</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Rekomendasi AI:</p>
                      <p className="text-sm text-blue-700">{item.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Pola Musiman</CardTitle>
              <CardDescription>
                Prediksi seasonal patterns berdasarkan data historis dan faktor eksternal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={seasonalPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value} ton`,
                      name === 'historical' ? 'Historis' : 'Prediksi'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="historical" 
                    stroke="#6b7280" 
                    fill="#6b7280" 
                    fillOpacity={0.3}
                    name="Historis"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.5}
                    name="Prediksi"
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Puncak Musim</p>
                  <p className="font-semibold text-green-600">Maret</p>
                  <p className="text-xs">Index: 1.35</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Musim Sepi</p>
                  <p className="font-semibold text-red-600">Juli</p>
                  <p className="text-xs">Index: 0.76</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Variasi Musiman</p>
                  <p className="font-semibold">±28%</p>
                  <p className="text-xs">dari rata-rata</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Prediksi Akurasi</p>
                  <p className="font-semibold text-blue-600">91.8%</p>
                  <p className="text-xs">model Prophet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analisis Risiko Supply Chain</CardTitle>
              <CardDescription>
                AI-powered risk assessment untuk mengidentifikasi potensi gangguan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                  <p className="text-sm text-muted-foreground">Supply Chain Health</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
                  <p className="text-sm text-muted-foreground">Risiko Teridentifikasi</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h4 className="font-medium">Risiko Tinggi: Keterlambatan Supplier</h4>
                    <Badge variant="destructive">78% probability</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Supplier utama NPK mengalami gangguan produksi dengan probabilitas keterlambatan 78%
                  </p>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Mitigasi:</p>
                    <p className="text-sm text-red-700">Aktifkan supplier backup dan tingkatkan safety stock 25%</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-medium">Risiko Sedang: Fluktuasi Harga</h4>
                    <Badge variant="secondary">45% probability</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Prediksi kenaikan harga bahan baku 15-20% dalam 30 hari ke depan
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Mitigasi:</p>
                    <p className="text-sm text-yellow-700">Pertimbangkan forward contract untuk mengunci harga</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium">Risiko Rendah: Gangguan Cuaca</h4>
                    <Badge variant="outline">23% probability</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Potensi gangguan cuaca ekstrem di jalur distribusi utama
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Mitigasi:</p>
                    <p className="text-sm text-green-700">Monitor weather forecast dan siapkan rute alternatif</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}