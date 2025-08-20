import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  Brain, 
  Target, 
  Zap, 
  MapPin, 
  Clock, 
  Package, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  Send,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Activity,
  BarChart3,
  Truck,
  Users,
  Shield,
  Eye,
  Settings,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  Calendar,
  Globe,
  Layers,
  Network,
  Calculator,
  Gauge,
  Sparkles,
  Crosshair
} from 'lucide-react';

interface AllocationData {
  region: string;
  currentStock: number;
  demand: number;
  deficit: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  transportCost: number;
  deliveryTime: number;
  aiRecommendation: {
    allocatedAmount: number;
    source: string;
    confidence: number;
    costOptimization: number;
    timeOptimization: number;
  };
}

interface OptimizationScenario {
  id: string;
  name: string;
  strategy: 'cost' | 'time' | 'balanced' | 'equity';
  totalCost: number;
  avgDeliveryTime: number;
  satisfactionRate: number;
  aiScore: number;
  allocations: AllocationData[];
}

interface PredictiveModel {
  region: string;
  currentWeek: number;
  predictedDemand: number[];
  confidence: number;
  factors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const mockAllocationData: AllocationData[] = [
  {
    region: 'Sulawesi Tengah',
    currentStock: 2500,
    demand: 15000,
    deficit: 12500,
    priority: 'critical',
    transportCost: 2500000,
    deliveryTime: 48,
    aiRecommendation: {
      allocatedAmount: 12500,
      source: 'Sulawesi Selatan + Jawa Timur',
      confidence: 94.5,
      costOptimization: 15.2,
      timeOptimization: 22.8
    }
  },
  {
    region: 'Maluku Utara',
    currentStock: 1800,
    demand: 8500,
    deficit: 6700,
    priority: 'high',
    transportCost: 3200000,
    deliveryTime: 72,
    aiRecommendation: {
      allocatedAmount: 6700,
      source: 'Sulawesi Utara + Papua',
      confidence: 89.3,
      costOptimization: 18.6,
      timeOptimization: 12.4
    }
  },
  {
    region: 'Kalimantan Tengah',
    currentStock: 4200,
    demand: 12000,
    deficit: 7800,
    priority: 'high',
    transportCost: 1800000,
    deliveryTime: 36,
    aiRecommendation: {
      allocatedAmount: 7800,
      source: 'Kalimantan Selatan',
      confidence: 92.1,
      costOptimization: 12.3,
      timeOptimization: 18.9
    }
  },
  {
    region: 'Nusa Tenggara Timur',
    currentStock: 3100,
    demand: 9500,
    deficit: 6400,
    priority: 'medium',
    transportCost: 2200000,
    deliveryTime: 54,
    aiRecommendation: {
      allocatedAmount: 6400,
      source: 'Jawa Timur + Bali',
      confidence: 86.7,
      costOptimization: 14.7,
      timeOptimization: 16.2
    }
  }
];

const mockOptimizationScenarios: OptimizationScenario[] = [
  {
    id: 'cost_optimal',
    name: 'Cost Optimization',
    strategy: 'cost',
    totalCost: 8500000,
    avgDeliveryTime: 52,
    satisfactionRate: 87.3,
    aiScore: 91.2,
    allocations: mockAllocationData
  },
  {
    id: 'time_optimal',
    name: 'Time Optimization',
    strategy: 'time',
    totalCost: 12200000,
    avgDeliveryTime: 38,
    satisfactionRate: 94.1,
    aiScore: 88.7,
    allocations: mockAllocationData
  },
  {
    id: 'balanced',
    name: 'Balanced Strategy',
    strategy: 'balanced',
    totalCost: 9800000,
    avgDeliveryTime: 45,
    satisfactionRate: 91.6,
    aiScore: 95.4,
    allocations: mockAllocationData
  },
  {
    id: 'equity_focus',
    name: 'Equity Focus',
    strategy: 'equity',
    totalCost: 11000000,
    avgDeliveryTime: 48,
    satisfactionRate: 96.2,
    aiScore: 89.8,
    allocations: mockAllocationData
  }
];

const mockPredictiveModels: PredictiveModel[] = [
  {
    region: 'Sulawesi Tengah',
    currentWeek: 28,
    predictedDemand: [15000, 16200, 14800, 17500, 16800, 15200, 14500, 16900],
    confidence: 94.5,
    factors: ['Musim tanam peak', 'Cuaca ekstrem', 'Program pemerintah'],
    riskLevel: 'high'
  },
  {
    region: 'Maluku Utara',
    currentWeek: 28,
    predictedDemand: [8500, 9200, 8800, 9600, 8900, 8400, 8700, 9100],
    confidence: 89.3,
    factors: ['Siklus tanam normal', 'Transportasi terbatas', 'Cuaca stabil'],
    riskLevel: 'medium'
  },
  {
    region: 'Kalimantan Tengah',
    currentWeek: 28,
    predictedDemand: [12000, 11800, 12400, 12200, 11600, 12800, 12300, 11900],
    confidence: 92.1,
    factors: ['Expansion area', 'Good infrastructure', 'Stable weather'],
    riskLevel: 'low'
  }
];

const allocationFlowData = [
  { week: 'W25', allocated: 45000, delivered: 42000, pending: 3000, efficiency: 93.3 },
  { week: 'W26', allocated: 48000, delivered: 46200, pending: 1800, efficiency: 96.3 },
  { week: 'W27', allocated: 52000, delivered: 49800, pending: 2200, efficiency: 95.8 },
  { week: 'W28', allocated: 55000, delivered: 52500, pending: 2500, efficiency: 95.5 },
  { week: 'W29', allocated: 58000, delivered: 55800, pending: 2200, efficiency: 96.2 },
  { week: 'W30', allocated: 60000, delivered: 58200, pending: 1800, efficiency: 97.0 }
];

const regionPerformanceData = [
  { region: 'Jawa', performance: 95, allocation: 2800000, satisfaction: 96 },
  { region: 'Sumatera', performance: 92, allocation: 2200000, satisfaction: 94 },
  { region: 'Kalimantan', performance: 88, allocation: 1800000, satisfaction: 89 },
  { region: 'Sulawesi', performance: 85, allocation: 1500000, satisfaction: 87 },
  { region: 'Papua', performance: 78, allocation: 800000, satisfaction: 82 },
  { region: 'Maluku', performance: 82, allocation: 600000, satisfaction: 85 }
];

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function AIEmergencyAllocationAnalysis() {
  const [selectedScenario, setSelectedScenario] = useState<string>('balanced');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [optimizationParameters, setOptimizationParameters] = useState({
    costWeight: 40,
    timeWeight: 30,
    equityWeight: 20,
    sustainabilityWeight: 10
  });
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const runOptimization = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setAiInsights({
      totalReallocation: 33400,
      costSavings: 1200000,
      timeImprovement: 8.5,
      satisfactionIncrease: 4.2,
      riskReduction: 15.7,
      recommendedActions: [
        'Realokasi 12.5K ton dari Jawa Timur ke Sulawesi Tengah',
        'Aktivasi jalur udara untuk Maluku Utara',
        'Koordinasi dengan distributor regional Kalimantan',
        'Buffer stock adjustment untuk NTT'
      ]
    });
    
    setIsOptimizing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'cost': return <Calculator className="w-4 h-4" />;
      case 'time': return <Clock className="w-4 h-4" />;
      case 'balanced': return <Target className="w-4 h-4" />;
      case 'equity': return <Users className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time data updates
        console.log('Refreshing allocation data...');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            AI Emergency Allocation Analysis
          </h1>
          <p className="text-muted-foreground">
            Optimisasi alokasi darurat pupuk bersubsidi menggunakan algoritma AI canggih
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              AI Optimization Engine Active - Real-time Analysis
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runOptimization} 
            disabled={isOptimizing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Run AI Optimization
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
        </div>
      </div>

      {/* AI Processing Indicator */}
      {isOptimizing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">AI Allocation Optimization in Progress</h3>
                <p className="text-sm text-blue-700">
                  Analyzing demand patterns, transport costs, delivery times, and resource constraints...
                </p>
                <Progress value={85} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">AI Dashboard</TabsTrigger>
          <TabsTrigger value="scenarios">Optimization Scenarios</TabsTrigger>
          <TabsTrigger value="allocation">Real-time Allocation</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        {/* AI Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Deficit</p>
                    <p className="text-2xl font-bold text-blue-600">33.4K Ton</p>
                    <p className="text-xs text-muted-foreground mt-1">Across 4 regions</p>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-blue-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600">+12% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Optimization Score</p>
                    <p className="text-2xl font-bold text-green-600">95.4%</p>
                    <p className="text-xs text-muted-foreground mt-1">Efficiency rating</p>
                  </div>
                  <Brain className="w-12 h-12 text-green-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">+2.3% improvement</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Optimization</p>
                    <p className="text-2xl font-bold text-orange-600">Rp 1.2M</p>
                    <p className="text-xs text-muted-foreground mt-1">Potential savings</p>
                  </div>
                  <Calculator className="w-12 h-12 text-orange-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">-12.2% reduction</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold text-purple-600">45 Hours</p>
                    <p className="text-xs text-muted-foreground mt-1">Average delivery</p>
                  </div>
                  <Clock className="w-12 h-12 text-purple-600" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">-8.5 hours faster</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Allocation Flow Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                AI-Powered Allocation Flow Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={allocationFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'efficiency') return [`${value}%`, 'Efficiency'];
                      return [`${(value as number).toLocaleString()} ton`, name];
                    }}
                  />
                  <Line type="monotone" dataKey="allocated" stroke="#3b82f6" strokeWidth={3} name="Allocated" />
                  <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={3} name="Delivered" />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Regional Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Regional Performance Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={regionPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="allocation" name="Allocation" unit=" ton" />
                  <YAxis dataKey="performance" name="Performance" unit="%" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Regions" dataKey="satisfaction" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Scenarios */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {mockOptimizationScenarios.map((scenario) => (
              <Card 
                key={scenario.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedScenario === scenario.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStrategyIcon(scenario.strategy)}
                      {scenario.name}
                    </CardTitle>
                    <Badge variant={selectedScenario === scenario.id ? "default" : "secondary"}>
                      AI Score: {scenario.aiScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-lg font-bold text-blue-600">
                        Rp {(scenario.totalCost / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Delivery</p>
                      <p className="text-lg font-bold text-green-600">
                        {scenario.avgDeliveryTime}h
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Satisfaction Rate</span>
                      <span className="text-sm font-bold">{scenario.satisfactionRate}%</span>
                    </div>
                    <Progress value={scenario.satisfactionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">AI Optimization Score</span>
                      <span className="text-sm font-bold">{scenario.aiScore}%</span>
                    </div>
                    <Progress value={scenario.aiScore} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={selectedScenario !== scenario.id}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Implement
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Real-time Allocation */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="space-y-6">
            {mockAllocationData.map((allocation, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {allocation.region}
                          <Badge className={`${getPriorityColor(allocation.priority)} text-white`}>
                            {allocation.priority.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI Confidence: {allocation.aiRecommendation.confidence}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Deficit</p>
                      <p className="text-xl font-bold text-red-600">
                        {allocation.deficit.toLocaleString()} ton
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Current Stock
                      </h4>
                      <p className="text-lg font-bold text-blue-600">
                        {allocation.currentStock.toLocaleString()} ton
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Demand
                      </h4>
                      <p className="text-lg font-bold text-orange-600">
                        {allocation.demand.toLocaleString()} ton
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Transport Cost
                      </h4>
                      <p className="text-lg font-bold text-purple-600">
                        Rp {(allocation.transportCost / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Delivery Time
                      </h4>
                      <p className="text-lg font-bold text-green-600">
                        {allocation.deliveryTime}h
                      </p>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-800">
                      <Brain className="w-4 h-4" />
                      AI Recommendation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Allocated Amount</p>
                        <p className="text-lg font-bold text-blue-600">
                          {allocation.aiRecommendation.allocatedAmount.toLocaleString()} ton
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Source Regions</p>
                        <p className="text-sm font-medium text-blue-800">
                          {allocation.aiRecommendation.source}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Cost Optimization</p>
                        <p className="text-sm font-bold text-green-600">
                          -{allocation.aiRecommendation.costOptimization}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Time Optimization</p>
                        <p className="text-sm font-bold text-green-600">
                          -{allocation.aiRecommendation.timeOptimization}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve AI Recommendation
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Modify Parameters
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Predictive Analysis */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="space-y-6">
            {mockPredictiveModels.map((model, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Predictive Demand Analysis - {model.region}
                    <Badge variant={model.riskLevel === 'high' ? 'destructive' : 
                                  model.riskLevel === 'medium' ? 'default' : 'secondary'}>
                      {model.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">8-Week Demand Forecast</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={model.predictedDemand.map((demand, idx) => ({
                          week: `W${model.currentWeek + idx}`,
                          demand: demand,
                          confidence: model.confidence
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">AI Confidence Level</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={model.confidence} className="flex-1 h-2" />
                          <span className="text-sm font-bold">{model.confidence}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Influencing Factors</h4>
                        <ul className="space-y-1">
                          {model.factors.map((factor, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Peak Demand Prediction</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.max(...model.predictedDemand).toLocaleString()} ton
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Week {model.currentWeek + model.predictedDemand.indexOf(Math.max(...model.predictedDemand))}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Analytics */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-green-600" />
                Regional Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                  <Bar dataKey="satisfaction" fill="#10b981" name="Satisfaction %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Allocation Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">94.7%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    AI predictions vs actual demand
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+3.2% this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange-600" />
                  Cost Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">87.3%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cost optimization vs baseline
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+5.1% improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Delivery Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">91.8%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    On-time delivery rate
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+2.7% this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                AI Optimization Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Optimization Weights</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Cost Optimization: {optimizationParameters.costWeight}%</label>
                      <Slider
                        value={[optimizationParameters.costWeight]}
                        onValueChange={(value) => setOptimizationParameters({
                          ...optimizationParameters,
                          costWeight: value[0]
                        })}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time Optimization: {optimizationParameters.timeWeight}%</label>
                      <Slider
                        value={[optimizationParameters.timeWeight]}
                        onValueChange={(value) => setOptimizationParameters({
                          ...optimizationParameters,
                          timeWeight: value[0]
                        })}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Equity Weight: {optimizationParameters.equityWeight}%</label>
                      <Slider
                        value={[optimizationParameters.equityWeight]}
                        onValueChange={(value) => setOptimizationParameters({
                          ...optimizationParameters,
                          equityWeight: value[0]
                        })}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sustainability: {optimizationParameters.sustainabilityWeight}%</label>
                      <Slider
                        value={[optimizationParameters.sustainabilityWeight]}
                        onValueChange={(value) => setOptimizationParameters({
                          ...optimizationParameters,
                          sustainabilityWeight: value[0]
                        })}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Advanced Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-refresh Data</span>
                      <input 
                        type="checkbox" 
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="rounded" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time AI Updates</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emergency Alert System</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Predictive Learning</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Apply Settings
                </Button>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Display */}
          {aiInsights && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Sparkles className="w-5 h-5" />
                  AI Optimization Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Reallocation</p>
                    <p className="text-xl font-bold text-green-600">{aiInsights.totalReallocation.toLocaleString()} ton</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Cost Savings</p>
                    <p className="text-xl font-bold text-blue-600">Rp {(aiInsights.costSavings / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Time Improvement</p>
                    <p className="text-xl font-bold text-purple-600">-{aiInsights.timeImprovement}h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Satisfaction Increase</p>
                    <p className="text-xl font-bold text-orange-600">+{aiInsights.satisfactionIncrease}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Recommended Actions</h4>
                  {aiInsights.recommendedActions.map((action: string, idx: number) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{action}</span>
                      </div>
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