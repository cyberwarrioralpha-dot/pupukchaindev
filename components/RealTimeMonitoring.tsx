import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Gauge, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Signal,
  Wifi,
  WifiOff,
  Eye,
  Settings,
  RefreshCw,
  Bell,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Download,
  Filter,
  Maximize2,
  Volume2,
  VolumeX,
  Monitor,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Wind,
  Droplets,
  Flame,
  ShieldAlert,
  Target,
  BarChart3,
  Layers
} from 'lucide-react';

interface SensorData {
  id: string;
  name: string;
  type: 'temperature' | 'pressure' | 'flow' | 'level' | 'ph' | 'moisture' | 'vibration';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  location: string;
  lastUpdate: Date;
  threshold: {
    min: number;
    max: number;
    warning: number;
  };
}

interface EquipmentStatus {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'maintenance' | 'error';
  efficiency: number;
  temperature: number;
  runtime: number; // hours
  nextMaintenance: Date;
  alerts: number;
}

interface ProductionLine {
  id: string;
  name: string;
  product: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  currentRate: number; // tons per hour
  targetRate: number;
  quality: number; // percentage
  operators: number;
  shift: string;
  startTime: Date;
}

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  equipment: string;
  timestamp: Date;
  acknowledged: boolean;
}

// Mock real-time data generators
const generateSensorData = (): SensorData[] => {
  const baseTime = new Date();
  return [
    {
      id: 'temp-001',
      name: 'Reactor Temperature',
      type: 'temperature',
      value: 85 + Math.random() * 10,
      unit: '°C',
      status: Math.random() > 0.1 ? 'normal' : 'warning',
      location: 'Reactor A',
      lastUpdate: baseTime,
      threshold: { min: 70, max: 100, warning: 95 }
    },
    {
      id: 'press-001',
      name: 'Steam Pressure',
      type: 'pressure',
      value: 8.5 + Math.random() * 2,
      unit: 'bar',
      status: Math.random() > 0.05 ? 'normal' : 'critical',
      location: 'Boiler 1',
      lastUpdate: baseTime,
      threshold: { min: 6, max: 12, warning: 11 }
    },
    {
      id: 'flow-001',
      name: 'Ammonia Flow',
      type: 'flow',
      value: 150 + Math.random() * 50,
      unit: 'L/min',
      status: 'normal',
      location: 'Feed Line',
      lastUpdate: baseTime,
      threshold: { min: 100, max: 250, warning: 220 }
    },
    {
      id: 'level-001',
      name: 'Storage Tank Level',
      type: 'level',
      value: 75 + Math.random() * 20,
      unit: '%',
      status: 'normal',
      location: 'Tank A',
      lastUpdate: baseTime,
      threshold: { min: 10, max: 95, warning: 90 }
    },
    {
      id: 'ph-001',
      name: 'Solution pH',
      type: 'ph',
      value: 7.2 + Math.random() * 0.6,
      unit: 'pH',
      status: 'normal',
      location: 'Mixing Tank',
      lastUpdate: baseTime,
      threshold: { min: 6.5, max: 8.5, warning: 8.0 }
    },
    {
      id: 'moist-001',
      name: 'Product Moisture',
      type: 'moisture',
      value: 2.1 + Math.random() * 0.8,
      unit: '%',
      status: 'normal',
      location: 'Dryer Output',
      lastUpdate: baseTime,
      threshold: { min: 1.0, max: 4.0, warning: 3.5 }
    }
  ];
};

const mockEquipment: EquipmentStatus[] = [
  {
    id: 'eq-001',
    name: 'Rotary Kiln #1',
    type: 'Kiln',
    status: 'running',
    efficiency: 92,
    temperature: 850,
    runtime: 247,
    nextMaintenance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    alerts: 0
  },
  {
    id: 'eq-002',
    name: 'Crusher Unit #2',
    type: 'Crusher',
    status: 'running',
    efficiency: 88,
    temperature: 45,
    runtime: 156,
    nextMaintenance: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    alerts: 1
  },
  {
    id: 'eq-003',
    name: 'Conveyor Belt #3',
    type: 'Conveyor',
    status: 'maintenance',
    efficiency: 0,
    temperature: 25,
    runtime: 0,
    nextMaintenance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    alerts: 3
  },
  {
    id: 'eq-004',
    name: 'Granulator #1',
    type: 'Granulator',
    status: 'running',
    efficiency: 95,
    temperature: 180,
    runtime: 89,
    nextMaintenance: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    alerts: 0
  }
];

const mockProductionLines: ProductionLine[] = [
  {
    id: 'line-001',
    name: 'Production Line 1',
    product: 'Urea 46%',
    status: 'active',
    currentRate: 12.5,
    targetRate: 12.0,
    quality: 98.5,
    operators: 4,
    shift: 'Day Shift',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: 'line-002',
    name: 'Production Line 2',
    product: 'NPK 15-15-15',
    status: 'active',
    currentRate: 8.2,
    targetRate: 8.5,
    quality: 97.8,
    operators: 3,
    shift: 'Day Shift',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 'line-003',
    name: 'Production Line 3',
    product: 'ZA 21%',
    status: 'maintenance',
    currentRate: 0,
    targetRate: 10.0,
    quality: 0,
    operators: 2,
    shift: 'Day Shift',
    startTime: new Date()
  },
  {
    id: 'line-004',
    name: 'Production Line 4',
    product: 'SP-36',
    status: 'idle',
    currentRate: 0,
    targetRate: 6.0,
    quality: 0,
    operators: 1,
    shift: 'Day Shift',
    startTime: new Date()
  }
];

// Generate historical data for charts
const generateHistoricalData = (hours: number = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      temperature: 85 + Math.random() * 15,
      pressure: 8 + Math.random() * 3,
      production: 11 + Math.random() * 3,
      efficiency: 88 + Math.random() * 10,
      quality: 96 + Math.random() * 4
    });
  }
  
  return data;
};

export function RealTimeMonitoring() {
  const [sensors, setSensors] = useState<SensorData[]>(generateSensorData());
  const [equipment] = useState<EquipmentStatus[]>(mockEquipment);
  const [productionLines] = useState<ProductionLine[]>(mockProductionLines);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [historicalData] = useState(generateHistoricalData());

  // Real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSensors(generateSensorData());
      setRefreshTime(new Date());
      
      // Generate random alerts
      if (Math.random() > 0.95) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: Math.random() > 0.7 ? 'critical' : 'warning',
          message: 'Temperature exceeded threshold in Reactor A',
          equipment: 'Reactor A',
          timestamp: new Date(),
          acknowledged: false
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
        
        if (soundEnabled) {
          // Would play sound in real implementation
          console.log('🔔 Alert sound');
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, soundEnabled]);

  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-4 h-4" />;
      case 'pressure': return <Gauge className="w-4 h-4" />;
      case 'flow': return <Activity className="w-4 h-4" />;
      case 'level': return <BarChart3 className="w-4 h-4" />;
      case 'ph': return <Droplets className="w-4 h-4" />;
      case 'moisture': return <Wind className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-gray-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLineStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;
  const warningAlerts = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Monitor className="w-8 h-8 text-blue-600" />
            Real-Time Monitoring
          </h1>
          <p className="text-muted-foreground">
            Monitor operasional produksi secara real-time dengan sensor IoT dan analitik prediktif
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isLive ? 'LIVE' : 'PAUSED'} - Update terakhir: {refreshTime.toLocaleTimeString('id-ID')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLive ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {(criticalAlerts > 0 || warningAlerts > 0) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">
                {criticalAlerts > 0 && `${criticalAlerts} Critical Alert${criticalAlerts > 1 ? 's' : ''}`}
                {criticalAlerts > 0 && warningAlerts > 0 && ', '}
                {warningAlerts > 0 && `${warningAlerts} Warning${warningAlerts > 1 ? 's' : ''}`}
              </span>
            </div>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View All Alerts
            </Button>
          </div>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Lines</p>
                <p className="text-2xl font-bold text-green-600">
                  {productionLines.filter(l => l.status === 'active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(equipment.reduce((acc, eq) => acc + eq.efficiency, 0) / equipment.length)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sensors Online</p>
                <p className="text-2xl font-bold text-purple-600">
                  {sensors.filter(s => s.status !== 'offline').length}/{sensors.length}
                </p>
              </div>
              <Signal className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold text-orange-600">
                  {alerts.filter(a => !a.acknowledged).length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Due</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {equipment.filter(eq => eq.nextMaintenance < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Production Rate & Temperature</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Live Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="production" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Production Rate (t/h)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency & Quality Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Efficiency (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="quality" 
                  stackId="2"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="Quality (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Sensor Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live Sensor Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => (
              <Card key={sensor.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getSensorIcon(sensor.type)}
                    <h4 className="font-medium">{sensor.name}</h4>
                  </div>
                  <Badge className={getSensorStatusColor(sensor.status)}>
                    {sensor.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {sensor.value.toFixed(1)} {sensor.unit}
                    </span>
                    {sensor.status === 'normal' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {sensor.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                    {sensor.status === 'critical' && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {sensor.location} • {sensor.lastUpdate.toLocaleTimeString('id-ID')}
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        sensor.status === 'normal' ? 'bg-green-500' :
                        sensor.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (sensor.value / sensor.threshold.max) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Range: {sensor.threshold.min}-{sensor.threshold.max} {sensor.unit}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production Lines Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Production Lines Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionLines.map((line) => (
              <div key={line.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getEquipmentStatusColor(line.status)}`}></div>
                  <div>
                    <h4 className="font-medium">{line.name}</h4>
                    <p className="text-sm text-muted-foreground">{line.product}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="font-bold">
                      {line.currentRate.toFixed(1)} / {line.targetRate.toFixed(1)} t/h
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Quality</p>
                    <p className="font-bold">{line.quality.toFixed(1)}%</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Operators</p>
                    <p className="font-bold">{line.operators}</p>
                  </div>
                  
                  <Badge className={getLineStatusColor(line.status)}>
                    {line.status.toUpperCase()}
                  </Badge>
                  
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Equipment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipment.map((eq) => (
              <Card key={eq.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getEquipmentStatusColor(eq.status)}`}></div>
                    <h4 className="font-medium">{eq.name}</h4>
                  </div>
                  {eq.alerts > 0 && (
                    <Badge variant="destructive">{eq.alerts} alerts</Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Efficiency:</span>
                    <span className="font-bold">{eq.efficiency}%</span>
                  </div>
                  <Progress value={eq.efficiency} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Temperature:</span>
                      <p className="font-bold">{eq.temperature}°C</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Runtime:</span>
                      <p className="font-bold">{eq.runtime}h</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Next maintenance: {eq.nextMaintenance.toLocaleDateString('id-ID')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <p>No active alerts</p>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    alert.acknowledged ? 'bg-gray-50' : 
                    alert.type === 'critical' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {alert.type === 'critical' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.equipment} • {alert.timestamp.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  {!alert.acknowledged && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}