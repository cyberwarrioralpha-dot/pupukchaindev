import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Building, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter,
  Search,
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Star,
  Shield,
  Clock,
  FileText
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Distributor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrder: string;
  joinDate: string;
  coverage: string[];
  performance: {
    onTimeDelivery: number;
    customerSatisfaction: number;
    orderFulfillment: number;
  };
  documents: {
    license: boolean;
    taxId: boolean;
    bankAccount: boolean;
  };
}

const mockDistributors: Distributor[] = [
  {
    id: 'DIST001',
    name: 'Hadi Wijaya',
    company: 'PT Agro Distribusi Nusantara',
    email: 'hadi@agrodistribusi.com',
    phone: '+62 21 1234 5678',
    address: 'Jl. Raya Pupuk No. 123',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    status: 'active',
    rating: 4.8,
    totalOrders: 1247,
    totalValue: 2850000000,
    lastOrder: '2024-01-15',
    joinDate: '2022-03-15',
    coverage: ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi'],
    performance: {
      onTimeDelivery: 94.5,
      customerSatisfaction: 4.7,
      orderFulfillment: 98.2
    },
    documents: {
      license: true,
      taxId: true,
      bankAccount: true
    }
  },
  {
    id: 'DIST002',
    name: 'Siti Nurhaliza',
    company: 'CV Pupuk Sejahtera',
    email: 'siti@pupuksejahtera.com',
    phone: '+62 274 987 6543',
    address: 'Jl. Malioboro No. 456',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    status: 'active',
    rating: 4.6,
    totalOrders: 856,
    totalValue: 1950000000,
    lastOrder: '2024-01-14',
    joinDate: '2022-07-20',
    coverage: ['Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo', 'Gunungkidul'],
    performance: {
      onTimeDelivery: 92.8,
      customerSatisfaction: 4.6,
      orderFulfillment: 96.7
    },
    documents: {
      license: true,
      taxId: true,
      bankAccount: true
    }
  },
  {
    id: 'DIST003',
    name: 'Bambang Susanto',
    company: 'UD Tani Maju',
    email: 'bambang@tanimaju.com',
    phone: '+62 341 555 7890',
    address: 'Jl. Veteran No. 789',
    city: 'Malang',
    province: 'Jawa Timur',
    status: 'pending',
    rating: 0,
    totalOrders: 0,
    totalValue: 0,
    lastOrder: '',
    joinDate: '2024-01-10',
    coverage: ['Malang', 'Batu'],
    performance: {
      onTimeDelivery: 0,
      customerSatisfaction: 0,
      orderFulfillment: 0
    },
    documents: {
      license: true,
      taxId: false,
      bankAccount: true
    }
  },
  {
    id: 'DIST004',
    name: 'Dewi Sartika',
    company: 'PT Berkah Tani',
    email: 'dewi@berkahtani.com',
    phone: '+62 22 333 4444',
    address: 'Jl. Asia Afrika No. 321',
    city: 'Bandung',
    province: 'Jawa Barat',
    status: 'suspended',
    rating: 3.2,
    totalOrders: 425,
    totalValue: 890000000,
    lastOrder: '2023-12-20',
    joinDate: '2023-01-05',
    coverage: ['Bandung', 'Cimahi', 'Sumedang'],
    performance: {
      onTimeDelivery: 78.5,
      customerSatisfaction: 3.8,
      orderFulfillment: 85.3
    },
    documents: {
      license: true,
      taxId: true,
      bankAccount: true
    }
  }
];

export function DistributorManagement() {
  const [distributors, setDistributors] = useState<Distributor[]>(mockDistributors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredDistributors = distributors.filter(dist => {
    const matchesSearch = dist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dist.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dist.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (distributorId: string, newStatus: string) => {
    setDistributors(prev => 
      prev.map(dist => 
        dist.id === distributorId ? { ...dist, status: newStatus as any } : dist
      )
    );
  };

  const handleDeleteDistributor = (distributorId: string) => {
    setDistributors(prev => prev.filter(dist => dist.id !== distributorId));
  };

  const activeDistributors = distributors.filter(d => d.status === 'active').length;
  const pendingDistributors = distributors.filter(d => d.status === 'pending').length;
  const totalRevenue = distributors.reduce((sum, d) => sum + d.totalValue, 0);
  const averageRating = distributors.filter(d => d.rating > 0).reduce((sum, d) => sum + d.rating, 0) / distributors.filter(d => d.rating > 0).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Distributor</h1>
          <p className="text-muted-foreground">
            Kelola semua distributor dalam sistem PupukChain
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Distributor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Distributor</p>
                <p className="text-2xl font-bold">{distributors.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold text-green-600">{activeDistributors}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">Pending: {pendingDistributors}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {(totalRevenue / 1000000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+8.2% dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating Rata-rata</p>
                <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">dari {distributors.filter(d => d.rating > 0).length} reviews</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari distributor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Distributor Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Distributor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Distributor</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDistributors.map((distributor) => (
                <TableRow key={distributor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{distributor.name}</div>
                      <div className="text-sm text-muted-foreground">{distributor.company}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {distributor.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {distributor.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{distributor.city}</div>
                      <div className="text-muted-foreground">{distributor.province}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(distributor.status)}>
                      {getStatusIcon(distributor.status)}
                      <span className="ml-1 capitalize">{distributor.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{distributor.rating || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{distributor.totalOrders.toLocaleString()}</TableCell>
                  <TableCell>
                    Rp {(distributor.totalValue / 1000000).toFixed(1)}M
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedDistributor(distributor);
                          setShowDetailModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {distributor.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(distributor.id, 'active')}
                          className="text-green-600"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDistributor(distributor.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Distributor Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Distributor Baru</DialogTitle>
            <DialogDescription>
              Lengkapi formulir berikut untuk menambahkan distributor baru ke sistem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Masukkan nama lengkap" />
              </div>
              <div>
                <Label htmlFor="company">Nama Perusahaan</Label>
                <Input id="company" placeholder="Masukkan nama perusahaan" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" placeholder="+62 xxx xxxx xxxx" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Textarea id="address" placeholder="Masukkan alamat lengkap" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Kota</Label>
                <Input id="city" placeholder="Masukkan kota" />
              </div>
              <div>
                <Label htmlFor="province">Provinsi</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dki-jakarta">DKI Jakarta</SelectItem>
                    <SelectItem value="jawa-barat">Jawa Barat</SelectItem>
                    <SelectItem value="jawa-tengah">Jawa Tengah</SelectItem>
                    <SelectItem value="jawa-timur">Jawa Timur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button>Tambah Distributor</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selectedDistributor && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Detail Distributor - {selectedDistributor.name}</DialogTitle>
              <DialogDescription>
                Informasi lengkap tentang distributor dan performa operasional
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Informasi Umum</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>ID Distributor:</span>
                          <span>{selectedDistributor.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nama:</span>
                          <span>{selectedDistributor.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Perusahaan:</span>
                          <span>{selectedDistributor.company}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className={getStatusColor(selectedDistributor.status)}>
                            {selectedDistributor.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Kontak</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedDistributor.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedDistributor.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {selectedDistributor.address}, {selectedDistributor.city}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Statistik</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedDistributor.totalOrders}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedDistributor.rating}
                          </div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">Area Coverage</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedDistributor.coverage.map((area, index) => (
                          <Badge key={index} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedDistributor.performance.onTimeDelivery}%
                        </div>
                        <div className="text-sm text-muted-foreground">On-time Delivery</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedDistributor.performance.customerSatisfaction}
                        </div>
                        <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedDistributor.performance.orderFulfillment}%
                        </div>
                        <div className="text-sm text-muted-foreground">Order Fulfillment</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="orders" className="space-y-4">
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Order History</h3>
                  <p className="text-muted-foreground">Riwayat pesanan akan ditampilkan di sini</p>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Business License</div>
                        <div className="text-sm text-muted-foreground">Surat Izin Usaha</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDistributor.documents.license ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Tax ID (NPWP)</div>
                        <div className="text-sm text-muted-foreground">Nomor Pokok Wajib Pajak</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDistributor.documents.taxId ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Bank Account</div>
                        <div className="text-sm text-muted-foreground">Rekening Bank</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDistributor.documents.bankAccount ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Missing
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}