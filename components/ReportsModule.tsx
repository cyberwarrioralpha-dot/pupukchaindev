import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { 
  FileText,
  Download,
  Calendar as CalendarIcon,
  Filter,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Eye,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'stock' | 'distribution' | 'financial' | 'performance';
  format: 'pdf' | 'excel' | 'both';
  lastGenerated?: Date;
  isScheduled: boolean;
  schedule?: string;
}

interface ReportData {
  id: string;
  name: string;
  type: string;
  generatedDate: Date;
  status: 'completed' | 'generating' | 'failed';
  size: string;
  downloadUrl?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Laporan Stok Bulanan',
    description: 'Ringkasan ketersediaan stok pupuk per wilayah dan jenis',
    category: 'stock',
    format: 'both',
    lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isScheduled: true,
    schedule: 'Setiap tanggal 1'
  },
  {
    id: '2',
    name: 'Laporan Distribusi Harian',
    description: 'Detail pengiriman dan status distribusi pupuk',
    category: 'distribution',
    format: 'pdf',
    lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isScheduled: true,
    schedule: 'Setiap hari jam 18:00'
  },
  {
    id: '3',
    name: 'Analisis Kinerja Distributor',
    description: 'Evaluasi performa dan efisiensi masing-masing distributor',
    category: 'performance',
    format: 'excel',
    lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isScheduled: false
  },
  {
    id: '4',
    name: 'Laporan Keuangan Subsidi',
    description: 'Ringkasan penyaluran dana subsidi pupuk per wilayah',
    category: 'financial',
    format: 'both',
    isScheduled: false
  }
];

const recentReports: ReportData[] = [
  {
    id: '1',
    name: 'Laporan_Stok_Januari_2025.pdf',
    type: 'Laporan Stok Bulanan',
    generatedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed',
    size: '2.3 MB',
    downloadUrl: '#'
  },
  {
    id: '2',
    name: 'Distribusi_Harian_14_Jan_2025.pdf',
    type: 'Laporan Distribusi Harian',
    generatedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'completed',
    size: '856 KB',
    downloadUrl: '#'
  },
  {
    id: '3',
    name: 'Analisis_Kinerja_Q4_2024.xlsx',
    type: 'Analisis Kinerja Distributor',
    generatedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'generating',
    size: '-'
  },
  {
    id: '4',
    name: 'Keuangan_Subsidi_Des_2024.pdf',
    type: 'Laporan Keuangan Subsidi',
    generatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'failed',
    size: '-'
  }
];

export function ReportsModule() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'stock', label: 'Stok & Inventory' },
    { value: 'distribution', label: 'Distribusi' },
    { value: 'financial', label: 'Keuangan' },
    { value: 'performance', label: 'Kinerja' }
  ];

  const filteredTemplates = reportTemplates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const handleGenerateReport = async (templateId: string, format: 'pdf' | 'excel') => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation with progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          // Show success message
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call to generate report
    setTimeout(() => {
      clearInterval(interval);
      setIsGenerating(false);
      setGenerationProgress(100);
      
      // In real app, this would trigger download
      const template = reportTemplates.find(t => t.id === templateId);
      const fileName = `${template?.name.replace(/\s+/g, '_')}_${format.toUpperCase()}_${format(new Date(), 'dd_MM_yyyy')}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = '#'; // In real app, this would be the actual file URL
      link.download = fileName;
      link.click();
      
      setTimeout(() => setGenerationProgress(0), 2000);
    }, 3000);
  };

  const handleBatchGenerate = () => {
    if (selectedTemplates.length === 0) return;
    
    selectedTemplates.forEach((templateId, index) => {
      setTimeout(() => {
        const template = reportTemplates.find(t => t.id === templateId);
        if (template) {
          handleGenerateReport(templateId, template.format === 'both' ? 'pdf' : template.format as 'pdf' | 'excel');
        }
      }, index * 1000);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'generating':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stock':
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'distribution':
        return <PieChart className="h-4 w-4 text-green-500" />;
      case 'financial':
        return <FileSpreadsheet className="h-4 w-4 text-purple-500" />;
      case 'performance':
        return <BarChart3 className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Modul Laporan</h1>
          <p className="text-muted-foreground">
            Generate dan kelola laporan distribusi pupuk dengan export PDF/Excel
          </p>
        </div>
        <Button onClick={handleBatchGenerate} disabled={selectedTemplates.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Generate Batch ({selectedTemplates.length})
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori Laporan</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, 'dd MMM yyyy', { locale: idLocale }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Akhir</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, 'dd MMM yyyy', { locale: idLocale }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generating report...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Laporan</CardTitle>
            <CardDescription>
              Pilih template untuk generate laporan sesuai kebutuhan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedTemplates.includes(template.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTemplates(prev => [...prev, template.id]);
                          } else {
                            setSelectedTemplates(prev => prev.filter(id => id !== template.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(template.category)}
                          <h3 className="font-medium">{template.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        {template.lastGenerated && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Terakhir dibuat: {format(template.lastGenerated, 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                          </p>
                        )}
                      </div>
                    </div>
                    {template.isScheduled && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Terjadwal
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {(template.format === 'pdf' || template.format === 'both') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReport(template.id, 'pdf')}
                          disabled={isGenerating}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      )}
                      {(template.format === 'excel' || template.format === 'both') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReport(template.id, 'excel')}
                          disabled={isGenerating}
                        >
                          <FileSpreadsheet className="h-3 w-3 mr-1" />
                          Excel
                        </Button>
                      )}
                    </div>
                    {template.schedule && (
                      <span className="text-xs text-muted-foreground">
                        {template.schedule}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Laporan Terbaru</CardTitle>
            <CardDescription>
              Riwayat laporan yang telah dibuat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {getStatusIcon(report.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{report.name}</h4>
                      <span className="text-xs text-muted-foreground">{report.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(report.generatedDate, 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                    </p>
                  </div>
                  {report.status === 'completed' && report.downloadUrl && (
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">24</div>
              <p className="text-sm text-muted-foreground">Total Template</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">Laporan Bulan Ini</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Laporan Terjadwal</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}