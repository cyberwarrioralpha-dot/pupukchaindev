import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { BlockchainSettings } from './BlockchainSettings';
import { DataExportModal } from './DataExportModal';
import { 
  QrCode, 
  Coins, 
  Package, 
  Shield, 
  Download, 
  Upload, 
  Printer, 
  Eye, 
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Zap,
  Link,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  MapPin,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Layers,
  Database,
  Settings,
  ExternalLink,
  FileText,
  TrendingUp,
  Globe,
  Wallet,
  CreditCard,
  History
} from 'lucide-react';

interface QRCodeData {
  id: string;
  batchId: string;
  productType: string;
  productName: string;
  quantity: number;
  grade: string;
  productionDate: Date;
  expiryDate: Date;
  qrCode: string;
  nftTokenId?: string;
  nftContractAddress?: string;
  blockchainTxHash?: string;
  status: 'generated' | 'printed' | 'distributed' | 'verified';
  createdAt: Date;
  metadata: {
    manufacturer: string;
    certifications: string[];
    composition: { [key: string]: number };
    storageConditions: string;
    handlingInstructions: string;
  };
}

interface NFTData {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  owner: string;
  creator: string;
  mintedAt: Date;
  transferHistory: Array<{
    from: string;
    to: string;
    timestamp: Date;
    txHash: string;
  }>;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  marketValue?: number;
}

interface BlockchainStats {
  totalNFTs: number;
  totalTransactions: number;
  activeContracts: number;
  gasUsed: number;
  averageGasPrice: number;
  networkHealth: 'healthy' | 'degraded' | 'down';
}

const mockQRCodes: QRCodeData[] = [
  {
    id: 'qr-001',
    batchId: 'BTH-2024-001',
    productType: 'Urea',
    productName: 'Urea 46%',
    quantity: 25000,
    grade: 'A',
    productionDate: new Date('2024-07-15'),
    expiryDate: new Date('2026-07-15'),
    qrCode: 'QR123456789ABCDEF',
    nftTokenId: 'NFT-001',
    nftContractAddress: '0x1234567890abcdef',
    blockchainTxHash: '0xabcdef123456789',
    status: 'distributed',
    createdAt: new Date('2024-07-15'),
    metadata: {
      manufacturer: 'PT Pupuk Indonesia',
      certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
      composition: { N: 46, P: 0, K: 0 },
      storageConditions: 'Dry, cool place',
      handlingInstructions: 'Wear protective equipment'
    }
  },
  {
    id: 'qr-002',
    batchId: 'BTH-2024-002',
    productType: 'NPK',
    productName: 'NPK 15-15-15',
    quantity: 18000,
    grade: 'A',
    productionDate: new Date('2024-07-15'),
    expiryDate: new Date('2026-07-15'),
    qrCode: 'QR987654321FEDCBA',
    nftTokenId: 'NFT-002',
    nftContractAddress: '0x1234567890abcdef',
    blockchainTxHash: '0xfedcba987654321',
    status: 'printed',
    createdAt: new Date('2024-07-15'),
    metadata: {
      manufacturer: 'PT Pupuk Indonesia',
      certifications: ['ISO 9001', 'ISO 14001'],
      composition: { N: 15, P: 15, K: 15 },
      storageConditions: 'Dry, cool place',
      handlingInstructions: 'Avoid moisture'
    }
  },
  {
    id: 'qr-003',
    batchId: 'BTH-2024-003',
    productType: 'ZA',
    productName: 'ZA 21%',
    quantity: 22000,
    grade: 'B',
    productionDate: new Date('2024-07-14'),
    expiryDate: new Date('2026-07-14'),
    qrCode: 'QR456789123ABCDEF',
    nftTokenId: 'NFT-003',
    nftContractAddress: '0x1234567890abcdef',
    blockchainTxHash: '0x123456789abcdef',
    status: 'verified',
    createdAt: new Date('2024-07-14'),
    metadata: {
      manufacturer: 'PT Pupuk Indonesia',
      certifications: ['ISO 9001'],
      composition: { N: 21, S: 24 },
      storageConditions: 'Keep dry and cool',
      handlingInstructions: 'Use protective equipment'
    }
  },
  {
    id: 'qr-004',
    batchId: 'BTH-2024-004',
    productType: 'SP-36',
    productName: 'SP-36 (Superphosphate)',
    quantity: 15000,
    grade: 'A',
    productionDate: new Date('2024-07-13'),
    expiryDate: new Date('2026-07-13'),
    qrCode: 'QR789123456FEDCBA',
    nftTokenId: 'NFT-004',
    nftContractAddress: '0x1234567890abcdef',
    blockchainTxHash: '0x987654321fedcba',
    status: 'generated',
    createdAt: new Date('2024-07-13'),
    metadata: {
      manufacturer: 'PT Pupuk Indonesia',
      certifications: ['ISO 9001', 'ISO 14001'],
      composition: { P: 36, Ca: 20 },
      storageConditions: 'Store in dry place',
      handlingInstructions: 'Avoid moisture and heat'
    }
  }
];

const mockNFTs: NFTData[] = [
  {
    tokenId: 'NFT-001',
    contractAddress: '0x1234567890abcdef',
    name: 'Urea 46% Batch BTH-2024-001',
    description: 'Premium grade Urea fertilizer batch with full traceability',
    image: 'https://via.placeholder.com/300x300/3b82f6/ffffff?text=Urea+46%25',
    attributes: [
      { trait_type: 'Product Type', value: 'Urea' },
      { trait_type: 'Grade', value: 'A' },
      { trait_type: 'Quantity', value: 25000 },
      { trait_type: 'Nitrogen Content', value: 46 },
      { trait_type: 'Manufacturer', value: 'PT Pupuk Indonesia' }
    ],
    owner: '0xabcdef123456789',
    creator: '0x1234567890abcdef',
    mintedAt: new Date('2024-07-15'),
    transferHistory: [
      {
        from: '0x0000000000000000',
        to: '0x1234567890abcdef',
        timestamp: new Date('2024-07-15'),
        txHash: '0xabcdef123456789'
      }
    ],
    verificationStatus: 'verified',
    marketValue: 150000
  },
  {
    tokenId: 'NFT-002',
    contractAddress: '0x1234567890abcdef',
    name: 'NPK 15-15-15 Batch BTH-2024-002',
    description: 'High-quality NPK fertilizer with balanced nutrition',
    image: 'https://via.placeholder.com/300x300/10b981/ffffff?text=NPK+15-15-15',
    attributes: [
      { trait_type: 'Product Type', value: 'NPK' },
      { trait_type: 'Grade', value: 'A' },
      { trait_type: 'Quantity', value: 18000 },
      { trait_type: 'N-P-K Ratio', value: '15-15-15' },
      { trait_type: 'Manufacturer', value: 'PT Pupuk Indonesia' }
    ],
    owner: '0xfedcba987654321',
    creator: '0x1234567890abcdef',
    mintedAt: new Date('2024-07-15'),
    transferHistory: [
      {
        from: '0x0000000000000000',
        to: '0x1234567890abcdef',
        timestamp: new Date('2024-07-15'),
        txHash: '0xfedcba987654321'
      }
    ],
    verificationStatus: 'verified',
    marketValue: 180000
  },
  {
    tokenId: 'NFT-003',
    contractAddress: '0x1234567890abcdef',
    name: 'ZA 21% Batch BTH-2024-003',
    description: 'Ammonium Sulfate fertilizer for nitrogen and sulfur nutrition',
    image: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=ZA+21%25',
    attributes: [
      { trait_type: 'Product Type', value: 'ZA' },
      { trait_type: 'Grade', value: 'B' },
      { trait_type: 'Quantity', value: 22000 },
      { trait_type: 'Nitrogen Content', value: 21 },
      { trait_type: 'Sulfur Content', value: 24 },
      { trait_type: 'Manufacturer', value: 'PT Pupuk Indonesia' }
    ],
    owner: '0x123456789abcdef',
    creator: '0x1234567890abcdef',
    mintedAt: new Date('2024-07-14'),
    transferHistory: [
      {
        from: '0x0000000000000000',
        to: '0x1234567890abcdef',
        timestamp: new Date('2024-07-14'),
        txHash: '0x123456789abcdef'
      }
    ],
    verificationStatus: 'pending',
    marketValue: 120000
  }
];

const mockBlockchainStats: BlockchainStats = {
  totalNFTs: 1247,
  totalTransactions: 5689,
  activeContracts: 12,
  gasUsed: 2450000,
  averageGasPrice: 25.5,
  networkHealth: 'healthy'
};

export function QRCodeNFTManagement() {
  const [activeTab, setActiveTab] = useState('generate');
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>(mockQRCodes);
  const [nfts, setNFTs] = useState<NFTData[]>(mockNFTs);
  const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showBlockchainSettings, setShowBlockchainSettings] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // QR Code generation form
  const [qrForm, setQRForm] = useState({
    batchId: '',
    productType: '',
    productName: '',
    quantity: '',
    grade: 'A',
    expiryDate: '',
    storageConditions: '',
    handlingInstructions: ''
  });

  // NFT minting form
  const [nftForm, setNFTForm] = useState({
    qrCodeId: '',
    name: '',
    description: '',
    image: '',
    attributes: [{ trait_type: '', value: '' }]
  });

  const generateQRCode = async () => {
    setIsGenerating(true);
    
    // Simulate QR code generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newQRCode: QRCodeData = {
      id: `qr-${Date.now()}`,
      batchId: qrForm.batchId,
      productType: qrForm.productType,
      productName: qrForm.productName,
      quantity: parseInt(qrForm.quantity),
      grade: qrForm.grade,
      productionDate: new Date(),
      expiryDate: new Date(qrForm.expiryDate),
      qrCode: `QR${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      status: 'generated',
      createdAt: new Date(),
      metadata: {
        manufacturer: 'PT Pupuk Indonesia',
        certifications: ['ISO 9001', 'ISO 14001'],
        composition: { N: 46, P: 0, K: 0 },
        storageConditions: qrForm.storageConditions,
        handlingInstructions: qrForm.handlingInstructions
      }
    };

    setQRCodes([newQRCode, ...qrCodes]);
    setIsGenerating(false);
    
    // Reset form
    setQRForm({
      batchId: '',
      productType: '',
      productName: '',
      quantity: '',
      grade: 'A',
      expiryDate: '',
      storageConditions: '',
      handlingInstructions: ''
    });
  };

  const mintNFT = async () => {
    setIsMinting(true);
    
    // Simulate NFT minting
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newNFT: NFTData = {
      tokenId: `NFT-${Date.now()}`,
      contractAddress: '0x1234567890abcdef',
      name: nftForm.name,
      description: nftForm.description,
      image: nftForm.image || 'https://via.placeholder.com/300x300/3b82f6/ffffff?text=NFT',
      attributes: nftForm.attributes.filter(attr => attr.trait_type && attr.value),
      owner: '0x1234567890abcdef',
      creator: '0x1234567890abcdef',
      mintedAt: new Date(),
      transferHistory: [],
      verificationStatus: 'pending',
      marketValue: 0
    };

    setNFTs([newNFT, ...nfts]);
    setIsMinting(false);
    
    // Reset form
    setNFTForm({
      qrCodeId: '',
      name: '',
      description: '',
      image: '',
      attributes: [{ trait_type: '', value: '' }]
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const drawQRCode = (canvas: HTMLCanvasElement, data: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code representation
    const size = 200;
    const modules = 25;
    const moduleSize = size / modules;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    
    // Generate a simple pattern based on data
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const hash = (data.charCodeAt(i % data.length) + i + j) % 3;
        if (hash === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || qr.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'printed': return 'bg-yellow-100 text-yellow-800';
      case 'distributed': return 'bg-green-100 text-green-800';
      case 'verified': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (selectedQR && qrCanvasRef.current) {
      drawQRCode(qrCanvasRef.current, selectedQR.qrCode);
    }
  }, [selectedQR]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <QrCode className="w-8 h-8 text-blue-600" />
            QR Code & NFT Management
          </h1>
          <p className="text-muted-foreground">
            Generate QR codes, mint NFTs, and manage blockchain assets for fertilizer traceability
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowDataExport(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowBlockchainSettings(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Blockchain Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total QR Codes</p>
                <p className="text-2xl font-bold text-blue-600">{qrCodes.length}</p>
              </div>
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Minted NFTs</p>
                <p className="text-2xl font-bold text-green-600">{mockBlockchainStats.totalNFTs}</p>
              </div>
              <Coins className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blockchain Txs</p>
                <p className="text-2xl font-bold text-purple-600">{mockBlockchainStats.totalTransactions}</p>
              </div>
              <Database className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
                <p className="text-2xl font-bold text-orange-600">{mockBlockchainStats.activeContracts}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Status</p>
                <p className="text-sm font-bold text-green-600">
                  {mockBlockchainStats.networkHealth.toUpperCase()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="generate">Generate QR</TabsTrigger>
          <TabsTrigger value="qr-list">QR Code List</TabsTrigger>
          <TabsTrigger value="mint-nft">Mint NFT</TabsTrigger>
          <TabsTrigger value="nft-gallery">NFT Gallery</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        {/* Generate QR Tab */}
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Generate New QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input
                    id="batchId"
                    value={qrForm.batchId}
                    onChange={(e) => setQRForm({...qrForm, batchId: e.target.value})}
                    placeholder="BTH-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="productType">Product Type</Label>
                  <Select value={qrForm.productType} onValueChange={(value) => setQRForm({...qrForm, productType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urea">Urea</SelectItem>
                      <SelectItem value="NPK">NPK</SelectItem>
                      <SelectItem value="ZA">ZA (Ammonium Sulfate)</SelectItem>
                      <SelectItem value="SP-36">SP-36 (Superphosphate)</SelectItem>
                      <SelectItem value="KCl">KCl (Potassium Chloride)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={qrForm.productName}
                    onChange={(e) => setQRForm({...qrForm, productName: e.target.value})}
                    placeholder="Urea 46%"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={qrForm.quantity}
                    onChange={(e) => setQRForm({...qrForm, quantity: e.target.value})}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={qrForm.grade} onValueChange={(value) => setQRForm({...qrForm, grade: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={qrForm.expiryDate}
                    onChange={(e) => setQRForm({...qrForm, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="storageConditions">Storage Conditions</Label>
                <Input
                  id="storageConditions"
                  value={qrForm.storageConditions}
                  onChange={(e) => setQRForm({...qrForm, storageConditions: e.target.value})}
                  placeholder="Store in dry, cool place"
                />
              </div>
              
              <div>
                <Label htmlFor="handlingInstructions">Handling Instructions</Label>
                <Textarea
                  id="handlingInstructions"
                  value={qrForm.handlingInstructions}
                  onChange={(e) => setQRForm({...qrForm, handlingInstructions: e.target.value})}
                  placeholder="Wear protective equipment when handling"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateQRCode} 
                  disabled={isGenerating || !qrForm.batchId || !qrForm.productType}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* QR Code List Tab */}
        <TabsContent value="qr-list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code Management
              </CardTitle>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search by batch ID or product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="generated">Generated</SelectItem>
                    <SelectItem value="printed">Printed</SelectItem>
                    <SelectItem value="distributed">Distributed</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredQRCodes.map((qr) => (
                  <Card key={qr.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{qr.batchId}</h3>
                          <p className="text-sm text-muted-foreground">{qr.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {qr.quantity.toLocaleString()} kg • Grade {qr.grade}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(qr.status)}>
                            {qr.status.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {qr.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedQR(qr)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(qr.qrCode, qr.id)}
                          >
                            {copiedId === qr.id ? (
                              <Check className="w-4 h-4 mr-2" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            Copy
                          </Button>
                          <Button size="sm" variant="outline">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mint NFT Tab */}
        <TabsContent value="mint-nft">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Mint NFT from QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qrCodeId">Select QR Code</Label>
                  <Select value={nftForm.qrCodeId} onValueChange={(value) => setNFTForm({...nftForm, qrCodeId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select QR code to mint NFT" />
                    </SelectTrigger>
                    <SelectContent>
                      {qrCodes.map((qr) => (
                        <SelectItem key={qr.id} value={qr.id}>
                          {qr.batchId} - {qr.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="nftName">NFT Name</Label>
                  <Input
                    id="nftName"
                    value={nftForm.name}
                    onChange={(e) => setNFTForm({...nftForm, name: e.target.value})}
                    placeholder="Urea 46% Batch BTH-2024-001"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="nftDescription">Description</Label>
                <Textarea
                  id="nftDescription"
                  value={nftForm.description}
                  onChange={(e) => setNFTForm({...nftForm, description: e.target.value})}
                  placeholder="Premium grade fertilizer with full blockchain traceability"
                />
              </div>
              
              <div>
                <Label htmlFor="nftImage">Image URL</Label>
                <Input
                  id="nftImage"
                  value={nftForm.image}
                  onChange={(e) => setNFTForm({...nftForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label>NFT Attributes</Label>
                <div className="space-y-2">
                  {nftForm.attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Trait type"
                        value={attr.trait_type}
                        onChange={(e) => {
                          const newAttrs = [...nftForm.attributes];
                          newAttrs[index].trait_type = e.target.value;
                          setNFTForm({...nftForm, attributes: newAttrs});
                        }}
                      />
                      <Input
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) => {
                          const newAttrs = [...nftForm.attributes];
                          newAttrs[index].value = e.target.value;
                          setNFTForm({...nftForm, attributes: newAttrs});
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newAttrs = nftForm.attributes.filter((_, i) => i !== index);
                          setNFTForm({...nftForm, attributes: newAttrs});
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setNFTForm({
                      ...nftForm,
                      attributes: [...nftForm.attributes, { trait_type: '', value: '' }]
                    })}
                  >
                    Add Attribute
                  </Button>
                </div>
              </div>

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Minting NFT will create a permanent blockchain record. Gas fees apply.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  onClick={mintNFT} 
                  disabled={isMinting || !nftForm.qrCodeId || !nftForm.name}
                  className="flex-1"
                >
                  {isMinting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Mint NFT
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NFT Gallery Tab */}
        <TabsContent value="nft-gallery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                NFT Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <Card key={nft.tokenId} className="overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="flex items-center justify-center h-full">
                              <div class="text-center">
                                <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <span class="text-white font-bold text-xl">NFT</span>
                                </div>
                                <p class="text-sm text-gray-600">${nft.name}</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium truncate">{nft.name}</h3>
                        <Badge className={getVerificationColor(nft.verificationStatus)}>
                          {nft.verificationStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {nft.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Token ID:</span>
                          <span className="font-mono">{nft.tokenId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Owner:</span>
                          <span className="font-mono text-xs">{nft.owner.substring(0, 10)}...</span>
                        </div>
                        {nft.marketValue && (
                          <div className="flex justify-between text-sm">
                            <span>Value:</span>
                            <span className="font-medium text-green-600">
                              Rp {nft.marketValue.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedNFT(nft)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          OpenSea
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Blockchain Network Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Network Health</p>
                    <p className="text-lg font-bold text-green-600">HEALTHY</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg Gas Price</p>
                    <p className="text-lg font-bold text-blue-600">{mockBlockchainStats.averageGasPrice} Gwei</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Total Gas Used</p>
                    <p className="text-lg font-bold text-purple-600">{mockBlockchainStats.gasUsed.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Coins className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">NFT Mint Transaction</p>
                          <p className="text-sm text-muted-foreground">
                            Token ID: NFT-{String(i).padStart(3, '0')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">25.5 Gwei</p>
                        <p className="text-xs text-muted-foreground">2 min ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                QR Code & NFT Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Verification Process</h3>
                  <p className="text-sm text-blue-800">
                    Scan QR codes or verify NFT authenticity using blockchain verification
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="verifyQR">QR Code to Verify</Label>
                    <Input
                      id="verifyQR"
                      placeholder="Enter QR code data"
                    />
                  </div>
                  <div>
                    <Label htmlFor="verifyNFT">NFT Token ID</Label>
                    <Input
                      id="verifyNFT"
                      placeholder="Enter NFT token ID"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Authenticity
                  </Button>
                  <Button variant="outline">
                    <QrCode className="w-4 h-4 mr-2" />
                    Scan QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Preview Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>QR Code Details</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedQR(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <canvas
                    ref={qrCanvasRef}
                    width={200}
                    height={200}
                    className="border border-gray-300 rounded-lg mx-auto mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    QR Code: {selectedQR.qrCode}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label>Batch ID</Label>
                    <p className="font-medium">{selectedQR.batchId}</p>
                  </div>
                  <div>
                    <Label>Product</Label>
                    <p className="font-medium">{selectedQR.productName}</p>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <p className="font-medium">{selectedQR.quantity.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <Label>Grade</Label>
                    <Badge className={`${selectedQR.grade === 'A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      Grade {selectedQR.grade}
                    </Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedQR.status)}>
                      {selectedQR.status.toUpperCase()}
                    </Badge>
                  </div>
                  {selectedQR.nftTokenId && (
                    <div>
                      <Label>NFT Token ID</Label>
                      <p className="font-mono text-sm">{selectedQR.nftTokenId}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Blockchain Settings Modal */}
      <BlockchainSettings 
        isOpen={showBlockchainSettings} 
        onClose={() => setShowBlockchainSettings(false)} 
      />

      {/* Data Export Modal */}
      <DataExportModal 
        isOpen={showDataExport} 
        onClose={() => setShowDataExport(false)} 
        qrCodes={qrCodes}
        nfts={nfts}
      />
    </div>
  );
}