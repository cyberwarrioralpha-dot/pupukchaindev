import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  AlertTriangle, 
  Brain, 
  Zap, 
  Shield, 
  MapPin, 
  Clock, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  Send,
  Eye,
  Lightbulb,
  Target,
  Activity,
  FileText,
  Phone,
  Radio,
  Truck,
  Plane,
  Siren,
  Heart,
  Home,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Thermometer
} from 'lucide-react';

interface EmergencyData {
  id: string;
  type: 'stock_critical' | 'distribution_blocked' | 'weather_extreme' | 'system_failure' | 'social_unrest';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  description: string;
  affectedPopulation: number;
  estimatedDuration: string;
  timestamp: Date;
  status: 'active' | 'escalating' | 'stabilizing' | 'resolved';
  aiRiskScore: number;
  predictedImpact: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  resources: {
    required: string[];
    available: string[];
    deficit: string[];
  };
}

interface AIRecommendation {
  id: string;
  priority: 'immediate' | 'urgent' | 'important' | 'monitor';
  action: string;
  rationale: string;
  estimatedEffectiveness: number;
  resourcesNeeded: string[];
  timeframe: string;
  successMetrics: string[];
}

interface RiskAssessment {
  category: string;
  currentLevel: number;
  predictedLevel: number;
  factors: string[];
  mitigation: string[];
}

const mockEmergencyData: EmergencyData[] = [
  {
    id: 'em001',
    type: 'stock_critical',
    severity: 'critical',
    location: 'Sulawesi Tengah - 5 Kabupaten',
    description: 'Stok pupuk urea habis total di 5 kabupaten. Musim tanam dimulai 3 hari lagi.',
    affectedPopulation: 285000,
    estimatedDuration: '2-3 minggu',
    timestamp: new Date(),
    status: 'escalating',
    aiRiskScore: 94.7,
    predictedImpact: {
      immediate: ['Gagal tanam 85% petani', 'Kerugian ekonomi Rp 45M', 'Kelangkaan pangan lokal'],
      shortTerm: ['Migrasi petani ke kota', 'Inflasi harga beras regional', 'Penurunan GDP daerah'],
      longTerm: ['Degradasi ketahanan pangan nasional', 'Dampak sosial ekonomi berkepanjangan']
    },
    resources: {
      required: ['400.000 ton pupuk urea', '50 truk distribusi', 'Pesawat angkut darurat'],
      available: ['150.000 ton dari Jawa Timur', '20 truk standby', '2 pesawat TNI AU'],
      deficit: ['250.000 ton pupuk', '30 truk tambahan', '3 pesawat cargo']
    }
  },
  {
    id: 'em002',
    type: 'weather_extreme',
    severity: 'high',
    location: 'Kalimantan Selatan',
    description: 'Banjir besar menghalangi jalur distribusi utama. 15 jembatan rusak.',
    affectedPopulation: 450000,
    estimatedDuration: '1-2 bulan',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'active',
    aiRiskScore: 87.3,
    predictedImpact: {
      immediate: ['Isolasi 12 kecamatan', 'Stok pupuk terputus', 'Evakuasi 5000 keluarga'],
      shortTerm: ['Kerusakan infrastruktur Rp 200M', 'Gangguan distribusi 3 bulan', 'Krisis pangan lokal'],
      longTerm: ['Rehabilitasi infrastruktur 12 bulan', 'Pemulihan ekonomi 2 tahun']
    },
    resources: {
      required: ['Jembatan darurat', 'Perahu karet 50 unit', 'Pesawat rescue'],
      available: ['TNI AL 20 perahu', '2 pesawat SAR', 'Jembatan pontoon 3 unit'],
      deficit: ['7 jembatan pontoon', '30 perahu tambahan', '5 pesawat cargo']
    }
  }
];

const mockAIRecommendations: AIRecommendation[] = [
  {
    id: 'rec001',
    priority: 'immediate',
    action: 'Distribusi Darurat via Udara ke Sulawesi Tengah',
    rationale: 'Waktu kritis tersisa 72 jam sebelum musim tanam. Jalur darat terputus, distribusi udara satu-satunya opsi.',
    estimatedEffectiveness: 85,
    resourcesNeeded: ['5 Pesawat Cargo', '200 ton pupuk', '50 personel'],
    timeframe: '24-48 jam',
    successMetrics: ['80% petani dapat pupuk', 'Musim tanam berjalan normal', 'Kerugian < Rp 10M']
  },
  {
    id: 'rec002',
    priority: 'urgent',
    action: 'Aktivasi Jalur Distribusi Alternatif Kalsel',
    rationale: 'Rute laut via Banjarmasin dapat mengurangi dampak blokade jalur darat 60%.',
    estimatedEffectiveness: 78,
    resourcesNeeded: ['Kapal cargo 3 unit', 'Pelabuhan darurat', 'Truk amfibi'],
    timeframe: '3-5 hari',
    successMetrics: ['Distribusi normal 70%', 'Stok tersedia kontinyu', 'Harga stabil']
  },
  {
    id: 'rec003',
    priority: 'important',
    action: 'Realokasi Buffer Stock Nasional',
    rationale: 'Redistribusi stok dari wilayah surplus dapat mengatasi 40% defisit dalam 1 minggu.',
    estimatedEffectiveness: 72,
    resourcesNeeded: ['Koordinasi antar provinsi', '100 truk pengangkut', 'Gudang transit'],
    timeframe: '5-7 hari',
    successMetrics: ['Defisit berkurang 40%', 'Stabilitas regional terjaga']
  }
];

const riskAssessmentData: RiskAssessment[] = [
  {
    category: 'Ketahanan Pangan',
    currentLevel: 85,
    predictedLevel: 45,
    factors: ['Stok kritis multipel wilayah', 'Cuaca ekstrem berkepanjangan', 'Jalur distribusi terganggu'],
    mitigation: ['Diversifikasi supplier', 'Investasi infrastruktur', 'Early warning system']
  },
  {
    category: 'Stabilitas Sosial',
    currentLevel: 75,
    predictedLevel: 60,
    factors: ['Ketidakpuasan petani', 'Kesenjangan ekonomi', 'Misinformasi media sosial'],
    mitigation: ['Komunikasi publik', 'Kompensasi petani', 'Program sosial darurat']
  },
  {
    category: 'Ekonomi Regional',
    currentLevel: 70,
    predictedLevel: 40,
    factors: ['Penurunan produktivitas', 'Inflasi bahan pokok', 'Investasi tertunda'],
    mitigation: ['Stimulus ekonomi', 'Stabilisasi harga', 'Insentif investasi']
  }
];

const emergencyResponseMetrics = [
  { time: '0h', readiness: 45, response: 20, effectiveness: 10 },
  { time: '2h', readiness: 65, response: 40, effectiveness: 25 },
  { time: '6h', readiness: 80, response: 65, effectiveness: 50 },
  { time: '12h', readiness: 90, response: 80, effectiveness: 70 },
  { time: '24h', readiness: 95, response: 90, effectiveness: 85 },
  { time: '48h', readiness: 98, response: 95, effectiveness: 92 }
];

export function AIEmergencyReportAnalysis() {
  const [selectedEmergency, setSelectedEmergency] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportData, setReportData] = useState({
    location: '',
    description: '',
    severity: 'medium',
    type: 'stock_critical'
  });
  const [aiInsights, setAiInsights] = useState<any>(null);

  const runEmergencyAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setAiInsights({
      riskScore: 87.5,
      confidence: 94.2,
      responseTime: '2.3 hours',
      predictedOutcome: 'Manageable with immediate action',
      recommendations: mockAIRecommendations.slice(0, 2)
    });
    
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'escalating': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'active': return <Activity className="w-4 h-4 text-orange-600" />;
      case 'stabilizing': return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case 'resolved': return <Shield className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case 'stock_critical': return <Package className="w-5 h-5 text-red-600" />;
      case 'weather_extreme': return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'distribution_blocked': return <Truck className="w-5 h-5 text-orange-600" />;
      case 'system_failure': return <Zap className="w-5 h-5 text-purple-600" />;
      case 'social_unrest': return <Users className="w-5 h-5 text-yellow-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-red-600" />
            AI Emergency Report Analysis
          </h1>
          <p className="text-muted-foreground">
            Analisis darurat berbasis AI untuk respon cepat situasi kritis distribusi pupuk
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Emergency AI Engine Active - Response Time: &lt; 30 detik
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runEmergencyAnalysis} 
            disabled={isAnalyzing}
            className="bg-red-600 hover:bg-red-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analisis Darurat AI
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* AI Processing Indicator */}
      {isAnalyzing && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-red-900">AI Emergency Analysis in Progress</h3>
                <p className="text-sm text-red-700">
                  Menganalisis tingkat risiko, prediksi dampak, dan rekomendasi respons darurat...
                </p>
                <Progress value={75} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Emergency Dashboard</TabsTrigger>
          <TabsTrigger value="active">Situasi Aktif</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="response">Response Plan</TabsTrigger>
          <TabsTrigger value="report">Create Report</TabsTrigger>
        </TabsList>

        {/* Emergency Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Critical Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Emergency Level</p>
                    <p className="text-2xl font-bold text-red-600">CRITICAL</p>
                    <p className="text-xs text-muted-foreground mt-1">2 active emergencies</p>
                  </div>
                  <Siren className="w-12 h-12 text-red-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600">Escalating situation</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affected Population</p>
                    <p className="text-2xl font-bold text-orange-600">735K</p>
                    <p className="text-xs text-muted-foreground mt-1">People at risk</p>
                  </div>
                  <Users className="w-12 h-12 text-orange-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Activity className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-orange-600">Multi-region impact</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Risk Score</p>
                    <p className="text-2xl font-bold text-blue-600">94.7</p>
                    <p className="text-xs text-muted-foreground mt-1">Very High Risk</p>
                  </div>
                  <Brain className="w-12 h-12 text-blue-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Eye className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-blue-600">95.2% confidence</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Status</p>
                    <p className="text-2xl font-bold text-green-600">ACTIVE</p>
                    <p className="text-xs text-muted-foreground mt-1">Teams deployed</p>
                  </div>
                  <Shield className="w-12 h-12 text-green-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Clock className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">2.3h response time</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Response Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Emergency Response Effectiveness Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={emergencyResponseMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Line type="monotone" dataKey="readiness" stroke="#3b82f6" strokeWidth={3} name="Readiness" />
                  <Line type="monotone" dataKey="response" stroke="#10b981" strokeWidth={3} name="Response" />
                  <Line type="monotone" dataKey="effectiveness" stroke="#f59e0b" strokeWidth={3} name="Effectiveness" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Assessment Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                AI Risk Assessment Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={riskAssessmentData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Current Level"
                      dataKey="currentLevel"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Predicted Level"
                      dataKey="predictedLevel"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {riskAssessmentData.map((risk, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{risk.category}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Risk</span>
                          <span className="font-bold text-blue-600">{risk.currentLevel}%</span>
                        </div>
                        <Progress value={risk.currentLevel} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Predicted Risk</span>
                          <span className="font-bold text-red-600">{risk.predictedLevel}%</span>
                        </div>
                        <Progress value={risk.predictedLevel} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Emergencies */}
        <TabsContent value="active" className="space-y-6">
          <div className="space-y-6">
            {mockEmergencyData.map((emergency) => (
              <Card key={emergency.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getEmergencyIcon(emergency.type)}
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {emergency.location}
                          <Badge className={`${getSeverityColor(emergency.severity)} text-white`}>
                            {emergency.severity.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI Risk Score: {emergency.aiRiskScore}% | Status: {emergency.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(emergency.status)}
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {emergency.estimatedDuration}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{emergency.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Affected Population
                      </h4>
                      <p className="text-2xl font-bold text-orange-600">
                        {emergency.affectedPopulation.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Risk Assessment
                      </h4>
                      <div className="flex items-center gap-2">
                        <Progress value={emergency.aiRiskScore} className="flex-1 h-2" />
                        <span className="text-sm font-bold">{emergency.aiRiskScore}%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </h4>
                      <p className="text-lg font-medium">{emergency.estimatedDuration}</p>
                    </div>
                  </div>

                  {/* Impact Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Immediate Impact</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        {emergency.predictedImpact.immediate.map((impact, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-red-600">•</span>
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-medium text-orange-800 mb-2">Short Term</h5>
                      <ul className="text-sm text-orange-700 space-y-1">
                        {emergency.predictedImpact.shortTerm.map((impact, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-orange-600">•</span>
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-2">Long Term</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {emergency.predictedImpact.longTerm.map((impact, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-yellow-600">•</span>
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Resource Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium mb-2 text-red-800">Required Resources</h5>
                      <ul className="text-sm space-y-1">
                        {emergency.resources.required.map((resource, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Package className="w-3 h-3 text-red-600" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2 text-green-800">Available Resources</h5>
                      <ul className="text-sm space-y-1">
                        {emergency.resources.available.map((resource, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-green-600" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2 text-orange-800">Resource Deficit</h5>
                      <ul className="text-sm space-y-1">
                        {emergency.resources.deficit.map((resource, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-orange-600" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Siren className="w-4 h-4 mr-2" />
                      Activate Emergency Response
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Crisis Team
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockAIRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className={`border-l-4 ${
                recommendation.priority === 'immediate' ? 'border-l-red-500' :
                recommendation.priority === 'urgent' ? 'border-l-orange-500' :
                recommendation.priority === 'important' ? 'border-l-blue-500' : 'border-l-green-500'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      AI Recommendation
                    </CardTitle>
                    <Badge variant={
                      recommendation.priority === 'immediate' ? 'destructive' :
                      recommendation.priority === 'urgent' ? 'default' : 'secondary'
                    }>
                      {recommendation.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-medium">{recommendation.action}</h3>
                  <p className="text-sm text-muted-foreground">{recommendation.rationale}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estimated Effectiveness</span>
                      <span className="font-bold text-green-600">{recommendation.estimatedEffectiveness}%</span>
                    </div>
                    <Progress value={recommendation.estimatedEffectiveness} className="h-2" />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Resources Needed</h4>
                    <ul className="text-sm space-y-1">
                      {recommendation.resourcesNeeded.map((resource, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Package className="w-3 h-3 text-blue-600" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Success Metrics</h4>
                    <ul className="text-sm space-y-1">
                      {recommendation.successMetrics.map((metric, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-green-600" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      Timeframe: {recommendation.timeframe}
                    </span>
                    <Button size="sm">
                      Implement Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Response Plan */}
        <TabsContent value="response" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Emergency Response Coordination Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Immediate Actions (0-2 hours)</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Radio className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Alert Crisis Team</p>
                        <p className="text-xs text-muted-foreground">Status: Active</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Plane className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Deploy Air Transport</p>
                        <p className="text-xs text-muted-foreground">ETA: 45 minutes</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Mobilize Field Teams</p>
                        <p className="text-xs text-muted-foreground">50 personnel ready</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Short Term (2-24 hours)</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Alternative Routes</p>
                        <p className="text-xs text-muted-foreground">3 routes identified</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Package className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Resource Allocation</p>
                        <p className="text-xs text-muted-foreground">Cross-regional</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Radio className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Stakeholder Updates</p>
                        <p className="text-xs text-muted-foreground">Every 4 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Recovery (24+ hours)</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Home className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Infrastructure Repair</p>
                        <p className="text-xs text-muted-foreground">Long-term plan</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Heart className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">Community Support</p>
                        <p className="text-xs text-muted-foreground">Social programs</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">System Strengthening</p>
                        <p className="text-xs text-muted-foreground">Preventive measures</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Report */}
        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Create Emergency Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Emergency Type</label>
                  <Select value={reportData.type} onValueChange={(value) => setReportData({...reportData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock_critical">Stock Critical</SelectItem>
                      <SelectItem value="weather_extreme">Weather Extreme</SelectItem>
                      <SelectItem value="distribution_blocked">Distribution Blocked</SelectItem>
                      <SelectItem value="system_failure">System Failure</SelectItem>
                      <SelectItem value="social_unrest">Social Unrest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Severity Level</label>
                  <Select value={reportData.severity} onValueChange={(value) => setReportData({...reportData, severity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <Input 
                  value={reportData.location}
                  onChange={(e) => setReportData({...reportData, location: e.target.value})}
                  placeholder="Provinsi, Kabupaten, Kecamatan..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={reportData.description}
                  onChange={(e) => setReportData({...reportData, description: e.target.value})}
                  placeholder="Describe the emergency situation in detail..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Emergency Report
                </Button>
                <Button variant="outline" onClick={runEmergencyAnalysis}>
                  <Brain className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Display */}
          {aiInsights && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Brain className="w-5 h-5" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="text-2xl font-bold text-red-600">{aiInsights.riskScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold text-blue-600">{aiInsights.confidence}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold text-green-600">{aiInsights.responseTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Predicted Outcome</p>
                    <p className="text-sm font-medium text-purple-600">{aiInsights.predictedOutcome}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">AI Recommendations</h4>
                  {aiInsights.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{rec.action}</h5>
                        <Badge variant="destructive">{rec.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.rationale}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}