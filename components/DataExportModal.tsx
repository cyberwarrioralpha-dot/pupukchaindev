import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Package, 
  Coins, 
  Database, 
  Calendar,
  Filter,
  Settings,
  Check,
  X,
  XCircle,
  RefreshCw,
  Eye,
  Save,
  Upload,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Target,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Users,
  Shield,
  Globe,
  Printer,
  Mail,
  Copy,
  ExternalLink,
  Folder,
  HardDrive,
  Cloud,
  Archive
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

interface ExportConfig {
  format: 'csv' | 'json' | 'excel' | 'pdf';
  dataType: 'qr-codes' | 'nfts' | 'transactions' | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    status?: string[];
    grade?: string[];
    productType?: string[];
    verificationStatus?: string[];
  };
  fields: string[];
  includeMetadata: boolean;
  includeImages: boolean;
  includeBlockchainData: boolean;
  customFilename?: string;
}

interface ExportProgress {
  stage: 'preparing' | 'filtering' | 'formatting' | 'generating' | 'compressing' | 'completed' | 'error';
  progress: number;
  message: string;
  recordsProcessed: number;
  totalRecords: number;
  estimatedTime?: number;
}

const exportFormats = [
  { value: 'csv', label: 'CSV File', icon: FileText, description: 'Comma-separated values for spreadsheet applications' },
  { value: 'json', label: 'JSON File', icon: FileText, description: 'JavaScript Object Notation for developers' },
  { value: 'excel', label: 'Excel File', icon: FileSpreadsheet, description: 'Microsoft Excel workbook format' },
  { value: 'pdf', label: 'PDF Report', icon: FileImage, description: 'Formatted report document' }
];

const dataTypes = [
  { value: 'qr-codes', label: 'QR Codes', icon: Package, description: 'All QR code data and metadata' },
  { value: 'nfts', label: 'NFTs', icon: Coins, description: 'NFT tokens and blockchain data' },
  { value: 'transactions', label: 'Transactions', icon: Database, description: 'Blockchain transaction history' },
  { value: 'all', label: 'Complete Dataset', icon: Archive, description: 'All data types combined' }
];

const availableFields = {
  'qr-codes': [
    { key: 'id', label: 'ID', required: true },
    { key: 'batchId', label: 'Batch ID', required: true },
    { key: 'productType', label: 'Product Type', required: false },
    { key: 'productName', label: 'Product Name', required: false },
    { key: 'quantity', label: 'Quantity', required: false },
    { key: 'grade', label: 'Grade', required: false },
    { key: 'productionDate', label: 'Production Date', required: false },
    { key: 'expiryDate', label: 'Expiry Date', required: false },
    { key: 'qrCode', label: 'QR Code', required: false },
    { key: 'status', label: 'Status', required: false },
    { key: 'createdAt', label: 'Created At', required: false },
    { key: 'nftTokenId', label: 'NFT Token ID', required: false },
    { key: 'blockchainTxHash', label: 'Blockchain Hash', required: false },
    { key: 'manufacturer', label: 'Manufacturer', required: false },
    { key: 'certifications', label: 'Certifications', required: false },
    { key: 'composition', label: 'Composition', required: false },
    { key: 'storageConditions', label: 'Storage Conditions', required: false },
    { key: 'handlingInstructions', label: 'Handling Instructions', required: false }
  ],
  'nfts': [
    { key: 'tokenId', label: 'Token ID', required: true },
    { key: 'contractAddress', label: 'Contract Address', required: true },
    { key: 'name', label: 'Name', required: false },
    { key: 'description', label: 'Description', required: false },
    { key: 'image', label: 'Image URL', required: false },
    { key: 'attributes', label: 'Attributes', required: false },
    { key: 'owner', label: 'Owner', required: false },
    { key: 'creator', label: 'Creator', required: false },
    { key: 'mintedAt', label: 'Minted At', required: false },
    { key: 'transferHistory', label: 'Transfer History', required: false },
    { key: 'verificationStatus', label: 'Verification Status', required: false },
    { key: 'marketValue', label: 'Market Value', required: false }
  ],
  'transactions': [
    { key: 'txHash', label: 'Transaction Hash', required: true },
    { key: 'blockNumber', label: 'Block Number', required: false },
    { key: 'from', label: 'From Address', required: false },
    { key: 'to', label: 'To Address', required: false },
    { key: 'value', label: 'Value', required: false },
    { key: 'gasUsed', label: 'Gas Used', required: false },
    { key: 'gasPrice', label: 'Gas Price', required: false },
    { key: 'timestamp', label: 'Timestamp', required: false },
    { key: 'status', label: 'Status', required: false }
  ]
};

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodes: QRCodeData[];
  nfts: NFTData[];
}

export function DataExportModal({ isOpen, onClose, qrCodes, nfts }: DataExportModalProps) {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    dataType: 'qr-codes',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    filters: {
      status: [],
      grade: [],
      productType: [],
      verificationStatus: []
    },
    fields: ['id', 'batchId', 'productName', 'quantity', 'grade', 'status', 'createdAt'],
    includeMetadata: false,
    includeImages: false,
    includeBlockchainData: false,
    customFilename: ''
  });

  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    stage: 'preparing',
    progress: 0,
    message: 'Preparing export...',
    recordsProcessed: 0,
    totalRecords: 0
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportCompleted, setExportCompleted] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Get filtered data based on current config
  const getFilteredData = () => {
    let data: any[] = [];
    
    switch (exportConfig.dataType) {
      case 'qr-codes':
        data = qrCodes.filter(qr => {
          const createdAt = new Date(qr.createdAt);
          const inDateRange = createdAt >= new Date(exportConfig.dateRange.start) && 
                            createdAt <= new Date(exportConfig.dateRange.end);
          
          const matchesStatus = exportConfig.filters.status?.length === 0 || 
                               exportConfig.filters.status?.includes(qr.status);
          
          const matchesGrade = exportConfig.filters.grade?.length === 0 || 
                              exportConfig.filters.grade?.includes(qr.grade);
          
          const matchesType = exportConfig.filters.productType?.length === 0 || 
                             exportConfig.filters.productType?.includes(qr.productType);
          
          return inDateRange && matchesStatus && matchesGrade && matchesType;
        });
        break;
      
      case 'nfts':
        data = nfts.filter(nft => {
          const mintedAt = new Date(nft.mintedAt);
          const inDateRange = mintedAt >= new Date(exportConfig.dateRange.start) && 
                            mintedAt <= new Date(exportConfig.dateRange.end);
          
          const matchesStatus = exportConfig.filters.verificationStatus?.length === 0 || 
                               exportConfig.filters.verificationStatus?.includes(nft.verificationStatus);
          
          return inDateRange && matchesStatus;
        });
        break;
      
      case 'transactions':
        // Mock transaction data
        data = [
          { txHash: '0xabc123', blockNumber: 18500000, from: '0x123', to: '0x456', value: 0.1, gasUsed: 21000, gasPrice: 20, timestamp: new Date(), status: 'success' },
          { txHash: '0xdef456', blockNumber: 18500001, from: '0x789', to: '0xabc', value: 0.05, gasUsed: 25000, gasPrice: 22, timestamp: new Date(), status: 'success' }
        ];
        break;
      
      case 'all':
        data = [...qrCodes, ...nfts];
        break;
    }
    
    return data;
  };

  const generatePreview = () => {
    const filteredData = getFilteredData();
    const previewRows = filteredData.slice(0, 5).map(item => {
      const result: any = {};
      exportConfig.fields.forEach(field => {
        if (item[field] !== undefined) {
          result[field] = item[field];
        }
      });
      return result;
    });
    setPreviewData(previewRows);
    setShowPreview(true);
  };

  const startExport = async () => {
    setIsExporting(true);
    setExportCompleted(false);
    setExportError(null);
    
    try {
      const filteredData = getFilteredData();
      const totalRecords = filteredData.length;
      
      // Stage 1: Preparing
      setExportProgress({
        stage: 'preparing',
        progress: 0,
        message: 'Preparing export data...',
        recordsProcessed: 0,
        totalRecords,
        estimatedTime: Math.ceil(totalRecords * 0.1)
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 2: Filtering
      setExportProgress({
        stage: 'filtering',
        progress: 20,
        message: 'Applying filters...',
        recordsProcessed: 0,
        totalRecords,
        estimatedTime: Math.ceil(totalRecords * 0.08)
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Stage 3: Formatting
      setExportProgress({
        stage: 'formatting',
        progress: 40,
        message: 'Formatting data...',
        recordsProcessed: 0,
        totalRecords,
        estimatedTime: Math.ceil(totalRecords * 0.05)
      });
      
      // Simulate processing records
      for (let i = 0; i < totalRecords; i++) {
        await new Promise(resolve => setTimeout(resolve, 10));
        setExportProgress(prev => ({
          ...prev,
          progress: 40 + (i / totalRecords) * 30,
          recordsProcessed: i + 1
        }));
      }
      
      // Stage 4: Generating
      setExportProgress({
        stage: 'generating',
        progress: 70,
        message: `Generating ${exportConfig.format.toUpperCase()} file...`,
        recordsProcessed: totalRecords,
        totalRecords,
        estimatedTime: 3
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 5: Compressing (if needed)
      if (exportConfig.includeImages || totalRecords > 1000) {
        setExportProgress({
          stage: 'compressing',
          progress: 85,
          message: 'Compressing export file...',
          recordsProcessed: totalRecords,
          totalRecords,
          estimatedTime: 2
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Stage 6: Completed
      setExportProgress({
        stage: 'completed',
        progress: 100,
        message: 'Export completed successfully!',
        recordsProcessed: totalRecords,
        totalRecords,
        estimatedTime: 0
      });
      
      // Generate the actual file
      const processedData = filteredData.map(item => {
        const result: any = {};
        exportConfig.fields.forEach(field => {
          if (item[field] !== undefined) {
            result[field] = item[field];
          }
        });
        return result;
      });
      
      const filename = exportConfig.customFilename || 
                      `pupukchain_${exportConfig.dataType}_${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
      
      downloadFile(processedData, filename, exportConfig.format);
      
      setExportCompleted(true);
      
    } catch (error) {
      console.error('Export error:', error);
      setExportError('Failed to export data. Please try again.');
      setExportProgress({
        stage: 'error',
        progress: 0,
        message: 'Export failed',
        recordsProcessed: 0,
        totalRecords: 0
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (data: any[], filename: string, format: string) => {
    let content = '';
    let mimeType = '';
    
    switch (format) {
      case 'csv':
        const headers = Object.keys(data[0] || {});
        content = [
          headers.join(','),
          ...data.map(row => headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(','))
        ].join('\n');
        mimeType = 'text/csv';
        break;
      
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        break;
      
      case 'excel':
        // For demo purposes, we'll generate CSV-like content
        // In production, you'd use a library like xlsx
        const excelHeaders = Object.keys(data[0] || {});
        content = [
          excelHeaders.join('\t'),
          ...data.map(row => excelHeaders.map(header => 
            String(row[header] || '')
          ).join('\t'))
        ].join('\n');
        mimeType = 'application/vnd.ms-excel';
        break;
      
      case 'pdf':
        // For demo purposes, we'll generate text content
        // In production, you'd use a PDF library
        content = `PupukChain Export Report\n\n` +
                 `Generated: ${new Date().toLocaleString()}\n` +
                 `Records: ${data.length}\n\n` +
                 JSON.stringify(data, null, 2);
        mimeType = 'application/pdf';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetExport = () => {
    setIsExporting(false);
    setExportCompleted(false);
    setExportError(null);
    setShowPreview(false);
    setExportProgress({
      stage: 'preparing',
      progress: 0,
      message: 'Preparing export...',
      recordsProcessed: 0,
      totalRecords: 0
    });
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'preparing': return <Settings className="w-4 h-4" />;
      case 'filtering': return <Filter className="w-4 h-4" />;
      case 'formatting': return <FileText className="w-4 h-4" />;
      case 'generating': return <Zap className="w-4 h-4" />;
      case 'compressing': return <Archive className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <RefreshCw className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="w-6 h-6" />
              Export Data
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isExporting ? (
            // Export Progress View
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getStageIcon(exportProgress.stage)}
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {exportProgress.stage === 'completed' ? 'Export Complete!' : 
                   exportProgress.stage === 'error' ? 'Export Failed' : 'Exporting Data...'}
                </h3>
                <p className="text-muted-foreground">{exportProgress.message}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{exportProgress.progress}%</span>
                </div>
                <Progress value={exportProgress.progress} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Records Processed:</span>
                    <span className="ml-2 font-medium">
                      {exportProgress.recordsProcessed} / {exportProgress.totalRecords}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span className="ml-2 font-medium">
                      {exportProgress.estimatedTime ? `${exportProgress.estimatedTime}s` : 'Calculating...'}
                    </span>
                  </div>
                </div>
              </div>
              
              {exportProgress.stage === 'completed' && (
                <div className="flex gap-2">
                  <Button onClick={resetExport} variant="outline" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Export Again
                  </Button>
                  <Button onClick={onClose} className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                </div>
              )}
              
              {exportProgress.stage === 'error' && (
                <div className="flex gap-2">
                  <Button onClick={resetExport} variant="outline" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Configuration View
            <Tabs defaultValue="format" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                <TabsTrigger value="format">Format & Type</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>
              
              <div className="h-96 overflow-y-auto">
                {/* Format & Type Tab */}
                <TabsContent value="format" className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Export Format</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {exportFormats.map((format) => {
                        const IconComponent = format.icon;
                        return (
                          <Card
                            key={format.value}
                            className={`p-4 cursor-pointer transition-colors ${
                              exportConfig.format === format.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setExportConfig({...exportConfig, format: format.value as any})}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-6 h-6 text-blue-600" />
                              <div>
                                <h4 className="font-medium">{format.label}</h4>
                                <p className="text-sm text-muted-foreground">{format.description}</p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Data Type</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {dataTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <Card
                            key={type.value}
                            className={`p-4 cursor-pointer transition-colors ${
                              exportConfig.dataType === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setExportConfig({...exportConfig, dataType: type.value as any})}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-6 h-6 text-blue-600" />
                              <div>
                                <h4 className="font-medium">{type.label}</h4>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                {/* Filters Tab */}
                <TabsContent value="filters" className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Date Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={exportConfig.dateRange.start}
                          onChange={(e) => setExportConfig({
                            ...exportConfig,
                            dateRange: { ...exportConfig.dateRange, start: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={exportConfig.dateRange.end}
                          onChange={(e) => setExportConfig({
                            ...exportConfig,
                            dateRange: { ...exportConfig.dateRange, end: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {exportConfig.dataType === 'qr-codes' && (
                    <>
                      <div>
                        <Label>Status Filter</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['generated', 'printed', 'distributed', 'verified'].map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={`status-${status}`}
                                checked={exportConfig.filters.status?.includes(status)}
                                onCheckedChange={(checked) => {
                                  const newStatus = checked
                                    ? [...(exportConfig.filters.status || []), status]
                                    : (exportConfig.filters.status || []).filter(s => s !== status);
                                  setExportConfig({
                                    ...exportConfig,
                                    filters: { ...exportConfig.filters, status: newStatus }
                                  });
                                }}
                              />
                              <Label htmlFor={`status-${status}`} className="capitalize">{status}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Grade Filter</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {['A', 'B', 'C'].map((grade) => (
                            <div key={grade} className="flex items-center space-x-2">
                              <Checkbox
                                id={`grade-${grade}`}
                                checked={exportConfig.filters.grade?.includes(grade)}
                                onCheckedChange={(checked) => {
                                  const newGrade = checked
                                    ? [...(exportConfig.filters.grade || []), grade]
                                    : (exportConfig.filters.grade || []).filter(g => g !== grade);
                                  setExportConfig({
                                    ...exportConfig,
                                    filters: { ...exportConfig.filters, grade: newGrade }
                                  });
                                }}
                              />
                              <Label htmlFor={`grade-${grade}`}>Grade {grade}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Product Type Filter</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['Urea', 'NPK', 'ZA', 'SP-36', 'KCl'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`type-${type}`}
                                checked={exportConfig.filters.productType?.includes(type)}
                                onCheckedChange={(checked) => {
                                  const newType = checked
                                    ? [...(exportConfig.filters.productType || []), type]
                                    : (exportConfig.filters.productType || []).filter(t => t !== type);
                                  setExportConfig({
                                    ...exportConfig,
                                    filters: { ...exportConfig.filters, productType: newType }
                                  });
                                }}
                              />
                              <Label htmlFor={`type-${type}`}>{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {exportConfig.dataType === 'nfts' && (
                    <div>
                      <Label>Verification Status Filter</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['pending', 'verified', 'rejected'].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`nft-status-${status}`}
                              checked={exportConfig.filters.verificationStatus?.includes(status)}
                              onCheckedChange={(checked) => {
                                const newStatus = checked
                                  ? [...(exportConfig.filters.verificationStatus || []), status]
                                  : (exportConfig.filters.verificationStatus || []).filter(s => s !== status);
                                setExportConfig({
                                  ...exportConfig,
                                  filters: { ...exportConfig.filters, verificationStatus: newStatus }
                                });
                              }}
                            />
                            <Label htmlFor={`nft-status-${status}`} className="capitalize">{status}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Fields Tab */}
                <TabsContent value="fields" className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Select Fields to Export</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableFields[exportConfig.dataType]?.map((field) => (
                        <div key={field.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`field-${field.key}`}
                            checked={exportConfig.fields.includes(field.key)}
                            disabled={field.required}
                            onCheckedChange={(checked) => {
                              const newFields = checked
                                ? [...exportConfig.fields, field.key]
                                : exportConfig.fields.filter(f => f !== field.key);
                              setExportConfig({
                                ...exportConfig,
                                fields: newFields
                              });
                            }}
                          />
                          <Label htmlFor={`field-${field.key}`} className="flex-1">
                            {field.label}
                            {field.required && (
                              <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const allFields = availableFields[exportConfig.dataType]?.map(f => f.key) || [];
                        setExportConfig({...exportConfig, fields: allFields});
                      }}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const requiredFields = availableFields[exportConfig.dataType]?.filter(f => f.required).map(f => f.key) || [];
                        setExportConfig({...exportConfig, fields: requiredFields});
                      }}
                    >
                      Required Only
                    </Button>
                  </div>
                  
                  <div>
                    <Button
                      variant="outline"
                      onClick={generatePreview}
                      disabled={exportConfig.fields.length === 0}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Data
                    </Button>
                  </div>
                  
                  {showPreview && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Preview (First 5 records)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              {exportConfig.fields.map(field => (
                                <th key={field} className="text-left p-2 border-r">
                                  {availableFields[exportConfig.dataType]?.find(f => f.key === field)?.label || field}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((row, index) => (
                              <tr key={index} className="border-b">
                                {exportConfig.fields.map(field => (
                                  <td key={field} className="p-2 border-r">
                                    {String(row[field] || '')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Options Tab */}
                <TabsContent value="options" className="p-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Export Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeMetadata"
                          checked={exportConfig.includeMetadata}
                          onCheckedChange={(checked) => 
                            setExportConfig({...exportConfig, includeMetadata: checked as boolean})
                          }
                        />
                        <Label htmlFor="includeMetadata">Include detailed metadata</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeImages"
                          checked={exportConfig.includeImages}
                          onCheckedChange={(checked) => 
                            setExportConfig({...exportConfig, includeImages: checked as boolean})
                          }
                        />
                        <Label htmlFor="includeImages">Include images and QR codes</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeBlockchainData"
                          checked={exportConfig.includeBlockchainData}
                          onCheckedChange={(checked) => 
                            setExportConfig({...exportConfig, includeBlockchainData: checked as boolean})
                          }
                        />
                        <Label htmlFor="includeBlockchainData">Include blockchain data</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="customFilename">Custom Filename (optional)</Label>
                    <Input
                      id="customFilename"
                      value={exportConfig.customFilename}
                      onChange={(e) => setExportConfig({...exportConfig, customFilename: e.target.value})}
                      placeholder="my-export-file"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      File extension will be added automatically
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Export Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Format:</strong> {exportFormats.find(f => f.value === exportConfig.format)?.label}</p>
                      <p><strong>Data Type:</strong> {dataTypes.find(t => t.value === exportConfig.dataType)?.label}</p>
                      <p><strong>Fields:</strong> {exportConfig.fields.length} selected</p>
                      <p><strong>Estimated Records:</strong> {getFilteredData().length}</p>
                      <p><strong>Date Range:</strong> {exportConfig.dateRange.start} to {exportConfig.dateRange.end}</p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </CardContent>
        
        {!isExporting && (
          <div className="border-t p-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {getFilteredData().length} records will be exported
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={startExport}
                disabled={exportConfig.fields.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Start Export
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}