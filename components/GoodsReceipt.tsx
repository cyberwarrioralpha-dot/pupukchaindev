
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { QrCode, Scan, Package, Check, X, AlertCircle, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { QRScanner } from './QRScanner';
import { useNotifications } from './NotificationManager';

const mockScannedData = {
  batchId: 'BATCH-2024-001234',
  product: 'Pupuk Urea',
  quantity: 10,
  unit: 'Ton',
  source: 'Gudang Provinsi Jawa Timur',
  supplier: 'PT Pupuk Indonesia',
  qualityGrade: 'A',
  productionDate: '2024-01-15',
  expiryDate: '2025-01-15'
};

const recentReceipts = [
  {
    id: 'RCP-001',
    timestamp: '2024-01-20 14:30',
    product: 'Pupuk Urea',
    quantity: 15,
    unit: 'Ton',
    source: 'Gudang Provinsi Jawa Timur',
    status: 'completed',
    blockchainTx: '0x1234...5678'
  },
  {
    id: 'RCP-002',
    timestamp: '2024-01-20 10:15',
    product: 'NPK Premium',
    quantity: 8,
    unit: 'Ton',
    source: 'PT Pupuk Indonesia',
    status: 'completed',
    blockchainTx: '0x2345...6789'
  },
  {
    id: 'RCP-003',
    timestamp: '2024-01-19 16:45',
    product: 'TSP',
    quantity: 12,
    unit: 'Ton',
    source: 'Gudang Provinsi Jawa Barat',
    status: 'completed',
    blockchainTx: '0x3456...7890'
  }
];

export function GoodsReceipt() {
  const [scannedData, setScannedData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanSettings, setScanSettings] = useState({
    autoAccept: false,
    soundEnabled: true,
    blockchainVerification: true
  });
  
  const { addNotification } = useNotifications();

  const handleScan = (qrData: string) => {
    try {
      // Parse QR code data (format: BATCH-ID|Product|Quantity|Unit|Source|ProductionDate|ExpiryDate)
      const parts = qrData.split('|');
      if (parts.length >= 7) {
        const data = {
          batchId: parts[0],
          product: parts[1],
          quantity: parseInt(parts[2]),
          unit: parts[3],
          source: parts[4],
          supplier: parts[4].includes('PT') ? parts[4] : 'PT Pupuk Indonesia',
          qualityGrade: 'A',
          productionDate: parts[5],
          expiryDate: parts[6]
        };
        setScannedData(data);
        setShowScanner(false);
        setShowConfirmation(true);
        
        // Add notification
        addNotification({
          type: 'info',
          title: 'QR Code Berhasil Dipindai',
          message: `${data.product} ${data.quantity} ${data.unit} dari ${data.source}`,
          priority: 'medium'
        });
      } else {
        throw new Error('Invalid QR code format');
      }
    } catch (error) {
      addNotification({
        type: 'warning',
        title: 'QR Code Tidak Valid',
        message: 'Format QR code tidak sesuai dengan standar sistem',
        priority: 'medium'
      });
    }
  };

  const handleScanError = (error: string) => {
    addNotification({
      type: 'warning',
      title: 'Error Scanner',
      message: error,
      priority: 'medium'
    });
  };

  const handleConfirmReceipt = () => {
    // Simulate blockchain transaction
    setShowConfirmation(false);
    
    addNotification({
      type: 'success',
      title: 'Penerimaan Barang Berhasil',
      message: `${scannedData.product} ${scannedData.quantity} ${scannedData.unit} telah diterima dan tercatat di blockchain`,
      priority: 'medium'
    });
    
    setScannedData(null);
    // Here you would typically update the inventory
  };

  const handleRejectReceipt = () => {
    setShowConfirmation(false);
    setScannedData(null);
    
    addNotification({
      type: 'info',
      title: 'Penerimaan Barang Dibatalkan',
      message: 'Proses penerimaan barang telah dibatalkan',
      priority: 'low'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Penerimaan Barang</h1>
          <p className="text-muted-foreground">
            Pindai kode QR untuk menerima pengiriman pupuk dari supplier atau gudang hulu
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pengaturan Scanner</DialogTitle>
                <DialogDescription>
                  Konfigurasi perilaku scanner QR code
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label>Auto Accept QR Valid</label>
                  <input
                    type="checkbox"
                    checked={scanSettings.autoAccept}
                    onChange={(e) => setScanSettings({...scanSettings, autoAccept: e.target.checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label>Sound on Scan</label>
                  <input
                    type="checkbox"
                    checked={scanSettings.soundEnabled}
                    onChange={(e) => setScanSettings({...scanSettings, soundEnabled: e.target.checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label>Blockchain Verification</label>
                  <input
                    type="checkbox"
                    checked={scanSettings.blockchainVerification}
                    onChange={(e) => setScanSettings({...scanSettings, blockchainVerification: e.target.checked})}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setShowScanner(true)} className="flex items-center gap-2">
            <Scan className="w-4 h-4" />
            Buka Scanner
          </Button>
        </div>
      </div>

      {/* Main Scanner Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="w-6 h-6" />
            Quick Scan
          </CardTitle>
          <CardDescription>
            Mulai pemindaian cepat untuk penerimaan barang
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">Siap untuk memindai</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowScanner(true)}
            size="lg"
            className="w-full max-w-md"
          >
            Mulai Pemindaian
          </Button>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Kamera</p>
              <p className="font-semibold text-green-600">✓ Tersedia</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hardware</p>
              <p className="font-semibold text-blue-600">✓ Terhubung</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blockchain</p>
              <p className="font-semibold text-purple-600">✓ Online</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Scanner Component */}
      <QRScanner
        isActive={showScanner}
        onScan={handleScan}
        onError={handleScanError}
        onClose={() => setShowScanner(false)}
      />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Konfirmasi Penerimaan Barang
            </DialogTitle>
            <DialogDescription>
              Verifikasi detail produk sebelum mengonfirmasi penerimaan
            </DialogDescription>
          </DialogHeader>
          
          {scannedData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Batch ID</label>
                  <p className="font-mono text-sm">{scannedData.batchId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Produk</label>
                  <p>{scannedData.product}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Jumlah</label>
                  <p className="font-semibold">{scannedData.quantity} {scannedData.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kualitas</label>
                  <Badge variant="default">Grade {scannedData.qualityGrade}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Asal</label>
                  <p>{scannedData.source}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Supplier</label>
                  <p>{scannedData.supplier}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Produksi</label>
                  <p>{scannedData.productionDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Kedaluwarsa</label>
                  <p>{scannedData.expiryDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-blue-700">
                  Setelah dikonfirmasi, smart contract akan dieksekusi dan stok akan otomatis bertambah
                </p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleRejectReceipt}>
                  <X className="w-4 h-4 mr-2" />
                  Tolak
                </Button>
                <Button onClick={handleConfirmReceipt}>
                  <Check className="w-4 h-4 mr-2" />
                  Konfirmasi Penerimaan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recent Receipts */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Penerimaan Terbaru</CardTitle>
          <CardDescription>
            Daftar barang yang telah diterima dalam periode terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Asal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Blockchain TX</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-mono text-sm">{receipt.timestamp}</TableCell>
                  <TableCell>{receipt.product}</TableCell>
                  <TableCell>{receipt.quantity} {receipt.unit}</TableCell>
                  <TableCell>{receipt.source}</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      <Check className="w-3 h-3 mr-1" />
                      Selesai
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {receipt.blockchainTx}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
