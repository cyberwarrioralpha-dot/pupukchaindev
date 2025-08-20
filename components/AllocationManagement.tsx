import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { 
  Plus,
  Send,
  ArrowRight,
  Package,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter
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

interface AllocationRecord {
  id: string;
  source: string;
  destination: string;
  fertilizerType: string;
  amount: number;
  status: 'pending' | 'approved' | 'distributed' | 'completed' | 'rejected';
  createdDate: Date;
  approvedDate?: Date;
  distributedDate?: Date;
  completedDate?: Date;
  createdBy: string;
  approvedBy?: string;
  blockchainTxHash?: string;
  notes?: string;
}

interface AllocationForm {
  source: string;
  destination: string;
  fertilizerType: string;
  amount: string;
  priority: string;
  notes: string;
}

const mockAllocations: AllocationRecord[] = [
  {
    id: 'AL001',
    source: 'Kuota Nasional',
    destination: 'Provinsi Jawa Timur',
    fertilizerType: 'Urea',
    amount: 50000,
    status: 'completed',
    createdDate: new Date('2025-01-10'),
    approvedDate: new Date('2025-01-11'),
    distributedDate: new Date('2025-01-12'),
    completedDate: new Date('2025-01-14'),
    createdBy: 'Admin Kementan',
    approvedBy: 'Direktur Pupuk',
    blockchainTxHash: '0x1234...abcd',
    notes: 'Alokasi rutin untuk periode Januari 2025'
  },
  {
    id: 'AL002',
    source: 'Provinsi Jawa Timur',
    destination: 'Kab. Malang',
    fertilizerType: 'NPK',
    amount: 5000,
    status: 'distributed',
    createdDate: new Date('2025-01-12'),
    approvedDate: new Date('2025-01-13'),
    distributedDate: new Date('2025-01-14'),
    createdBy: 'Admin Provinsi Jatim',
    approvedBy: 'Kepala Dinas Pertanian Jatim',
    blockchainTxHash: '0x5678...efgh',
    notes: 'Distribusi untuk program intensifikasi padi'
  },
  {
    id: 'AL003',
    source: 'Kuota Nasional',
    destination: 'Provinsi Sumatera Utara',
    fertilizerType: 'TSP',
    amount: 25000,
    status: 'approved',
    createdDate: new Date('2025-01-13'),
    approvedDate: new Date('2025-01-14'),
    createdBy: 'Admin Kementan',
    approvedBy: 'Direktur Pupuk',
    notes: 'Alokasi tambahan untuk program khusus'
  },
  {
    id: 'AL004',
    source: 'Provinsi Jawa Barat',
    destination: 'Kab. Subang',
    fertilizerType: 'Urea',
    amount: 3000,
    status: 'pending',
    createdDate: new Date('2025-01-14'),
    createdBy: 'Admin Provinsi Jabar',
    notes: 'Permintaan darurat untuk musim tanam'
  }
];

const sources = [
  'Kuota Nasional',
  'Provinsi Jawa Timur',
  'Provinsi Jawa Tengah',
  'Provinsi Jawa Barat',
  'Provinsi Sumatera Utara',
  'Provinsi Sumatera Selatan'
];

const destinations = [
  'Provinsi Jawa Timur',
  'Provinsi Jawa Tengah',
  'Provinsi Jawa Barat',
  'Kab. Malang',
  'Kab. Subang',
  'Kab. Boyolali',
  'Kab. Sleman'
];

const fertilizerTypes = [
  { value: 'urea', label: 'Urea', price: 2300 },
  { value: 'npk', label: 'NPK', price: 2500 },
  { value: 'tsp', label: 'TSP', price: 2400 },
  { value: 'kcl', label: 'KCl', price: 2600 }
];

export function AllocationManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [allocations, setAllocations] = useState<AllocationRecord[]>(mockAllocations);
  const [selectedAllocation, setSelectedAllocation] = useState<AllocationRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState<AllocationForm>({
    source: '',
    destination: '',
    fertilizerType: '',
    amount: '',
    priority: 'medium',
    notes: ''
  });

  const filteredAllocations = allocations.filter(allocation => {
    if (filter === 'all') return true;
    return allocation.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'distributed': return <Send className="h-4 w-4 text-blue-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: 'Menunggu', variant: 'outline' as const },
      'approved': { label: 'Disetujui', variant: 'secondary' as const },
      'distributed': { label: 'Didistribusi', variant: 'default' as const },
      'completed': { label: 'Selesai', variant: 'default' as const },
      'rejected': { label: 'Ditolak', variant: 'destructive' as const }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleCreateAllocation = async () => {
    setIsProcessing(true);
    
    // Simulate API call and blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAllocation: AllocationRecord = {
      id: `AL${String(allocations.length + 1).padStart(3, '0')}`,
      source: form.source,
      destination: form.destination,
      fertilizerType: form.fertilizerType,
      amount: parseInt(form.amount),
      status: 'pending',
      createdDate: new Date(),
      createdBy: 'Admin Kementan',
      notes: form.notes
    };

    setAllocations(prev => [newAllocation, ...prev]);
    setForm({
      source: '',
      destination: '',
      fertilizerType: '',
      amount: '',
      priority: 'medium',
      notes: ''
    });
    setIsCreateDialogOpen(false);
    setIsProcessing(false);
  };

  const handleApproveAllocation = async (id: string) => {
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAllocations(prev => prev.map(allocation => 
      allocation.id === id 
        ? { 
            ...allocation, 
            status: 'approved' as const, 
            approvedDate: new Date(),
            approvedBy: 'Direktur Pupuk',
            blockchainTxHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
          }
        : allocation
    ));
    
    setIsProcessing(false);
  };

  const calculateTotalValue = (amount: number, fertilizerType: string) => {
    const fertilizer = fertilizerTypes.find(f => f.label === fertilizerType);
    return fertilizer ? amount * fertilizer.price : 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Alokasi & Distribusi Pupuk</h1>
          <p className="text-muted-foreground">
            Kelola hierarki alokasi pupuk bersubsidi dengan smart contract
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Buat Alokasi Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Buat Alokasi Pupuk Baru</DialogTitle>
                <DialogDescription>
                  Isi form di bawah untuk membuat alokasi baru. Transaksi akan dicatat di blockchain.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Sumber Alokasi</Label>
                  <Select value={form.source} onValueChange={(value) => setForm(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih sumber" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Tujuan Alokasi</Label>
                  <Select value={form.destination} onValueChange={(value) => setForm(prev => ({ ...prev, destination: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map(dest => (
                        <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fertilizerType">Jenis Pupuk</Label>
                  <Select value={form.fertilizerType} onValueChange={(value) => setForm(prev => ({ ...prev, fertilizerType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis pupuk" />
                    </SelectTrigger>
                    <SelectContent>
                      {fertilizerTypes.map(type => (
                        <SelectItem key={type.value} value={type.label}>
                          {type.label} - Rp {type.price.toLocaleString()}/ton
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Jumlah (Ton)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  {form.amount && form.fertilizerType && (
                    <p className="text-sm text-muted-foreground">
                      Total nilai: Rp {calculateTotalValue(parseInt(form.amount), form.fertilizerType).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select value={form.priority} onValueChange={(value) => setForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Tinggi</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="low">Rendah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    placeholder="Catatan tambahan..."
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
                  onClick={handleCreateAllocation} 
                  disabled={isProcessing || !form.source || !form.destination || !form.fertilizerType || !form.amount}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Buat Alokasi
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {allocations.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Menunggu Persetujuan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {allocations.filter(a => a.status === 'approved').length}
            </div>
            <p className="text-sm text-muted-foreground">Disetujui</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {allocations.filter(a => a.status === 'distributed').length}
            </div>
            <p className="text-sm text-muted-foreground">Dalam Distribusi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {allocations.filter(a => a.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter Status:</span>
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'distributed', 'completed'].map(status => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                >
                  {status === 'all' ? 'Semua' :
                   status === 'pending' ? 'Menunggu' :
                   status === 'approved' ? 'Disetujui' :
                   status === 'distributed' ? 'Distribusi' : 'Selesai'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Alokasi Pupuk</CardTitle>
          <CardDescription>
            Hierarki alokasi pupuk dari kuota nasional hingga tingkat kabupaten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Alur Distribusi</TableHead>
                <TableHead>Jenis Pupuk</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Blockchain</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell className="font-medium">{allocation.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{allocation.source}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{allocation.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{allocation.fertilizerType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {allocation.amount.toLocaleString()} ton
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(allocation.status)}
                      {getStatusBadge(allocation.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {allocation.createdDate.toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {allocation.blockchainTxHash ? (
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        {allocation.blockchainTxHash}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {allocation.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApproveAllocation(allocation.id)}
                          disabled={isProcessing}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
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

      {/* Processing Indicator */}
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-500 animate-spin" />
              <div>
                <div className="font-medium text-blue-900">Memproses Transaksi Blockchain</div>
                <div className="text-sm text-blue-700">
                  Sedang mencatat transaksi ke smart contract, mohon tunggu...
                </div>
              </div>
            </div>
            <Progress value={65} className="mt-3" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}