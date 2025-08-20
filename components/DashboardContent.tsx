import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Package, 
  Users, 
  Truck, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface DashboardStats {
  totalStok: number;
  distribusiAktif: number;
  totalDistributor: number;
  kioskTerdaftar: number;
}

interface DashboardContentProps {
  userRole: string;
  stats: DashboardStats;
}

const recentActivities = [
  {
    id: 1,
    type: 'distribusi',
    message: 'Distribusi 500 ton pupuk urea ke Jawa Timur',
    time: '2 jam yang lalu',
    status: 'success'
  },
  {
    id: 2,
    type: 'stok',
    message: 'Stok pupuk NPK di gudang Surabaya menipis',
    time: '4 jam yang lalu',
    status: 'warning'
  },
  {
    id: 3,
    type: 'verifikasi',
    message: '15 kios tani baru menunggu verifikasi',
    time: '6 jam yang lalu',
    status: 'info'
  },
  {
    id: 4,
    type: 'distribusi',
    message: 'Pengiriman ke Kalimantan Selatan selesai',
    time: '8 jam yang lalu',
    status: 'success'
  }
];

const stockData = [
  { jenis: 'Urea', stok: 15420, target: 20000, lokasi: 'Jawa Timur' },
  { jenis: 'NPK', stok: 8750, target: 10000, lokasi: 'Jawa Tengah' },
  { jenis: 'TSP', stok: 5230, target: 8000, lokasi: 'Sumatera Utara' },
  { jenis: 'KCl', stok: 3100, target: 5000, lokasi: 'Sulawesi Selatan' }
];

export function DashboardContent({ userRole, stats }: DashboardContentProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Selamat Datang di PupukChain Dashboard</h1>
        <p className="text-muted-foreground">
          Kelola distribusi pupuk bersubsidi dengan sistem terpadu dan transparan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStok.toLocaleString()} ton</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distribusi Aktif</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.distribusiAktif}</div>
            <p className="text-xs text-muted-foreground">
              Sedang dalam perjalanan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distributor</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDistributor}</div>
            <p className="text-xs text-muted-foreground">
              Tersebar di seluruh Indonesia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kios Terdaftar</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.kioskTerdaftar}</div>
            <p className="text-xs text-muted-foreground">
              Siap melayani petani
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status Stok Pupuk</CardTitle>
            <CardDescription>
              Monitoring ketersediaan pupuk di berbagai wilayah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis Pupuk</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockData.map((item) => {
                  const percentage = (item.stok / item.target) * 100;
                  return (
                    <TableRow key={item.jenis}>
                      <TableCell className="font-medium">{item.jenis}</TableCell>
                      <TableCell>{item.lokasi}</TableCell>
                      <TableCell>
                        {item.stok.toLocaleString()} / {item.target.toLocaleString()} ton
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={percentage} className="w-16" />
                          <Badge 
                            variant={percentage > 80 ? "default" : percentage > 50 ? "secondary" : "destructive"}
                          >
                            {Math.round(percentage)}%
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Update terkini sistem PupukChain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {getStatusIcon(activity.status)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Lihat Semua Aktivitas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Fungsi yang sering digunakan untuk mempercepat pekerjaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span className="text-xs">Tambah Stok</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Truck className="h-6 w-6" />
              <span className="text-xs">Buat Distribusi</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-xs">Daftar Kios</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <MapPin className="h-6 w-6" />
              <span className="text-xs">Lihat Peta</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}