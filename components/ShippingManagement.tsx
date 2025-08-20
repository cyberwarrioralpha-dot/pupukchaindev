import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Plus,
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Search,
  Calendar,
  Route
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface Shipment {
  id: string;
  shipmentNumber: string;
  batchIds: string[];
  destination: string;
  destinationType: 'gudang_lini_1' | 'gudang_lini_2' | 'distributor';
  driver: string;
  vehicle: string;
  plateNumber: string;
  departureDate: Date;
  estimatedArrival: Date;
  actualArrival?: Date;
  status: 'persiapan' | 'dalam_perjalanan' | 'tiba' | 'selesai' | 'delayed';
  totalWeight: number;
  notes?: string;
  trackingData: TrackingPoint[];
}

interface TrackingPoint {
  id: string;
  timestamp: Date;
  location: string;
  status: string;
  notes?: string;
}

interface ShipmentForm {
  batchIds: string[];
  destination: string;
  destinationType: 'gudang_lini_1' | 'gudang_lini_2' | 'distributor';
  driver: string;
  vehicle: string;
  plateNumber: string;
  departureDate: string;
  estimatedArrival: string;
  notes: string;
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    shipmentNumber: 'SHIP-20250114-001',
    batchIds: ['BATCH-U-20250114-001'],
    destination: 'Gudang Pusat Jakarta',
    destinationType: 'gudang_lini_1',
    driver: 'Budi Santoso',
    vehicle: 'Truck Fuso',
    plateNumber: 'B 1234 AB',
    departureDate: new Date('2025-01-14T08:00:00'),
    estimatedArrival: new Date('2025-01-14T14:00:00'),
    status: 'dalam_perjalanan',
    totalWeight: 500,
    notes: 'Pengiriman rutin ke gudang pusat',
    trackingData: [
      {
        id: '1',
        timestamp: new Date('2025-01-14T08:00:00'),
        location: 'Pabrik PT Pupuk Indonesia',
        status: 'Berangkat',
        notes: 'Truck telah dimuat dan berangkat sesuai jadwal'
      },
      {
        id: '2',
        timestamp: new Date('2025-01-14T10:30:00'),
        location: 'Rest Area KM 45',
        status: 'Transit',
        notes: 'Istirahat driver sesuai prosedur'
      }
    ]
  },
  {
    id: '2',
    shipmentNumber: 'SHIP-20250114-002',
    batchIds: ['BATCH-N-20250114-002'],
    destination: 'Gudang Regional Surabaya',
    destinationType: 'gudang_lini_2',
    driver: 'Siti Aminah',
    vehicle: 'Truck Hino',
    plateNumber: 'L 5678 CD',
    departureDate: new Date('2025-01-14T09:00:00'),
    estimatedArrival: new Date('2025-01-14T18:00:00'),
    status: 'persiapan',
    totalWeight: 400,
    notes: 'Pengiriman ke gudang regional',
    trackingData: [
      {
        id: '1',
        timestamp: new Date('2025-01-14T09:00:00'),
        location: 'Pabrik PT Pupuk Indonesia',
        status: 'Persiapan',
        notes: 'Proses loading sedang berlangsung'
      }
    ]
  },
  {
    id: '3',
    shipmentNumber: 'SHIP-20250113-005',
    batchIds: ['BATCH-T-20250113-003'],
    destination: 'PT Distributor Maju',
    destinationType: 'distributor',
    driver: 'Ahmad Yani',
    vehicle: 'Truck Isuzu',
    plateNumber: 'D 9012 EF',
    departureDate: new Date('2025-01-13T07:00:00'),
    estimatedArrival: new Date('2025-01-13T15:00:00'),
    actualArrival: new Date('2025-01-13T14:45:00'),
    status: 'selesai',
    totalWeight: 300,
    notes: 'Pengiriman langsung ke distributor',
    trackingData: [
      {
        id: '1',
        timestamp: new Date('2025-01-13T07:00:00'),
        location: 'Pabrik PT Pupuk Indonesia',
        status: 'Berangkat'
      },
      {
        id: '2',
        timestamp: new Date('2025-01-13T14:45:00'),
        location: 'PT Distributor Maju',
        status: 'Tiba',
        notes: 'Tiba lebih awal 15 menit'
      }
    ]
  }
];

const destinations = [
  { value: 'gudang_pusat_jakarta', label: 'Gudang Pusat Jakarta', type: 'gudang_lini_1' },
  { value: 'gudang_regional_surabaya', label: 'Gudang Regional Surabaya', type: 'gudang_lini_2' },
  { value: 'gudang_regional_medan', label: 'Gudang Regional Medan', type: 'gudang_lini_2' },
  { value: 'pt_distributor_maju', label: 'PT Distributor Maju', type: 'distributor' },
  { value: 'cv_tani_sejahtera', label: 'CV Tani Sejahtera', type: 'distributor' }
];

const availableBatches = [
  { id: 'BATCH-U-20250114-001', type: 'Urea', quantity: 500, status: 'ready' },
  { id: 'BATCH-N-20250114-002', type: 'NPK', quantity: 400, status: 'ready' },
  { id: 'BATCH-T-20250114-003', type: 'TSP', quantity: 300, status: 'ready' },
  { id: 'BATCH-K-20250114-004', type: 'KCl', quantity: 250, status: 'ready' }
];

export function ShippingManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState<ShipmentForm>({
    batchIds: [],
    destination: '',
    destinationType: 'gudang_lini_1',
    driver: '',
    vehicle: '',
    plateNumber: '',
    departureDate: new Date().toISOString().split('T')[0],
    estimatedArrival: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'persiapan': { label: 'Persiapan', variant: 'outline' as const },
      'dalam_perjalanan': { label: 'Dalam Perjalanan', variant: 'default' as const },
      'tiba': { label: 'Tiba', variant: 'secondary' as const },
      'selesai': { label: 'Selesai', variant: 'default' as const },
      'delayed': { label: 'Terlambat', variant: 'destructive' as const }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'persiapan': return <Package className="h-4 w-4 text-blue-500" />;
      case 'dalam_perjalanan': return <Truck className="h-4 w-4 text-orange-500" />;
      case 'tiba': return <MapPin className="h-4 w-4 text-green-500" />;
      case 'selesai': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delayed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const generateShipmentNumber = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const sequence = String(shipments.length + 1).padStart(3, '0');
    return `SHIP-${today}-${sequence}`;
  };

  const handleCreateShipment = () => {
    if (!form.destination || !form.driver || form.batchIds.length === 0) return;

    const selectedBatches = availableBatches.filter(batch => form.batchIds.includes(batch.id));
    const totalWeight = selectedBatches.reduce((sum, batch) => sum + batch.quantity, 0);

    const newShipment: Shipment = {
      id: String(shipments.length + 1),
      shipmentNumber: generateShipmentNumber(),
      batchIds: form.batchIds,
      destination: destinations.find(d => d.value === form.destination)?.label || form.destination,
      destinationType: form.destinationType,
      driver: form.driver,
      vehicle: form.vehicle,
      plateNumber: form.plateNumber,
      departureDate: new Date(form.departureDate),
      estimatedArrival: new Date(form.estimatedArrival),
      status: 'persiapan',
      totalWeight,
      notes: form.notes,
      trackingData: [{
        id: '1',
        timestamp: new Date(),
        location: 'Pabrik PT Pupuk Indonesia',
        status: 'Dibuat',
        notes: 'Pengiriman telah dijadwalkan'
      }]
    };

    setShipments(prev => [newShipment, ...prev]);
    setForm({
      batchIds: [],
      destination: '',
      destinationType: 'gudang_lini_1',
      driver: '',
      vehicle: '',
      plateNumber: '',
      departureDate: new Date().toISOString().split('T')[0],
      estimatedArrival: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewTracking = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsTrackingDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pengiriman</h1>
          <p className="text-muted-foreground">
            Kelola pengiriman pupuk dari pabrik ke gudang dan distributor
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pengiriman Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Pengiriman Baru</DialogTitle>
              <DialogDescription>
                Atur pengiriman batch pupuk ke gudang atau distributor
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Pilih Batch</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableBatches.map(batch => (
                    <div key={batch.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.batchIds.includes(batch.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm(prev => ({ ...prev, batchIds: [...prev.batchIds, batch.id] }));
                          } else {
                            setForm(prev => ({ ...prev, batchIds: prev.batchIds.filter(id => id !== batch.id) }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{batch.id} - {batch.type} ({batch.quantity} ton)</span>
                    </div>
                  ))}
                </div>
                {form.batchIds.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Total: {availableBatches.filter(b => form.batchIds.includes(b.id)).reduce((sum, b) => sum + b.quantity, 0)} ton
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Tujuan</Label>
                <Select value={form.destination} onValueChange={(value) => {
                  const dest = destinations.find(d => d.value === value);
                  setForm(prev => ({ 
                    ...prev, 
                    destination: value,
                    destinationType: dest?.type as any || 'gudang_lini_1'
                  }));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map(dest => (
                      <SelectItem key={dest.value} value={dest.value}>
                        {dest.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Driver</Label>
                <Input
                  id="driver"
                  placeholder="Nama driver"
                  value={form.driver}
                  onChange={(e) => setForm(prev => ({ ...prev, driver: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Kendaraan</Label>
                <Input
                  id="vehicle"
                  placeholder="Jenis kendaraan"
                  value={form.vehicle}
                  onChange={(e) => setForm(prev => ({ ...prev, vehicle: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plateNumber">Nomor Plat</Label>
                <Input
                  id="plateNumber"
                  placeholder="Nomor plat kendaraan"
                  value={form.plateNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, plateNumber: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureDate">Tanggal Berangkat</Label>
                <Input
                  id="departureDate"
                  type="datetime-local"
                  value={form.departureDate}
                  onChange={(e) => setForm(prev => ({ ...prev, departureDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedArrival">Estimasi Tiba</Label>
                <Input
                  id="estimatedArrival"
                  type="datetime-local"
                  value={form.estimatedArrival}
                  onChange={(e) => setForm(prev => ({ ...prev, estimatedArrival: e.target.value }))}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan pengiriman..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={handleCreateShipment}
                disabled={!form.destination || !form.driver || form.batchIds.length === 0}
              >
                <Truck className="h-4 w-4 mr-2" />
                Buat Pengiriman
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {shipments.filter(s => s.status === 'persiapan').length}
            </div>
            <p className="text-sm text-muted-foreground">Persiapan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {shipments.filter(s => s.status === 'dalam_perjalanan').length}
            </div>
            <p className="text-sm text-muted-foreground">Dalam Perjalanan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {shipments.filter(s => s.status === 'tiba').length}
            </div>
            <p className="text-sm text-muted-foreground">Tiba</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {shipments.filter(s => s.status === 'selesai').length}
            </div>
            <p className="text-sm text-muted-foreground">Selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {shipments.filter(s => s.status === 'delayed').length}
            </div>
            <p className="text-sm text-muted-foreground">Terlambat</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari pengiriman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="persiapan">Persiapan</SelectItem>
            <SelectItem value="dalam_perjalanan">Dalam Perjalanan</SelectItem>
            <SelectItem value="tiba">Tiba</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
            <SelectItem value="delayed">Terlambat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengiriman</CardTitle>
          <CardDescription>
            Monitor semua pengiriman dari pabrik ke gudang dan distributor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pengiriman</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Kendaraan</TableHead>
                <TableHead>Berangkat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.shipmentNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {shipment.batchIds.map(batchId => (
                        <Badge key={batchId} variant="outline" className="text-xs">
                          {batchId}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>{shipment.driver}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{shipment.vehicle}</div>
                      <div className="text-muted-foreground">{shipment.plateNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{shipment.departureDate.toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(shipment.status)}
                      {getStatusBadge(shipment.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTracking(shipment)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tracking Dialog */}
      <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tracking Pengiriman - {selectedShipment?.shipmentNumber}</DialogTitle>
            <DialogDescription>
              Lacak perjalanan pengiriman secara real-time
            </DialogDescription>
          </DialogHeader>
          
          {selectedShipment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tujuan:</span>
                  <p>{selectedShipment.destination}</p>
                </div>
                <div>
                  <span className="font-medium">Driver:</span>
                  <p>{selectedShipment.driver}</p>
                </div>
                <div>
                  <span className="font-medium">Kendaraan:</span>
                  <p>{selectedShipment.vehicle} ({selectedShipment.plateNumber})</p>
                </div>
                <div>
                  <span className="font-medium">Total Berat:</span>
                  <p>{selectedShipment.totalWeight} ton</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Route className="h-4 w-4 mr-2" />
                  Riwayat Perjalanan
                </h4>
                <div className="space-y-3">
                  {selectedShipment.trackingData.map((track, index) => (
                    <div key={track.id} className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{track.location}</span>
                          <span className="text-sm text-muted-foreground">
                            {track.timestamp.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {track.status}
                        </div>
                        {track.notes && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {track.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}