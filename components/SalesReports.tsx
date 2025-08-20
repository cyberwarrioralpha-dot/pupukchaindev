
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Download, Calendar, Package, Users, DollarSign, Target } from 'lucide-react';

const salesByProductData = [
  { name: 'Urea', value: 45, color: '#3b82f6' },
  { name: 'NPK', value: 25, color: '#10b981' },
  { name: 'TSP', value: 20, color: '#f59e0b' },
  { name: 'KCl', value: 10, color: '#ef4444' },
];

const monthlySalesData = [
  { month: 'Ags', sales: 120, target: 150 },
  { month: 'Sep', sales: 145, target: 150 },
  { month: 'Okt', sales: 160, target: 150 },
  { month: 'Nov', sales: 135, target: 150 },
  { month: 'Des', sales: 170, target: 150 },
  { month: 'Jan', sales: 185, target: 150 },
];

const topPerformingRetailers = [
  { name: 'Toko Tani Sejahtera', sales: 25.5, target: 30, percentage: 85 },
  { name: 'Kios Pertanian Berkah', sales: 32.1, target: 40, percentage: 80 },
  { name: 'Toko Saprodi Maju', sales: 18.2, target: 25, percentage: 73 },
  { name: 'Kios Pupuk Harapan', sales: 15.8, target: 20, percentage: 79 },
];

const recentSales = [
  {
    id: 'SALE-001',
    date: '2024-01-20',
    retailer: 'Toko Tani Sejahtera',
    product: 'Pupuk Urea',
    quantity: 500,
    unit: 'Kg',
    revenue: 750000,
    subsidyAmount: 375000,
    profit: 125000
  },
  {
    id: 'SALE-002',
    date: '2024-01-20',
    retailer: 'Kios Pertanian Berkah',
    product: 'NPK Premium',
    quantity: 300,
    unit: 'Kg',
    revenue: 600000,
    subsidyAmount: 300000,
    profit: 90000
  },
  {
    id: 'SALE-003',
    date: '2024-01-19',
    retailer: 'Toko Saprodi Maju',
    product: 'TSP',
    quantity: 200,
    unit: 'Kg',
    revenue: 350000,
    subsidyAmount: 175000,
    profit: 52500
  },
];

export function SalesReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedProduct, setSelectedProduct] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExportReport = () => {
    // Simulate report export
    console.log('Exporting sales report...');
  };

  const totalRevenue = recentSales.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalSubsidy = recentSales.reduce((sum, sale) => sum + sale.subsidyAmount, 0);
  const totalProfit = recentSales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalQuantity = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Laporan Penjualan</h1>
          <p className="text-muted-foreground">
            Analisis performa penjualan dan distribusi pupuk bersubsidi
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="yearly">Tahunan</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{(totalQuantity / 1000).toFixed(1)} Ton</div>
                <p className="text-sm text-muted-foreground">Total Terjual</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalSubsidy)}</div>
                <p className="text-sm text-muted-foreground">Subsidi Tersalurkan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalProfit)}</div>
                <p className="text-sm text-muted-foreground">Keuntungan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Penjualan Bulanan</CardTitle>
            <CardDescription>Perbandingan penjualan vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" name="Penjualan" />
                <Bar dataKey="target" fill="#e5e7eb" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Product */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Penjualan per Produk</CardTitle>
            <CardDescription>Persentase penjualan berdasarkan jenis pupuk</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByProductData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByProductData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Retailers */}
      <Card>
        <CardHeader>
          <CardTitle>Kinerja Pengecer Terbaik</CardTitle>
          <CardDescription>Pengecer dengan penjualan tertinggi bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingRetailers.map((retailer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{retailer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {retailer.sales} Ton dari target {retailer.target} Ton
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{retailer.percentage}%</div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${retailer.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Penjualan Terbaru</CardTitle>
          <CardDescription>Daftar penjualan terbaru dari berbagai pengecer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Pengecer</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Subsidi</TableHead>
                  <TableHead>Keuntungan</TableHead>
                  <TableHead>Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.retailer}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>{sale.quantity} {sale.unit}</TableCell>
                    <TableCell>{formatCurrency(sale.revenue)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(sale.subsidyAmount)}</TableCell>
                    <TableCell className="text-blue-600">{formatCurrency(sale.profit)}</TableCell>
                    <TableCell>
                      <Badge variant={sale.profit / sale.revenue > 0.2 ? 'default' : 'secondary'}>
                        {((sale.profit / sale.revenue) * 100).toFixed(1)}%
                      </Badge>
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
