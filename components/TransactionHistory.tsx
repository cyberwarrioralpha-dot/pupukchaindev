import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download, Search, Filter, RefreshCw, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const mockTransactions = [
  {
    id: 'TXN-20240120-001',
    timestamp: '2024-01-20 14:25:33',
    farmerName: 'Petani ****1234',
    product: 'Pupuk Urea',
    quantity: 50,
    unit: 'Kg',
    price: 150000,
    subsidyAmount: 75000,
    blockchainTx: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    status: 'completed'
  },
  {
    id: 'TXN-20240120-002',
    timestamp: '2024-01-20 14:18:15',
    farmerName: 'Petani ****5678',
    product: 'NPK Premium',
    quantity: 25,
    unit: 'Kg',
    price: 200000,
    subsidyAmount: 100000,
    blockchainTx: '0x2b3c4d5e6f7890abcdef1234567890abcdef123a',
    status: 'completed'
  },
  {
    id: 'TXN-20240120-003',
    timestamp: '2024-01-20 14:12:45',
    farmerName: 'Petani ****9012',
    product: 'TSP',
    quantity: 30,
    unit: 'Kg',
    price: 175000,
    subsidyAmount: 87500,
    blockchainTx: '0x3c4d5e6f7890abcdef1234567890abcdef123a2b',
    status: 'completed'
  },
  {
    id: 'TXN-20240120-004',
    timestamp: '2024-01-20 14:05:22',
    farmerName: 'Petani ****3456',
    product: 'Pupuk Urea',
    quantity: 40,
    unit: 'Kg',
    price: 120000,
    subsidyAmount: 60000,
    blockchainTx: '0x4d5e6f7890abcdef1234567890abcdef123a2b3c',
    status: 'completed'
  },
  {
    id: 'TXN-20240120-005',
    timestamp: '2024-01-20 13:58:10',
    farmerName: 'Petani ****7890',
    product: 'KCl',
    quantity: 20,
    unit: 'Kg',
    price: 180000,
    subsidyAmount: 90000,
    blockchainTx: '0x5e6f7890abcdef1234567890abcdef123a2b3c4d',
    status: 'completed'
  }
];

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterProduct === 'all' || transaction.product === filterProduct;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    // Simulate CSV export
    const csvContent = [
      ['Timestamp', 'ID Transaksi', 'Petani', 'Produk', 'Jumlah', 'Harga', 'Subsidi', 'Blockchain TX'],
      ...filteredTransactions.map(t => [
        t.timestamp,
        t.id,
        t.farmerName,
        t.product,
        `${t.quantity} ${t.unit}`,
        t.price,
        t.subsidyAmount,
        t.blockchainTx
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaksi-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const handleRefresh = () => {
    // Simulate refresh
    console.log('Refreshing transaction data...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Riwayat Transaksi</h1>
          <p className="text-muted-foreground">
            Monitor semua transaksi penebusan pupuk bersubsidi dalam real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">89</div>
            <p className="text-sm text-muted-foreground">Transaksi Hari Ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2.4 Ton</div>
            <p className="text-sm text-muted-foreground">Total Terdistribusi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">Rp 12.5 Juta</div>
            <p className="text-sm text-muted-foreground">Subsidi Tersalurkan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">76</div>
            <p className="text-sm text-muted-foreground">Petani Unik</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaksi Real-time</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan ID transaksi atau petani..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter Produk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Produk</SelectItem>
                <SelectItem value="Pupuk Urea">Pupuk Urea</SelectItem>
                <SelectItem value="NPK Premium">NPK Premium</SelectItem>
                <SelectItem value="TSP">TSP</SelectItem>
                <SelectItem value="KCl">KCl</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Nama Petani</TableHead>
                  <TableHead>Jenis Pupuk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Subsidi</TableHead>
                  <TableHead>ID Transaksi Blockchain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.timestamp}
                    </TableCell>
                    <TableCell>{transaction.farmerName}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>{transaction.quantity} {transaction.unit}</TableCell>
                    <TableCell>{formatCurrency(transaction.price)}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(transaction.subsidyAmount)}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {transaction.blockchainTx.slice(0, 8)}...{transaction.blockchainTx.slice(-6)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Selesai</Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detail Transaksi</DialogTitle>
                            <DialogDescription>
                              Informasi lengkap transaksi {transaction.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">ID Transaksi</label>
                                <p className="font-mono text-sm">{transaction.id}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Timestamp</label>
                                <p className="font-mono text-sm">{transaction.timestamp}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Petani</label>
                                <p>{transaction.farmerName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Produk</label>
                                <p>{transaction.product}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Jumlah</label>
                                <p>{transaction.quantity} {transaction.unit}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Harga Total</label>
                                <p>{formatCurrency(transaction.price)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Subsidi</label>
                                <p className="text-green-600">{formatCurrency(transaction.subsidyAmount)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <Badge variant="default">Selesai</Badge>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Blockchain Transaction</label>
                              <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                                {transaction.blockchainTx}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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