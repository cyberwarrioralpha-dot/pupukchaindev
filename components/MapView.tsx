import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { IndonesiaMap } from './IndonesiaMap';
import { 
  MapPin, 
  Warehouse, 
  Truck, 
  Package, 
  Eye,
  EyeOff,
  Filter,
  Search,
  Layers
} from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  type: 'warehouse' | 'kios' | 'distributor';
  lat: number;
  lng: number;
  stock?: number;
  status: 'active' | 'inactive' | 'warning';
  province: string;
  city: string;
}

interface DistributionRoute {
  id: string;
  from: string;
  to: string;
  status: 'active' | 'completed' | 'pending';
  amount: number;
  fertilizer: string;
}

const mockLocations: MapLocation[] = [
  {
    id: '1',
    name: 'Gudang Pusat Jakarta',
    type: 'warehouse',
    lat: -6.2088,
    lng: 106.8456,
    stock: 15420,
    status: 'active',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat'
  },
  {
    id: '2',
    name: 'Distributor Surabaya',
    type: 'distributor',
    lat: -7.2575,
    lng: 112.7521,
    stock: 8750,
    status: 'active',
    province: 'Jawa Timur',
    city: 'Surabaya'
  },
  {
    id: '3',
    name: 'Kios Tani Malang',
    type: 'kios',
    lat: -7.9666,
    lng: 112.6326,
    stock: 245,
    status: 'warning',
    province: 'Jawa Timur',
    city: 'Malang'
  },
  {
    id: '4',
    name: 'Gudang Regional Medan',
    type: 'warehouse',
    lat: 3.5952,
    lng: 98.6722,
    stock: 12500,
    status: 'active',
    province: 'Sumatera Utara',
    city: 'Medan'
  },
  {
    id: '5',
    name: 'Kios Tani Bandung',
    type: 'kios',
    lat: -6.9175,
    lng: 107.6191,
    stock: 180,
    status: 'active',
    province: 'Jawa Barat',
    city: 'Bandung'
  },
  {
    id: '6',
    name: 'Distributor Makassar',
    type: 'distributor',
    lat: -5.1477,
    lng: 119.4327,
    stock: 4200,
    status: 'active',
    province: 'Sulawesi Selatan',
    city: 'Makassar'
  },
  {
    id: '7',
    name: 'Kios Tani Denpasar',
    type: 'kios',
    lat: -8.6705,
    lng: 115.2126,
    stock: 320,
    status: 'active',
    province: 'Bali',
    city: 'Denpasar'
  },
  {
    id: '8',
    name: 'Gudang Regional Balikpapan',
    type: 'warehouse',
    lat: -1.2379,
    lng: 116.8529,
    stock: 6800,
    status: 'warning',
    province: 'Kalimantan Timur',
    city: 'Balikpapan'
  }
];

const mockRoutes: DistributionRoute[] = [
  {
    id: '1',
    from: 'Gudang Pusat Jakarta',
    to: 'Distributor Surabaya',
    status: 'active',
    amount: 500,
    fertilizer: 'Urea'
  },
  {
    id: '2',
    from: 'Distributor Surabaya',
    to: 'Kios Tani Malang',
    status: 'pending',
    amount: 50,
    fertilizer: 'NPK'
  },
  {
    id: '3',
    from: 'Gudang Regional Medan',
    to: 'Kios Tani Bandung',
    status: 'completed',
    amount: 80,
    fertilizer: 'TSP'
  }
];

const provincesData = [
  {
    id: 'jakarta',
    name: 'DKI Jakarta',
    path: 'M90,165 L95,160 L100,165 L95,170 Z',
    center: { x: 96, y: 165 },
    absorption: 85,
    target: 120,
    percentage: 71,
    status: 'medium' as const
  },
  {
    id: 'jatim',
    name: 'Jawa Timur',
    path: 'M150,185 L185,180 L190,195 L175,200 L150,195 Z',
    center: { x: 170, y: 190 },
    absorption: 1250,
    target: 1400,
    percentage: 89,
    status: 'high' as const
  },
  {
    id: 'jabar',
    name: 'Jawa Barat',
    path: 'M95,170 L120,165 L125,175 L110,180 L85,180 Z',
    center: { x: 105, y: 172 },
    absorption: 850,
    target: 1200,
    percentage: 71,
    status: 'medium' as const
  },
  {
    id: 'sumut',
    name: 'Sumatera Utara',
    path: 'M45,90 L75,85 L80,100 L70,110 L50,105 Z',
    center: { x: 62, y: 98 },
    absorption: 520,
    target: 700,
    percentage: 74,
    status: 'medium' as const
  },
  {
    id: 'sulsel',
    name: 'Sulawesi Selatan',
    path: 'M190,140 L215,145 L220,165 L205,175 L185,165 Z',
    center: { x: 202, y: 155 },
    absorption: 280,
    target: 450,
    percentage: 62,
    status: 'medium' as const
  },
  {
    id: 'bali',
    name: 'Bali',
    path: 'M190,195 L200,190 L205,200 L195,205 Z',
    center: { x: 197, y: 197 },
    absorption: 180,
    target: 250,
    percentage: 72,
    status: 'medium' as const
  },
  {
    id: 'kaltim',
    name: 'Kalimantan Timur',
    path: 'M155,140 L180,135 L185,155 L170,160 L160,160 Z',
    center: { x: 170, y: 150 },
    absorption: 180,
    target: 400,
    percentage: 45,
    status: 'low' as const
  }
];

export function MapView() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    warehouses: true,
    distributors: true,
    kios: true,
    routes: true
  });
  const [filterProvince, setFilterProvince] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const provinces = Array.from(new Set(mockLocations.map(loc => loc.province)));

  const filteredLocations = mockLocations.filter(location => {
    const matchesProvince = filterProvince === 'all' || location.province === filterProvince;
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const isVisible = visibleLayers[location.type === 'warehouse' ? 'warehouses' : 
                                  location.type === 'distributor' ? 'distributors' : 'kios'];
    return matchesProvince && matchesSearch && isVisible;
  });

  const getMarkerIcon = (type: string, status: string) => {
    switch (type) {
      case 'warehouse':
        return <Warehouse className={`h-6 w-6 ${status === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />;
      case 'distributor':
        return <Truck className={`h-6 w-6 ${status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`} />;
      case 'kios':
        return <MapPin className={`h-6 w-6 ${status === 'warning' ? 'text-yellow-500' : 'text-purple-500'}`} />;
      default:
        return <MapPin className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Peringatan</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Tidak Aktif</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const convertLatLngToMapPosition = (lat: number, lng: number) => {
    // Convert lat/lng to map coordinates (simplified)
    const x = ((lng + 140) / 40) * 100;
    const y = ((-lat + 15) / 30) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handleProvinceClick = (province: any) => {
    setSelectedProvince(province);
    setSelectedLocation(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pemetaan Distribusi Pupuk</h1>
          <p className="text-muted-foreground">
            Visualisasi geografis distribusi pupuk dan lokasi kios tani
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cari Lokasi</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari gudang, kios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filter Provinsi</label>
          <Select value={filterProvince} onValueChange={setFilterProvince}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Provinsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {provinces.map(province => (
                <SelectItem key={province} value={province}>{province}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Layer Tampilan</span>
              <Layers className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              {Object.entries(visibleLayers).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleLayers(prev => ({ ...prev, [key]: !value }))}
                    className="h-6 px-2"
                  >
                    {value ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <span className="text-xs capitalize">
                    {key === 'warehouses' ? 'Gudang' : 
                     key === 'distributors' ? 'Distributor' :
                     key === 'kios' ? 'Kios' : 'Rute'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Statistik</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Total Lokasi:</span>
                <span className="font-medium">{filteredLocations.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Gudang:</span>
                <span className="font-medium">
                  {filteredLocations.filter(l => l.type === 'warehouse').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Distributor:</span>
                <span className="font-medium">
                  {filteredLocations.filter(l => l.type === 'distributor').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kios:</span>
                <span className="font-medium">
                  {filteredLocations.filter(l => l.type === 'kios').length}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Peta Distribusi</CardTitle>
            <CardDescription>
              Klik pada marker atau provinsi untuk melihat detail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
              <IndonesiaMap
                provinces={provincesData}
                onProvinceClick={handleProvinceClick}
                className="w-full h-full"
              />
              
              {/* Location Markers */}
              {filteredLocations.map((location) => {
                const position = convertLatLngToMapPosition(location.lat, location.lng);
                return (
                  <div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-20"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`
                    }}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="bg-white rounded-full p-2 shadow-lg border-2 border-white hover:shadow-xl">
                      {getMarkerIcon(location.type, location.status)}
                    </div>
                    {location.status === 'warning' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    {/* Location label */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                      {location.name}
                    </div>
                  </div>
                );
              })}

              {/* Routes */}
              {visibleLayers.routes && mockRoutes.map((route, index) => (
                <div
                  key={route.id}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Simplified route line */}
                  <div 
                    className="absolute bg-blue-400 opacity-60 rounded"
                    style={{
                      top: '45%',
                      left: `${20 + index * 10}%`,
                      width: '30%',
                      height: '2px',
                      transform: 'rotate(-15deg)'
                    }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-blue-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Lokasi</CardTitle>
            <CardDescription>
              {selectedLocation ? 'Informasi lokasi terpilih' : 
               selectedProvince ? 'Informasi provinsi terpilih' : 
               'Pilih marker atau provinsi di peta'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedLocation ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  {getMarkerIcon(selectedLocation.type, selectedLocation.status)}
                  <div className="flex-1">
                    <h3 className="font-medium">{selectedLocation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.city}, {selectedLocation.province}
                    </p>
                  </div>
                  {getStatusBadge(selectedLocation.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Jenis:</span>
                    <span className="font-medium capitalize">
                      {selectedLocation.type === 'warehouse' ? 'Gudang' :
                       selectedLocation.type === 'distributor' ? 'Distributor' : 'Kios Tani'}
                    </span>
                  </div>
                  {selectedLocation.stock && (
                    <div className="flex justify-between text-sm">
                      <span>Stok:</span>
                      <span className="font-medium">{selectedLocation.stock.toLocaleString()} ton</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Koordinat:</span>
                    <span className="font-medium">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Lihat Detail Stok
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Truck className="h-4 w-4 mr-2" />
                    Buat Distribusi
                  </Button>
                </div>
              </div>
            ) : selectedProvince ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  <div className="flex-1">
                    <h3 className="font-medium">{selectedProvince.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Provinsi dengan {selectedProvince.absorption.toLocaleString()} ton penyerapan
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Penyerapan:</span>
                    <span className="font-medium">{selectedProvince.absorption.toLocaleString()} ton</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target:</span>
                    <span className="font-medium">{selectedProvince.target.toLocaleString()} ton</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Persentase:</span>
                    <span className="font-medium">{selectedProvince.percentage}%</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Lihat Detail Provinsi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Klik pada marker atau provinsi di peta untuk melihat detail</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Routes */}
      {visibleLayers.routes && (
        <Card>
          <CardHeader>
            <CardTitle>Rute Distribusi Aktif</CardTitle>
            <CardDescription>
              Monitor perjalanan pupuk yang sedang berlangsung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRoutes.map((route) => (
                <div key={route.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Truck className="h-8 w-8 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{route.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{route.to}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {route.amount} ton {route.fertilizer}
                    </p>
                  </div>
                  <Badge 
                    variant={route.status === 'active' ? 'default' : 
                            route.status === 'completed' ? 'secondary' : 'outline'}
                  >
                    {route.status === 'active' ? 'Dalam Perjalanan' :
                     route.status === 'completed' ? 'Selesai' : 'Menunggu'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}