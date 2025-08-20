import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Camera, 
  QrCode, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  Calendar,
  MapPin,
  Factory,
  Zap,
  Upload,
  Download,
  History,
  Search,
  Eye,
  Copy,
  RefreshCw,
  Smartphone,
  Layers,
  Database,
  Link,
  ExternalLink,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

interface ScannedQRData {
  id: string;
  batchId: string;
  productName: string;
  quantity: number;
  grade: string;
  productionDate: Date;
  expiryDate: Date;
  manufacturer: string;
  blockchainHash: string;
  nftTokenId?: string;
  verificationStatus: 'verified' | 'invalid' | 'expired' | 'counterfeit';
  certifications: string[];
  composition: { [key: string]: number };
  scannedAt: Date;
}

interface ScanHistory {
  id: string;
  qrData: ScannedQRData;
  scanLocation: string;
  scannerUserId: string;
  scanTimestamp: Date;
  verificationResult: 'valid' | 'invalid' | 'suspicious';
}

const mockScannedData: ScannedQRData = {
  id: 'qr-scan-001',
  batchId: 'BTH-2024-001',
  productName: 'Urea 46%',
  quantity: 25000,
  grade: 'A',
  productionDate: new Date('2024-07-15'),
  expiryDate: new Date('2026-07-15'),
  manufacturer: 'PT Pupuk Indonesia',
  blockchainHash: '0xabcdef123456789',
  nftTokenId: 'NFT-001',
  verificationStatus: 'verified',
  certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
  composition: { N: 46, P: 0, K: 0 },
  scannedAt: new Date()
};

const mockScanHistory: ScanHistory[] = [
  {
    id: 'scan-001',
    qrData: mockScannedData,
    scanLocation: 'Warehouse A, Jakarta',
    scannerUserId: 'user-001',
    scanTimestamp: new Date(),
    verificationResult: 'valid'
  },
  {
    id: 'scan-002',
    qrData: { ...mockScannedData, batchId: 'BTH-2024-002', verificationStatus: 'invalid' },
    scanLocation: 'Distribution Center, Surabaya',
    scannerUserId: 'user-002',
    scanTimestamp: new Date(Date.now() - 1000 * 60 * 30),
    verificationResult: 'invalid'
  }
];

export function EnhancedQRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedQRData | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>(mockScanHistory);
  const [manualQRInput, setManualQRInput] = useState('');
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [showBlockchainDetails, setShowBlockchainDetails] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      case 'counterfeit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'invalid': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'expired': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'counterfeit': return <Shield className="w-5 h-5 text-red-600" />;
      default: return <QrCode className="w-5 h-5 text-gray-600" />;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setCameraPermission('granted');
      setIsScanning(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission('denied');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const simulateQRScan = async (qrData?: string) => {
    setVerificationInProgress(true);
    
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scannedResult = qrData ? 
      { ...mockScannedData, id: `qr-scan-${Date.now()}`, scannedAt: new Date() } :
      mockScannedData;
    
    setScannedData(scannedResult);
    setVerificationInProgress(false);
    
    // Add to scan history
    const newScan: ScanHistory = {
      id: `scan-${Date.now()}`,
      qrData: scannedResult,
      scanLocation: 'Current Location',
      scannerUserId: 'current-user',
      scanTimestamp: new Date(),
      verificationResult: scannedResult.verificationStatus === 'verified' ? 'valid' : 'invalid'
    };
    
    setScanHistory([newScan, ...scanHistory]);
  };

  const handleManualScan = () => {
    if (manualQRInput.trim()) {
      simulateQRScan(manualQRInput);
      setManualQRInput('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate: Date) => {
    return new Date() > expiryDate;
  };

  const getExpiryStatus = (expiryDate: Date) => {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', days: Math.abs(daysUntilExpiry), color: 'text-red-600' };
    if (daysUntilExpiry < 30) return { status: 'expiring', days: daysUntilExpiry, color: 'text-orange-600' };
    return { status: 'valid', days: daysUntilExpiry, color: 'text-green-600' };
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <QrCode className="w-8 h-8 text-blue-600" />
            QR Code Scanner & Verification
          </h1>
          <p className="text-muted-foreground">
            Scan and verify fertilizer QR codes with blockchain authentication
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            Scan History
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-gray-100 rounded-lg object-cover"
                  playsInline
                  muted
                />
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Camera not active</p>
                    </div>
                  </div>
                )}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-blue-500 rounded-lg bg-transparent">
                      <div className="w-full h-full border-4 border-transparent border-t-blue-500 border-l-blue-500 rounded-lg"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Camera Controls */}
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                      <XCircle className="w-4 h-4 mr-2" />
                      Stop Camera
                    </Button>
                    <Button onClick={() => simulateQRScan()} className="flex-1">
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan QR Code
                    </Button>
                  </>
                )}
              </div>
              
              {cameraPermission === 'denied' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Camera access denied. Please enable camera permissions to scan QR codes.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Manual Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Manual Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">QR Code Data</label>
                <Input
                  value={manualQRInput}
                  onChange={(e) => setManualQRInput(e.target.value)}
                  placeholder="Enter QR code data manually"
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleManualScan}
                disabled={!manualQRInput.trim() || verificationInProgress}
                className="w-full"
              >
                {verificationInProgress ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Verify QR Code
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Or upload QR code image</p>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Results */}
      {scannedData && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(scannedData.verificationStatus)}
              Verification Results
              <Badge className={getStatusColor(scannedData.verificationStatus)}>
                {scannedData.verificationStatus.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Product Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Batch ID:</span>
                      <span className="text-sm font-medium">{scannedData.batchId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Product:</span>
                      <span className="text-sm font-medium">{scannedData.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="text-sm font-medium">{scannedData.quantity.toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Grade:</span>
                      <Badge className={scannedData.grade === 'A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        Grade {scannedData.grade}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Manufacturer:</span>
                      <span className="text-sm font-medium">{scannedData.manufacturer}</span>
                    </div>
                  </div>
                </div>

                {/* Composition */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Composition</h3>
                  <div className="space-y-2">
                    {Object.entries(scannedData.composition).map(([element, percentage]) => (
                      <div key={element} className="flex justify-between">
                        <span className="text-sm text-gray-600">{element}:</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {scannedData.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dates and Blockchain */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Dates</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Production Date:</span>
                      <span className="text-sm font-medium">{formatDate(scannedData.productionDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expiry Date:</span>
                      <span className={`text-sm font-medium ${getExpiryStatus(scannedData.expiryDate).color}`}>
                        {formatDate(scannedData.expiryDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Scanned At:</span>
                      <span className="text-sm font-medium">{formatDate(scannedData.scannedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Expiry Status */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Expiry Status</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {(() => {
                      const expiry = getExpiryStatus(scannedData.expiryDate);
                      return (
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${expiry.color}`} />
                          <span className={`text-sm font-medium ${expiry.color}`}>
                            {expiry.status === 'expired' ? 
                              `Expired ${expiry.days} days ago` :
                              expiry.status === 'expiring' ?
                              `Expires in ${expiry.days} days` :
                              `Valid for ${expiry.days} days`
                            }
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Blockchain */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Blockchain Verification</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Blockchain Hash:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{scannedData.blockchainHash.substring(0, 10)}...</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(scannedData.blockchainHash)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {scannedData.nftTokenId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">NFT Token ID:</span>
                        <span className="text-sm font-medium">{scannedData.nftTokenId}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowBlockchainDetails(!showBlockchainDetails)}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {showBlockchainDetails ? 'Hide' : 'Show'} Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Details */}
            {showBlockchainDetails && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Blockchain Transaction Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Transaction Hash:</span>
                    <p className="font-mono break-all">{scannedData.blockchainHash}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Block Number:</span>
                    <p className="font-mono">18,547,892</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Gas Used:</span>
                    <p className="font-mono">21,000</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Confirmation:</span>
                    <p className="font-mono text-green-600">✓ Confirmed</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <Button>
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Product
              </Button>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Add to Inventory
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scanHistory.slice(0, 5).map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{scan.qrData.batchId}</p>
                    <p className="text-sm text-gray-600">{scan.qrData.productName}</p>
                    <p className="text-xs text-gray-500">{scan.scanLocation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={scan.verificationResult === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {scan.verificationResult}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {scan.scanTimestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}