import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Brain, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  Users,
  Zap,
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface TrendData {
  month: string;
  demand: number;
  price: number;
  supply: number;
  forecast: number;
  confidence: number;
}

interface MarketInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  probability: number;
  timeframe: string;
  aiConfidence: number;
}

interface RegionalData {
  region: string;
  demand: number;
  growth: number;
  potential: number;
  risk: number;
}

const mockTrendData: TrendData[] = [
  { month: 'Jan', demand: 85000, price: 2850, supply: 90000, forecast: 88000, confidence: 92 },
  { month: 'Feb', demand: 92000, price: 2920, supply: 88000, forecast: 94000, confidence: 89 },
  { month: 'Mar', demand: 105000, price: 3150, supply: 95000, forecast: 108000, confidence: 94 },
  { month: 'Apr', demand: 125000, price: 3450, supply: 115000, forecast: 128000, confidence: 91 },
  { month: 'Mei', demand: 140000, price: 3680, supply: 130000, forecast: 145000, confidence: 88 },
  { month: 'Jun', demand: 155000, price: 3850, supply: 145000, forecast: 160000, confidence: 85 },
  { month: 'Jul', demand: 148000, price: 3720, supply: 150000, forecast: 152000, confidence: 87 },
  { month: 'Aug', demand: 135000, price: 3580, supply: 140000, forecast: 138000, confidence: 90 },
  { month: 'Sep', demand: 120000, price: 3350, supply: 125000, forecast: 122000, confidence: 92 },
  { month: 'Okt', demand: 110000, price: 3200, supply: 115000, forecast: 112000, confidence: 89 },
  { month: 'Nov', demand: 95000, price: 2980, supply: 100000, forecast: 97000, confidence: 91 },
  { month: 'Des', demand: 88000, price: 2850, supply: 92000, forecast: 90000, confidence: 93 }
];

const mockInsights: MarketInsight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Peningkatan Permintaan Q2 2025',
    description: 'AI memprediksi peningkatan permintaan pupuk organik sebesar 35% pada Q2 2025 karena tren pertanian berkelanjutan.',
    impact: 'high',
    probability: 87,
    timeframe: '3-6 bulan',
    aiConfidence: 92
  },
  {
    id: '2',
    type: 'risk',
    title: 'Risiko Kekurangan Pasokan Musim Kemarau',
    description: 'Model prediktif menunjukkan kemungkinan defisit pasokan 15% pada musim kemarau di wilayah Jawa Timur.',
    impact: 'high',
    probability: 73,
    timeframe: '2-4 bulan',
    aiConfidence: 85
  },
  {
    id: '3',
    type: 'trend',
    title: 'Adopsi Pupuk Premium Meningkat',
    description: 'Analisis pola pembelian menunjukkan tren migrasi ke pupuk premium dengan pertumbuhan 28% year-over-year.',
    impact: 'medium',
    probability: 91,
    timeframe: '1-3 bulan',
    aiConfidence: 94
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'Optimasi Distribusi Berbasis AI',
    description: 'Implementasi routing AI dapat mengurangi biaya distribusi hingga 22% dan meningkatkan efisiensi delivery.',
    impact: 'high',
    probability: 95,
    timeframe: 'Immediate',
    aiConfidence: 98
  }
];

const mockRegionalData: RegionalData[] = [
  { region: 'Jawa Barat', demand: 28500, growth: 12.5, potential: 85, risk: 15 },
  { region: 'Jawa Tengah', demand: 24200, growth: 8.3, potential: 78, risk: 22 },
  { region: 'Jawa Timur', demand: 31800, growth: 15.2, potential: 92, risk: 28 },
  { region: 'Sumatera Utara', demand: 19500, growth: 18.7, potential: 88, risk: 12 },
  { region: 'Sulawesi Selatan', demand: 16200, growth: 22.1, potential: 95, risk: 8 }
];

const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function MarketTrendsAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');
  const [analysisMode, setAnalysisMode] = useState('comprehensive');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastUpdated(new Date());
    }, 3000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'trend': return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Analisis Tren Pasar</h1>
          <p className="text-muted-foreground">
            Analisis prediktif berbasis AI untuk tren pasar pupuk dan insight strategis
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Terakhir diperbarui: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button 
            onClick={runAIAnalysis} 
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Jalankan AI Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Status & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Confidence</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
              </div>
              <Brain className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={94.2} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prediksi Akurasi</p>
                <p className="text-2xl font-bold text-blue-600">91.7%</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Progress value={91.7} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model Updates</p>
                <p className="text-2xl font-bold text-purple-600">Real-time</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <Badge variant="secondary" className="mt-2">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Points</p>
                <p className="text-2xl font-bold text-orange-600">2.4M+</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Processed daily</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Analisis Tren</TabsTrigger>
          <TabsTrigger value="predictions">Prediksi AI</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="regional">Analisis Regional</TabsTrigger>
        </TabsList>

        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demand vs Supply Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tren Permintaan vs Pasokan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value?.toLocaleString()} ton`, 
                        name === 'demand' ? 'Permintaan' : 'Pasokan'
                      ]}
                    />
                    <Area type="monotone" dataKey="demand" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="supply" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Price Trend with AI Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Tren Harga & Prediksi AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`Rp ${value?.toLocaleString()}`, 'Harga per kg']}
                    />
                    <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI-Generated Market Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Ringkasan AI - Kondisi Pasar Terkini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Stabilitas Pasar Terjaga</p>
                    <p className="text-sm text-muted-foreground">
                      AI menganalisis bahwa pasar pupuk dalam kondisi stabil dengan fluktuasi harga normal 5-8% dari baseline.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Proyeksi Pertumbuhan Positif</p>
                    <p className="text-sm text-muted-foreground">
                      Model prediksi menunjukkan pertumbuhan permintaan 12-15% pada semester depan dengan confidence level 89%.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Area Perhatian</p>
                    <p className="text-sm text-muted-foreground">
                      Deteksi potensi ketidakseimbangan supply-demand di 3 wilayah prioritas memerlukan intervensi dalam 4-6 minggu.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demand Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Prediksi Permintaan 6 Bulan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} name="Aktual" />
                    <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Prediksi AI" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">+14.2%</p>
                    <p className="text-sm text-muted-foreground">Pertumbuhan Prediksi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">91%</p>
                    <p className="text-sm text-muted-foreground">Akurasi Model</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confidence Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Tingkat Kepercayaan Prediksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Confidence']} />
                    <Bar dataKey="confidence" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <Progress value={90.2} className="h-3" />
                  <p className="text-sm text-center mt-2 text-muted-foreground">
                    Rata-rata Confidence: 90.2%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performa Model AI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">94.7%</div>
                  <div className="text-sm text-muted-foreground">Akurasi Prediksi Harga</div>
                  <Progress value={94.7} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">91.2%</div>
                  <div className="text-sm text-muted-foreground">Akurasi Prediksi Demand</div>
                  <Progress value={91.2} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">88.9%</div>
                  <div className="text-sm text-muted-foreground">Akurasi Trend Forecast</div>
                  <Progress value={88.9} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">96.1%</div>
                  <div className="text-sm text-muted-foreground">Deteksi Anomali</div>
                  <Progress value={96.1} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Generated Insights */}
            <div className="space-y-4">
              {mockInsights.map((insight) => (
                <Card key={insight.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <span className="font-medium capitalize">{insight.type}</span>
                      </div>
                      <Badge variant={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span>Probabilitas: {insight.probability}%</span>
                        <span>Timeframe: {insight.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        <span>AI: {insight.aiConfidence}%</span>
                      </div>
                    </div>
                    <Progress value={insight.probability} className="mt-2 h-1" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Rekomendasi Tindakan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Prioritas Tinggi</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Tingkatkan stok pupuk organik di Jawa Timur untuk mengantisipasi lonjakan permintaan Q2.
                  </p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Buat Purchase Order
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Optimasi Operasional</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Implementasikan rute distribusi AI-optimized untuk meningkatkan efisiensi 22%.
                  </p>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                    <Eye className="w-3 h-3 mr-1" />
                    Lihat Rute Optimal
                  </Button>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Perhatian Khusus</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Monitor closely supply chain di Sulawesi - potensi disruption 30%.
                  </p>
                  <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Set Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Regional Analysis Tab */}
        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Demand Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Distribusi Permintaan Regional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockRegionalData}
                      dataKey="demand"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.region}: ${((entry.demand / mockRegionalData.reduce((a, b) => a + b.demand, 0)) * 100).toFixed(1)}%`}
                    >
                      {mockRegionalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value?.toLocaleString()} ton`, 'Permintaan']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Growth & Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Analisis Pertumbuhan & Risiko
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRegionalData.map((region, index) => (
                    <div key={region.region} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{region.region}</h4>
                        <Badge variant={region.growth > 15 ? 'default' : 'secondary'}>
                          {region.growth > 0 ? '+' : ''}{region.growth}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Potensi Pasar</span>
                          <span>{region.potential}%</span>
                        </div>
                        <Progress value={region.potential} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Risk Level</span>
                          <span className={region.risk > 20 ? 'text-red-600' : 'text-green-600'}>
                            {region.risk}%
                          </span>
                        </div>
                        <Progress 
                          value={region.risk} 
                          className="h-2" 
                          // You might want to add a custom progress variant for risk
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Regional Recommendations */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Rekomendasi Regional AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Peluang Ekspansi
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span><strong>Sumatera Utara:</strong> Market penetration baru, potensi growth 35%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span><strong>Sulawesi Selatan:</strong> Demand pupuk premium meningkat 40%</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Area Perhatian
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <span><strong>Jawa Tengah:</strong> Competition intensity tinggi, margin pressure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <span><strong>Jawa Timur:</strong> Supply constraint risk pada peak season</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}