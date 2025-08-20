import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Zap,
  Eye,
  RefreshCw,
  Download,
  Share2,
  Calendar,
  Users,
  Package,
  DollarSign,
  Lightbulb,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Search,
  Filter
} from 'lucide-react';

interface RegionalData {
  province: string;
  distribution: number;
  efficiency: number;
  stockLevel: number;
  farmerCount: number;
  subsidyAmount: number;
  trend: 'up' | 'down' | 'stable';
  prediction: {
    nextMonth: number;
    confidence: number;
    factors: string[];
  };
  anomalies: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
  }[];
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'prediction' | 'anomaly' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  region?: string;
  data?: any;
  action?: string;
}

const mockRegionalData: RegionalData[] = [
  {
    province: 'Jawa Barat',
    distribution: 2800000,
    efficiency: 94.2,
    stockLevel: 85.5,
    farmerCount: 1250000,
    subsidyAmount: 420000000000,
    trend: 'up',
    prediction: {
      nextMonth: 2950000,
      confidence: 89.3,
      factors: ['Musim tanam', 'Cuaca optimal', 'Akses distribusi baik']
    },
    anomalies: [
      {
        type: 'Distribusi tidak merata',
        severity: 'medium',
        description: 'Konsentrasi tinggi di wilayah utara, rendah di selatan'
      }
    ],
    recommendations: [
      {
        priority: 'high',
        action: 'Realokasi distribusi ke wilayah selatan',
        impact: 'Peningkatan efisiensi 12-15%'
      },
      {
        priority: 'medium',
        action: 'Penambahan titik distribusi di Kabupaten Sukabumi',
        impact: 'Mengurangi waktu tempuh petani 30%'
      }
    ]
  },
  {
    province: 'Jawa Timur',
    distribution: 2650000,
    efficiency: 91.8,
    stockLevel: 78.2,
    farmerCount: 1180000,
    subsidyAmount: 385000000000,
    trend: 'stable',
    prediction: {
      nextMonth: 2720000,
      confidence: 92.1,
      factors: ['Stabilitas cuaca', 'Infrastruktur memadai', 'Koordinasi baik']
    },
    anomalies: [
      {
        type: 'Fluktuasi demand tinggi',
        severity: 'high',
        description: 'Permintaan tidak terduga di wilayah Malang dan Kediri'
      }
    ],
    recommendations: [
      {
        priority: 'high',
        action: 'Buffer stock tambahan untuk wilayah Malang-Kediri',
        impact: 'Stabilisasi supply 95%+'
      }
    ]
  },
  {
    province: 'Sulawesi Tengah',
    distribution: 450000,
    efficiency: 67.3,
    stockLevel: 23.8,
    farmerCount: 285000,
    subsidyAmount: 75000000000,
    trend: 'down',
    prediction: {
      nextMonth: 380000,
      confidence: 94.7,
      factors: ['Stok kritis', 'Cuaca ekstrem', 'Akses terbatas']
    },
    anomalies: [
      {
        type: 'Stok kritis multiple locations',
        severity: 'high',
        description: '5 kabupaten dengan stok < 5% dari kebutuhan normal'
      },
      {
        type: 'Jalur distribusi terganggu',
        severity: 'high',
        description: 'Cuaca ekstrem memblokir 3 jalur utama'
      }
    ],
    recommendations: [
      {
        priority: 'high',
        action: 'Distribusi darurat via udara ke 5 kabupaten kritis',
        impact: 'Menyelamatkan musim tanam 85% petani'
      },
      {
        priority: 'high',
        action: 'Aktivasi jalur distribusi alternatif',
        impact: 'Memulihkan supply chain 60%'
      }
    ]
  }
];

const mockAIInsights: AIInsight[] = [
  {
    id: 'ai-001',
    type: 'pattern',
    title: 'Pola Distribusi Optimal Terdeteksi',
    description: 'AI mendeteksi pola distribusi yang paling efisien terjadi pada hari Selasa-Kamis dengan tingkat efisiensi 23% lebih tinggi dibanding hari lain.',
    confidence: 94.2,
    impact: 'high',
    action: 'Realokasi jadwal distribusi utama ke hari Selasa-Kamis'
  },
  {
    id: 'ai-002',
    type: 'prediction',
    title: 'Prediksi Lonjakan Permintaan Jawa Tengah',
    description: 'Model AI memprediksi lonjakan permintaan 35% di Jawa Tengah dalam 2 minggu ke depan berdasarkan pola cuaca dan kalender tanam.',
    confidence: 87.8,
    impact: 'high',
    region: 'Jawa Tengah',
    action: 'Siapkan buffer stock tambahan 400.000 ton'
  },
  {
    id: 'ai-003',
    type: 'anomaly',
    title: 'Anomali Konsumsi Pupuk NPK',
    description: 'Terdeteksi penggunaan pupuk NPK 150% di atas normal di 3 kabupaten Sumatra Utara. Kemungkinan redistribusi tidak resmi.',
    confidence: 91.5,
    impact: 'high',
    region: 'Sumatra Utara',
    action: 'Investigasi mendalam dan audit distribusi'
  },
  {
    id: 'ai-004',
    type: 'optimization',
    title: 'Optimasi Rute Distribusi Kalimantan',
    description: 'AI mengidentifikasi rute distribusi baru yang dapat mengurangi biaya transportasi 18% dan waktu tempuh 25% untuk wilayah Kalimantan.',
    confidence: 89.3,
    impact: 'medium',
    region: 'Kalimantan',
    action: 'Implementasi rute baru dalam 2 minggu'
  },
  {
    id: 'ai-005',
    type: 'pattern',
    title: 'Korelasi Cuaca-Efisiensi Distribusi',
    description: 'Ditemukan korelasi kuat (R²=0.84) antara indeks cuaca dan efisiensi distribusi. Cuaca optimal meningkatkan efisiensi hingga 28%.',
    confidence: 96.1,
    impact: 'medium',
    action: 'Integrasikan prediksi cuaca dalam planning distribusi'
  }
];

const efficiencyTrendData = [
  { month: 'Jul', jabar: 91, jatim: 89, jateng: 88, sumut: 85, sulsel: 82 },
  { month: 'Ags', jabar: 92, jatim: 90, jateng: 89, sumut: 86, sulsel: 84 },
  { month: 'Sep', jabar: 93, jatim: 91, jateng: 90, sumut: 87, sulsel: 85 },
  { month: 'Okt', jabar: 94, jatim: 92, jateng: 91, sumut: 88, sulsel: 86 },
  { month: 'Nov', jabar: 94, jatim: 92, jateng: 91, sumut: 87, sulsel: 85 },
  { month: 'Des', jabar: 95, jatim: 93, jateng: 92, sumut: 89, sulsel: 87 }
];

const predictionAccuracyData = [
  { metric: 'Demand Forecasting', accuracy: 94.2, trend: 'up' },
  { metric: 'Stock Optimization', accuracy: 91.8, trend: 'up' },
  { metric: 'Route Planning', accuracy: 89.3, trend: 'stable' },
  { metric: 'Anomaly Detection', accuracy: 96.7, trend: 'up' },
  { metric: 'Weather Impact', accuracy: 87.1, trend: 'down' }
];

export function AIRegionalAnalysis() {
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [analysisMode, setAnalysisMode] = useState<string>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [refreshTime, setRefreshTime] = useState(new Date());

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setRefreshTime(new Date());
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'prediction': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'anomaly': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'optimization': return <Zap className="w-5 h-5 text-purple-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredRegionalData = selectedProvince === 'all' 
    ? mockRegionalData 
    : mockRegionalData.filter(d => d.province === selectedProvince);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            Analisis Regional AI
          </h1>
          <p className="text-muted-foreground">
            Analisis mendalam menggunakan AI untuk optimasi distribusi pupuk regional
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              AI Engine Active - Terakhir update: {refreshTime.toLocaleTimeString('id-ID')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runAIAnalysis} 
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Jalankan Analisis AI
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* AI Processing Indicator */}
      {isAnalyzing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">AI Engine Sedang Bekerja</h3>
                <p className="text-sm text-blue-700">
                  Menganalisis pola distribusi, prediksi demand, dan optimasi regional...
                </p>
                <Progress value={65} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Pilih Provinsi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Provinsi</SelectItem>
            <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
            <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
            <SelectItem value="Jawa Tengah">Jawa Tengah</SelectItem>
            <SelectItem value="Sulawesi Tengah">Sulawesi Tengah</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={analysisMode} onValueChange={setAnalysisMode}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Mode Analisis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview Komprehensif</SelectItem>
            <SelectItem value="prediction">Prediktif Analytics</SelectItem>
            <SelectItem value="optimization">Optimasi Distribusi</SelectItem>
            <SelectItem value="anomaly">Deteksi Anomali</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="regional">Analisis Regional</TabsTrigger>
          <TabsTrigger value="predictions">Prediksi & Forecast</TabsTrigger>
          <TabsTrigger value="optimization">Optimasi</TabsTrigger>
          <TabsTrigger value="performance">Performa AI</TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAIInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <Badge variant="secondary">{insight.type}</Badge>
                    </div>
                    <Badge 
                      className={`${getConfidenceColor(insight.confidence)} bg-transparent`}
                      variant="outline"
                    >
                      {insight.confidence}% akurat
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {insight.description}
                  </p>
                  
                  {insight.region && (
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{insight.region}</span>
                    </div>
                  )}

                  {insight.action && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Rekomendasi</span>
                      </div>
                      <p className="text-sm text-blue-700">{insight.action}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <Badge 
                      variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                    >
                      Impact: {insight.impact}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Regional Analysis Tab */}
        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRegionalData.map((region) => (
              <Card key={region.province}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      {region.province}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {region.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                      {region.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
                      {region.trend === 'stable' && <Activity className="w-5 h-5 text-blue-600" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Distribusi</p>
                      <p className="font-bold">{(region.distribution / 1000000).toFixed(1)}M ton</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Efisiensi</p>
                      <p className="font-bold">{region.efficiency}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stok Level</p>
                      <p className="font-bold">{region.stockLevel}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Petani</p>
                      <p className="font-bold">{(region.farmerCount / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  {/* AI Prediction */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-600" />
                      Prediksi AI Bulan Depan
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">
                        {(region.prediction.nextMonth / 1000000).toFixed(1)}M ton
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        {region.prediction.confidence}% yakin
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Faktor: {region.prediction.factors.join(', ')}
                    </div>
                  </div>

                  {/* Anomalies */}
                  {region.anomalies.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        Anomali Terdeteksi
                      </h4>
                      {region.anomalies.map((anomaly, idx) => (
                        <div key={idx} className={`p-2 rounded-lg ${
                          anomaly.severity === 'high' ? 'bg-red-50 border border-red-200' :
                          anomaly.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-blue-50 border border-blue-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium">{anomaly.type}</span>
                            <Badge variant={
                              anomaly.severity === 'high' ? 'destructive' :
                              anomaly.severity === 'medium' ? 'default' : 'secondary'
                            }>
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{anomaly.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      Rekomendasi AI
                    </h4>
                    {region.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-2 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">{rec.action}</span>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-blue-700">{rec.impact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tren Efisiensi Regional - Prediksi 6 Bulan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={efficiencyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="jabar" stroke="#3b82f6" strokeWidth={2} name="Jawa Barat" />
                    <Line type="monotone" dataKey="jatim" stroke="#10b981" strokeWidth={2} name="Jawa Timur" />
                    <Line type="monotone" dataKey="jateng" stroke="#f59e0b" strokeWidth={2} name="Jawa Tengah" />
                    <Line type="monotone" dataKey="sumut" stroke="#ef4444" strokeWidth={2} name="Sumut" />
                    <Line type="monotone" dataKey="sulsel" stroke="#8b5cf6" strokeWidth={2} name="Sulsel" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Akurasi Model Prediksi AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictionAccuracyData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.metric}</span>
                          <span className="text-sm font-bold">{item.accuracy}%</span>
                        </div>
                        <Progress value={item.accuracy} className="h-2" />
                      </div>
                      <div className="ml-4">
                        {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        {item.trend === 'stable' && <Activity className="w-4 h-4 text-blue-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prediction Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prediksi Demand Nasional</p>
                    <p className="text-2xl font-bold text-green-600">+12.5%</p>
                    <p className="text-xs text-muted-foreground mt-1">Bulan depan vs bulan ini</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-600" />
                </div>
                <Badge className="mt-3 bg-green-100 text-green-800">94.2% Confidence</Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Efisiensi Rata-rata</p>
                    <p className="text-2xl font-bold text-blue-600">91.8%</p>
                    <p className="text-xs text-muted-foreground mt-1">Proyeksi 3 bulan ke depan</p>
                  </div>
                  <Target className="w-12 h-12 text-blue-600" />
                </div>
                <Badge className="mt-3 bg-blue-100 text-blue-800">89.7% Confidence</Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Potensi Penghematan</p>
                    <p className="text-2xl font-bold text-purple-600">Rp 125M</p>
                    <p className="text-xs text-muted-foreground mt-1">Melalui optimasi AI</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-purple-600" />
                </div>
                <Badge className="mt-3 bg-purple-100 text-purple-800">87.3% Confidence</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Rekomendasi Optimasi AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Optimasi Rute Distribusi</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Rute baru dapat mengurangi biaya transportasi 18% dan waktu tempuh 25%
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-green-100 text-green-800">Penghematan: Rp 2.1M/bulan</Badge>
                      <Button size="sm">Implementasi</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Optimasi Buffer Stock</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Realokasi buffer stock berdasarkan prediksi AI dapat meningkatkan efisiensi 15%
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-blue-100 text-blue-800">Efisiensi: +15%</Badge>
                      <Button size="sm">Terapkan</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Optimasi Jadwal Distribusi</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Distribusi pada hari Selasa-Kamis terbukti 23% lebih efisien
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-purple-100 text-purple-800">Efisiensi: +23%</Badge>
                      <Button size="sm">Atur Ulang</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">Estimasi Impact Optimasi</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Penghematan Biaya</span>
                        <span className="font-bold text-green-600">Rp 8.5M/bulan</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Peningkatan Efisiensi</span>
                        <span className="font-bold text-blue-600">+32%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Petani Terlayani Tambahan</span>
                        <span className="font-bold text-purple-600">+125,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">ROI Optimasi</span>
                        <span className="font-bold text-orange-600">340%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Timeline Implementasi</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Minggu 1: Setup rute baru</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Minggu 2: Realokasi buffer stock</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Minggu 3: Implementasi jadwal baru</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Minggu 4: Monitoring & evaluasi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Model Accuracy</h3>
                <p className="text-2xl font-bold text-blue-600">94.2%</p>
                <p className="text-xs text-muted-foreground">Rata-rata semua model</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Processing Speed</h3>
                <p className="text-2xl font-bold text-green-600">2.1s</p>
                <p className="text-xs text-muted-foreground">Rata-rata response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Predictions Made</h3>
                <p className="text-2xl font-bold text-purple-600">12,847</p>
                <p className="text-xs text-muted-foreground">Bulan ini</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Success Rate</h3>
                <p className="text-2xl font-bold text-orange-600">98.7%</p>
                <p className="text-xs text-muted-foreground">Implementasi rekomendasi</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performa Real-time AI Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Model Performance Metrics</h4>
                  {predictionAccuracyData.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{metric.accuracy}%</span>
                        {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        {metric.trend === 'stable' && <Activity className="w-4 h-4 text-blue-600" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">System Health</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CPU Usage</span>
                      <span className="font-bold text-green-600">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Usage</span>
                      <span className="font-bold text-blue-600">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">GPU Utilization</span>
                      <span className="font-bold text-purple-600">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Pipeline Health</span>
                      <span className="font-bold text-green-600">Optimal</span>
                    </div>
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