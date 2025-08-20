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
  Package,
  QrCode,
  Printer,
  Shield,
  Eye,
  Download,
  Search,
  Filter,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Link
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

interface BatchRecord {
  id: string;
  batchNumber: string;
  fertilizerType: string;
  quantity: number;
  unit: 'ton' | 'karung';
  productionDate: Date;
  status: 'di_pabrik' | 'dalam_perjalanan' | 'tiba_gudang' | 'terdistribusi';
  qrCodes: QRCode[];
  nftAddress?: string;
  blockchainTxHash?: string;
  qualityCheck: boolean;
  expiryDate: Date;
  destination?: string;
}

interface QRCode {
  id: string;
  code: string;
  printed: boolean;
  printedAt?: Date;
  status: 'active' | 'scanned' | 'expired';
  location?: string;
}

interface BatchForm {
  fertilizerType: string;
  quantity: string;
  unit: 'ton' | 'karung';
  batchNumber: string;
  productionDate: string;
  notes: string;
}

const mockBatches: BatchRecord[] = [
  {
    id: '1',
    batchNumber: 'BATCH-U-20250114-001',
    fertilizerType: 'Urea',
    quantity: 500,
    unit: 'ton',
    productionDate: new Date('2025-01-14'),
    status: 'dalam_perjalanan',
    qrCodes: Array.from({ length: 1000 }, (_, i) => ({
      id: `qr-${i + 1}`,
      code: `UP-${String(i + 1).padStart(4, '0')}-20250114`,
      printed: true,
      printedAt: new Date('2025-01-14T08:00:00'),
      status: 'active' as const,
    })),
    nftAddress: '0x1234...abcd',
    blockchainTxHash: '0x5678...efgh',
    qualityCheck: true,
    expiryDate: new Date('2026-01-14'),
    destination: 'Gudang Pusat Jakarta'
  },
  {
    id: '2',
    batchNumber: 'BATCH-N-20250114-002',
    fertilizerType: 'NPK',
    quantity: 400,
    unit: 'ton',
    productionDate: new Date('2025-01-14'),
    status: 'di_pabrik',
    qrCodes: Array.from({ length: 800 }, (_, i) => ({
      id: `qr-${i + 1}`,
      code: `NP-${String(i + 1).padStart(4, '0')}-20250114`,
      printed: true,
      printedAt: new Date('2025-01-14T09:00:00'),
      status: 'active' as const,
    })),
    nftAddress: '0x2345...bcde',
    blockchainTxHash: '0x6789...fghi',
    qualityCheck: true,
    expiryDate: new Date('2026-01-14')
  },
  {
    id: '3',
    batchNumber: 'BATCH-T-20250113-003',
    fertilizerType: 'TSP',
    quantity: 300,
    unit: 'ton',
    productionDate: new Date('2025-01-13'),
    status: 'tiba_gudang',
    qrCodes: Array.from({ length: 600 }, (_, i) => ({
      id: `qr-${i + 1}`,
      code: `TP-${String(i + 1).padStart(4, '0')}-20250113`,
      printed: true,
      printedAt: new Date('2025-01-13T10:00:00'),
      status: 'active' as const,
    })),
    nftAddress: '0x3456...cdef',
    blockchainTxHash: '0x7890...ghij',
    qualityCheck: true,
    expiryDate: new Date('2026-01-13'),
    destination: 'Gudang Regional Surabaya'
  }
];

const fertilizerTypes = [
  { value: 'urea', label: 'Urea', prefix: 'UP' },
  { value: 'npk', label: 'NPK', prefix: 'NP' },
  { value: 'tsp', label: 'TSP', prefix: 'TP' },
  { value: 'kcl', label: 'KCl', prefix: 'KP' }
];

export function AssetManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [batches, setBatches] = useState<BatchRecord[]>(mockBatches);
  const [isProcessing, setIsProcessing] = useState(false);
  const [printingProgress, setPrintingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState<BatchForm>({
    fertilizerType: '',
    quantity: '',
    unit: 'ton',
    batchNumber: '',
    productionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         batch.fertilizerType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'di_pabrik': { label: 'Di Pabrik', variant: 'outline' as const },
      'dalam_perjalanan': { label: 'Dalam Perjalanan', variant: 'default' as const },
      'tiba_gudang': { label: 'Tiba di Gudang', variant: 'secondary' as const },
      'terdistribusi': { label: 'Terdistribusi', variant: 'default' as const }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'di_pabrik': return <Package className="h-4 w-4 text-blue-500" />;
      case 'dalam_perjalanan': return <Truck className="h-4 w-4 text-orange-500" />;
      case 'tiba_gudang': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'terdistribusi': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const generateBatchNumber = (type: string) => {
    const prefix = fertilizerTypes.find(ft => ft.value === type)?.prefix || 'XX';
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const sequence = String(batches.length + 1).padStart(3, '0');
    return `BATCH-${prefix}-${today}-${sequence}`;
  };

  const handleCreateBatch = async () => {
    if (!form.fertilizerType || !form.quantity) return;

    setIsProcessing(true);
    setPrintingProgress(0);

    try {
      // Simulate QR code generation and printing
      const qrCodesCount = form.unit === 'ton' ? parseInt(form.quantity) * 2 : parseInt(form.quantity);
      const qrCodes: QRCode[] = [];
      
      for (let i = 0; i < qrCodesCount; i++) {
        // Simulate printing progress
        setPrintingProgress((i / qrCodesCount) * 50);
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const fertilizerType = fertilizerTypes.find(ft => ft.value === form.fertilizerType);
        const qrCode: QRCode = {
          id: `qr-${i + 1}`,
          code: `${fertilizerType?.prefix}-${String(i + 1).padStart(4, '0')}-${form.productionDate.replace(/-/g, '')}`,
          printed: true,
          printedAt: new Date(),
          status: 'active'
        };
        qrCodes.push(qrCode);
      }

      // Simulate blockchain NFT registration
      setPrintingProgress(60);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBatch: BatchRecord = {
        id: String(batches.length + 1),
        batchNumber: form.batchNumber || generateBatchNumber(form.fertilizerType),
        fertilizerType: fertilizerTypes.find(ft => ft.value === form.fertilizerType)?.label || '',
        quantity: parseInt(form.quantity),
        unit: form.unit,
        productionDate: new Date(form.productionDate),
        status: 'di_pabrik',
        qrCodes,
        nftAddress: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        blockchainTxHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        qualityCheck: true,
        expiryDate: new Date(new Date(form.productionDate).getTime() + 365 * 24 * 60 * 60 * 1000)
      };

      setPrintingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setBatches(prev => [newBatch, ...prev]);
      setForm({
        fertilizerType: '',
        quantity: '',
        unit: 'ton',
        batchNumber: '',
        productionDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setIsCreateDialogOpen(false);
      
    } catch (error) {
      console.error('Error creating batch:', error);
    } finally {
      setIsProcessing(false);
      setPrintingProgress(0);
    }
  };

  const handleViewQRCodes = (batch: BatchRecord) => {
    setSelectedBatch(batch);
    setIsQRDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Aset Pupuk</h1>
          <p className="text-muted-foreground">
            Kelola batch produksi, cetak QR code, dan daftarkan aset digital (NFT)
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cetak & Daftarkan Batch Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cetak & Daftarkan Batch Baru</DialogTitle>
              <DialogDescription>
                Buat batch produksi baru, cetak QR code, dan daftarkan sebagai NFT di blockchain
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fertilizerType">Jenis Pupuk</Label>
                <Select value={form.fertilizerType} onValueChange={(value) => setForm(prev => ({ ...prev, fertilizerType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis pupuk" />
                  </SelectTrigger>
                  <SelectContent>
                    {fertilizerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah</Label>
                <div className="flex space-x-2">
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Jumlah"
                    value={form.quantity}
                    onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="flex-1"
                  />
                  <Select value={form.unit} onValueChange={(value: 'ton' | 'karung') => setForm(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="karung">Karung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.quantity && (
                  <p className="text-sm text-muted-foreground">
                    QR codes yang akan dicetak: {form.unit === 'ton' ? parseInt(form.quantity) * 2 : parseInt(form.quantity)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNumber">Nomor Batch Produksi</Label>
                <Input
                  id="batchNumber"
                  placeholder="Auto-generate atau manual"
                  value={form.batchNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, batchNumber: e.target.value }))}
                />
                {form.fertilizerType && (
                  <p className="text-sm text-muted-foreground">
                    Suggested: {generateBatchNumber(form.fertilizerType)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productionDate">Tanggal Produksi</Label>
                <Input
                  id="productionDate"
                  type="date"
                  value={form.productionDate}
                  onChange={(e) => setForm(prev => ({ ...prev, productionDate: e.target.value }))}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan produksi..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Printer className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Mencetak QR codes...</span>
                </div>
                <Progress value={printingProgress} className="h-2" />
                {printingProgress >= 50 && printingProgress < 100 && (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Mendaftarkan NFT ke blockchain...</span>
                  </div>
                )}
                {printingProgress === 100 && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Batch berhasil didaftarkan!</span>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                onClick={handleCreateBatch} 
                disabled={isProcessing || !form.fertilizerType || !form.quantity}
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Cetak & Daftarkan
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {batches.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Batch</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {batches.filter(b => b.status === 'di_pabrik').length}
            </div>
            <p className="text-sm text-muted-foreground">Di Pabrik</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {batches.filter(b => b.status === 'dalam_perjalanan').length}
            </div>
            <p className="text-sm text-muted-foreground">Dalam Perjalanan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {batches.reduce((sum, batch) => sum + batch.qrCodes.length, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">QR Codes Dicetak</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari batch..."
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
            <SelectItem value="di_pabrik">Di Pabrik</SelectItem>
            <SelectItem value="dalam_perjalanan">Dalam Perjalanan</SelectItem>
            <SelectItem value="tiba_gudang">Tiba di Gudang</SelectItem>
            <SelectItem value="terdistribusi">Terdistribusi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batch Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Batch Produksi</CardTitle>
          <CardDescription>
            Klik pada batch untuk melihat detail QR codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Batch</TableHead>
                <TableHead>Jenis Pupuk</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tanggal Produksi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>QR Codes</TableHead>
                <TableHead>NFT Address</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                  <TableCell>{batch.fertilizerType}</TableCell>
                  <TableCell>{batch.quantity.toLocaleString()} {batch.unit}</TableCell>
                  <TableCell>{batch.productionDate.toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(batch.status)}
                      {getStatusBadge(batch.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {batch.qrCodes.length} codes
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {batch.nftAddress && (
                      <div className="flex items-center space-x-2">
                        <Link className="h-3 w-3" />
                        <span className="text-sm font-mono">{batch.nftAddress}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewQRCodes(batch)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* QR Codes Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>QR Codes - {selectedBatch?.batchNumber}</DialogTitle>
            <DialogDescription>
              Daftar semua QR codes dalam batch ini
            </DialogDescription>
          </DialogHeader>
          
          {selectedBatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total QR Codes:</span>
                  <p>{selectedBatch.qrCodes.length}</p>
                </div>
                <div>
                  <span className="font-medium">Dicetak:</span>
                  <p>{selectedBatch.qrCodes.filter(qr => qr.printed).length}</p>
                </div>
                <div>
                  <span className="font-medium">Aktif:</span>
                  <p>{selectedBatch.qrCodes.filter(qr => qr.status === 'active').length}</p>
                </div>
                <div>
                  <span className="font-medium">Blockchain:</span>
                  <p className="font-mono text-xs">{selectedBatch.blockchainTxHash}</p>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2">
                  {selectedBatch.qrCodes.slice(0, 100).map((qr, index) => (
                    <div key={qr.id} className="p-3 border rounded text-center">
                      <QrCode className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-xs font-mono">{qr.code}</p>
                      <Badge variant="outline" className="mt-1">
                        {qr.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                {selectedBatch.qrCodes.length > 100 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    ... dan {selectedBatch.qrCodes.length - 100} QR codes lainnya
                  </p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQRDialogOpen(false)}>
              Tutup
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}