import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Store, MapPin, Phone, Mail, Users, Package, TrendingUp, Plus, Edit, Eye } from 'lucide-react';

const mockRetailers = [
  {
    id: 'RET-001',
    name: 'Toko Tani Sejahtera',
    owner: 'Budi Santoso',
    address: 'Jl. Raya Desa Makmur No. 123, Malang',
    phone: '08123456789',
    email: 'budisantoso@example.com',
    status: 'active',
    registrationDate: '2023-06-15',
    totalSales: 25.5,
    monthlyQuota: 50,
    remainingQuota: 24.5,
    farmerCount: 45,
    lastOrder: '2024-01-19',
    performance: 'excellent'
  },
  {
    id: 'RET-002',
    name: 'Kios Pupuk Harapan',
    owner: 'Siti Nurlaela',
    address: 'Jl. Veteran No. 45, Kediri',
    phone: '08234567890',
    email: 'siti.nurlaela@example.com',
    status: 'active',
    registrationDate: '2023-08-22',
    totalSales: 18.2,
    monthlyQuota: 30,
    remainingQuota: 11.8,
    farmerCount: 32,
    lastOrder: '2024-01-20',
    performance: 'good'
  },
  {
    id: 'RET-003',
    name: 'Toko Saprodi Maju',
    owner: 'Ahmad Fauzi',
    address: 'Jl. Pahlawan No. 67, Blitar',
    phone: '08345678901',
    email: 'ahmad.fauzi@example.com',
    status: 'pending',
    registrationDate: '2024-01-10',
    totalSales: 0,
    monthlyQuota: 25,
    remainingQuota: 25,
    farmerCount: 0,
    lastOrder: null,
    performance: 'new'
  },
  {
    id: 'RET-004',
    name: 'Kios Pertanian Berkah',
    owner: 'Rina Wati',
    address: 'Jl. Sudirman No. 89, Tulungagung',
    phone: '08456789012',
    email: 'rina.wati@example.com',
    status: 'active',
    registrationDate: '2023-04-10',
    totalSales: 32.1,
    monthlyQuota: 40,
    remainingQuota: 7.9,
    farmerCount: 58,
    lastOrder: '2024-01-18',
    performance: 'excellent'
  }
];

export function RetailerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  const filteredRetailers = mockRetailers.filter(retailer => {
    const matchesSearch = retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         retailer.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || retailer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Aktif</Badge>;
      case 'pending':
        return <Badge variant="secondary">Menunggu</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Nonaktif</Badge>;
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>;
    }
  };

  const getPerformanceBadge = (performance) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Sangat Baik</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Baik</Badge>;
      case 'average':
        return <Badge className="bg-yellow-100 text-yellow-800">Cukup</Badge>;
      case 'new':
        return <Badge className="bg-gray-100 text-gray-800">Baru</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const totalActiveRetailers = mockRetailers.filter(r => r.status === 'active').length;
  const totalSales = mockRetailers.reduce((sum, r) => sum + r.totalSales, 0);
  const totalFarmers = mockRetailers.reduce((sum, r) => sum + r.farmerCount, 0);
  const pendingApprovals = mockRetailers.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Manajemen Pengecer</h1>
          <p className="text-muted-foreground">
            Kelola kios pengecer yang berada di bawah distribusi Anda
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Pengecer
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalActiveRetailers}</div>
                <p className="text-sm text-muted-foreground">Pengecer Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{totalSales.toFixed(1)} Ton</div>
                <p className="text-sm text-muted-foreground">Total Penjualan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalFarmers}</div>
                <p className="text-sm text-muted-foreground">Petani Terlayani</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{pendingApprovals}</div>
                <p className="text-sm text-muted-foreground">Menunggu Persetujuan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengecer</CardTitle>
          <CardDescription>
            Kelola dan pantau kinerja pengecer di wilayah distribusi Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan nama toko atau pemilik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Toko</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kuota Bulanan</TableHead>
                  <TableHead>Sisa Kuota</TableHead>
                  <TableHead>Petani</TableHead>
                  <TableHead>Kinerja</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRetailers.map((retailer) => (
                  <TableRow key={retailer.id}>
                    <TableCell className="font-medium">{retailer.name}</TableCell>
                    <TableCell>{retailer.owner}</TableCell>
                    <TableCell className="max-w-xs truncate">{retailer.address}</TableCell>
                    <TableCell>{getStatusBadge(retailer.status)}</TableCell>
                    <TableCell>{retailer.monthlyQuota} Ton</TableCell>
                    <TableCell>{retailer.remainingQuota} Ton</TableCell>
                    <TableCell>{retailer.farmerCount}</TableCell>
                    <TableCell>{getPerformanceBadge(retailer.performance)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detail Pengecer</DialogTitle>
                              <DialogDescription>
                                Informasi lengkap {retailer.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">ID Pengecer</label>
                                  <p className="font-mono text-sm">{retailer.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Nama Toko</label>
                                  <p className="font-medium">{retailer.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Pemilik</label>
                                  <p>{retailer.owner}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Status</label>
                                  <div className="mt-1">{getStatusBadge(retailer.status)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Tanggal Registrasi</label>
                                  <p>{retailer.registrationDate}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Order Terakhir</label>
                                  <p>{retailer.lastOrder || 'Belum ada order'}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-gray-500">Alamat</label>
                                <p className="flex items-center gap-2 mt-1">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  {retailer.address}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Telepon</label>
                                  <p className="flex items-center gap-2 mt-1">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {retailer.phone}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Email</label>
                                  <p className="flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {retailer.email}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Total Penjualan</label>
                                  <p className="text-lg font-bold text-green-600">{retailer.totalSales} Ton</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Kuota Bulanan</label>
                                  <p className="text-lg font-bold text-blue-600">{retailer.monthlyQuota} Ton</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Petani Terlayani</label>
                                  <p className="text-lg font-bold text-purple-600">{retailer.farmerCount}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}