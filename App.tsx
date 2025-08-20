import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { AppSidebar } from './components/Sidebar';
import { DashboardContent } from './components/DashboardContent';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { GovernmentNotificationCenter } from './components/GovernmentNotificationCenter';
import { AIRegionalAnalysis } from './components/AIRegionalAnalysis';
import { AIEmergencyReportAnalysis } from './components/AIEmergencyReportAnalysis';
import { AIEmergencyAllocationAnalysis } from './components/AIEmergencyAllocationAnalysis';
import { AllocationManagement } from './components/AllocationManagement';
import { ProductionDashboard } from './components/ProductionDashboard';
import { RealTimeMonitoring } from './components/RealTimeMonitoring';
import { AssetManagement } from './components/AssetManagement';
import { ShippingManagement } from './components/ShippingManagement';
import { QRCodeNFTManagement } from './components/QRCodeNFTManagement';
import { EnhancedQRScanner } from './components/EnhancedQRScanner';
import { DistributorDashboard } from './components/DistributorDashboard';
import { DistributorManagement } from './components/DistributorManagement';
import { GoodsReceipt } from './components/GoodsReceipt';
import { TransactionHistory } from './components/TransactionHistory';
import { RetailerManagement } from './components/RetailerManagement';
import { SalesReports } from './components/SalesReports';
import { MapView } from './components/MapView';
import { ReportsModule } from './components/ReportsModule';
import { MarketTrendsAnalysis } from './components/MarketTrendsAnalysis';
import { NotificationProvider, NotificationPanel } from './components/NotificationManager';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Login } from './components/Login';
import { Bell } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';

const mockStats = {
  totalStok: 32500,
  distribusiAktif: 18,
  totalDistributor: 156,
  kioskTerdaftar: 2847
};

function AppContent() {
  const [activeMenuItem, setActiveMenuItem] = useState('/');
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();

  const handleMenuItemClick = (href: string) => {
    setActiveMenuItem(href);
    console.log('Navigating to:', href);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-xl">PC</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  const renderContent = () => {
    // Distributor role specific routing
    if (user.role === 'Distributor') {
      switch (activeMenuItem) {
        case '/':
          return <DistributorDashboard />;
        case '/penerimaan-barang':
          return <GoodsReceipt />;
        case '/riwayat-transaksi':
          return <TransactionHistory />;
        case '/manajemen-pengecer':
          return <RetailerManagement />;
        case '/laporan-penjualan':
          return <SalesReports />;
        case '/scanner':
          return <EnhancedQRScanner />;
        case '/pengaturan':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Pengaturan Distributor</h1>
              <p className="text-muted-foreground mb-6">
                Konfigurasi untuk operasional distribusi dan manajemen inventaris
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Pengaturan Stok</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Auto Stock Alert</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Low Stock Threshold</span>
                      <input type="number" defaultValue="5" className="w-16 px-2 py-1 border rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Auto Reorder</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Pengaturan QR Scanner</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Auto Accept Valid QR</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sound on Scan</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Blockchain Verification</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return <DistributorDashboard />;
      }
    }

    // Producer role specific routing
    if (user.role === 'Producer') {
      switch (activeMenuItem) {
        case '/':
          return <ProductionDashboard />;
        case '/monitoring-realtime':
          return <RealTimeMonitoring />;
        case '/manajemen-aset':
          return <AssetManagement />;
        case '/manajemen-pengiriman':
          return <ShippingManagement />;
        case '/qr-nft':
          return <QRCodeNFTManagement />;
        case '/laporan-produksi':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Laporan Produksi</h1>
              <p className="text-muted-foreground mb-6">
                Analisis performa produksi, efisiensi, dan kualitas output
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Produksi Bulanan</h3>
                  <p className="text-3xl font-bold text-blue-600">12,450 Ton</p>
                  <p className="text-sm text-muted-foreground">Target: 12,000 ton</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Efisiensi Rata-rata</h3>
                  <p className="text-3xl font-bold text-green-600">92.3%</p>
                  <p className="text-sm text-muted-foreground">+2.1% dari bulan lalu</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Quality Pass Rate</h3>
                  <p className="text-3xl font-bold text-purple-600">98.7%</p>
                  <p className="text-sm text-muted-foreground">Standar industri</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Batch Diproduksi</h3>
                  <p className="text-3xl font-bold text-orange-600">156</p>
                  <p className="text-sm text-muted-foreground">Bulan ini</p>
                </div>
              </div>
            </div>
          );
        case '/pengaturan':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Pengaturan Sistem Produksi</h1>
              <p className="text-muted-foreground mb-6">
                Konfigurasi untuk sistem produksi dan manajemen aset
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Pengaturan Produksi</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Auto QR Code Generation</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Blockchain Auto-Registration</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quality Check Mandatory</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Pengaturan Printer</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Industrial Printer Connected</span>
                      <span className="text-green-600">✓ Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Auto Print QR Codes</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Print Quality Check</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return <ProductionDashboard />;
      }
    }

    // Government role specific routing
    if (user.role === 'Government') {
      switch (activeMenuItem) {
        case '/':
          return (
            <GovernmentDashboard 
              onNavigateToAI={() => setActiveMenuItem('/analisis-ai')}
              onNavigateToMap={() => setActiveMenuItem('/pemetaan')}
              onNavigateToEmergency={() => setActiveMenuItem('/laporan-darurat')}
              onNavigateToAllocation={() => setActiveMenuItem('/alokasi-darurat')}
            />
          );
        case '/alokasi':
          return <AllocationManagement />;
        case '/alokasi-darurat':
          return <AIEmergencyAllocationAnalysis />;
        case '/notifikasi':
          return <GovernmentNotificationCenter />;
        case '/analisis-ai':
          return <AIRegionalAnalysis />;
        case '/laporan-darurat':
          return <AIEmergencyReportAnalysis />;
        case '/monitoring-stok':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Monitoring Stok Nasional</h1>
              <p className="text-muted-foreground mb-6">
                Monitor ketersediaan stok pupuk bersubsidi di seluruh Indonesia secara real-time
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Total Stok Nasional</h3>
                  <p className="text-3xl font-bold text-blue-600">9.2 Juta Ton</p>
                  <p className="text-sm text-muted-foreground">Tersebar di 34 provinsi</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Stok Kritis</h3>
                  <p className="text-3xl font-bold text-red-600">45 Lokasi</p>
                  <p className="text-sm text-muted-foreground">Perlu restock segera</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Dalam Distribusi</h3>
                  <p className="text-3xl font-bold text-orange-600">2.4 Juta Ton</p>
                  <p className="text-sm text-muted-foreground">Sedang dalam perjalanan</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Penyerapan Hari Ini</h3>
                  <p className="text-3xl font-bold text-green-600">125 Ribu Ton</p>
                  <p className="text-sm text-muted-foreground">Target harian tercapai</p>
                </div>
              </div>
            </div>
          );
        case '/analitik-pelaporan':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Analitik & Pelaporan Pemerintah</h1>
              <p className="text-muted-foreground mb-6">
                Dashboard analitik khusus untuk pengawasan dan pembuatan kebijakan
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Efektivitas Program</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">87.3%</div>
                  <p className="text-sm text-muted-foreground">Target penyerapan tercapai</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Subsidi Tersalurkan</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">Rp 2.1 T</div>
                  <p className="text-sm text-muted-foreground">dari anggaran Rp 2.5 T</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Petani Terlayani</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-2">8.7 Juta</div>
                  <p className="text-sm text-muted-foreground">dari target 10 juta petani</p>
                </div>
              </div>
            </div>
          );
        case '/manajemen-pengguna':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Manajemen Pengguna Sistem</h1>
              <p className="text-muted-foreground mb-6">
                Kelola akses dan perizinan pengguna sistem PupukChain
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Total Pengguna</h3>
                  <p className="text-2xl font-bold text-blue-600">15,247</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Admin Pusat</h3>
                  <p className="text-2xl font-bold text-purple-600">25</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Admin Daerah</h3>
                  <p className="text-2xl font-bold text-green-600">340</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Distributor</h3>
                  <p className="text-2xl font-bold text-orange-600">1,156</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Kios Tani</h3>
                  <p className="text-2xl font-bold text-cyan-600">13,726</p>
                </div>
              </div>
            </div>
          );
        case '/audit-trail':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Audit Trail Sistem</h1>
              <p className="text-muted-foreground mb-6">
                Jejak audit lengkap semua transaksi dan aktivitas dalam sistem
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Total Transaksi</h3>
                  <p className="text-2xl font-bold text-blue-600">2.4 Juta</p>
                  <p className="text-sm text-muted-foreground">Tercatat di blockchain</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Transaksi Hari Ini</h3>
                  <p className="text-2xl font-bold text-green-600">8,750</p>
                  <p className="text-sm text-muted-foreground">Real-time monitoring</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Anomali Terdeteksi</h3>
                  <p className="text-2xl font-bold text-yellow-600">12</p>
                  <p className="text-sm text-muted-foreground">Memerlukan investigasi</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Compliance Rate</h3>
                  <p className="text-2xl font-bold text-purple-600">99.2%</p>
                  <p className="text-sm text-muted-foreground">Standar kepatuhan</p>
                </div>
              </div>
            </div>
          );
        case '/pemetaan':
          return <MapView />;
        case '/pengaturan':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Pengaturan Sistem Pemerintah</h1>
              <p className="text-muted-foreground mb-6">
                Konfigurasi khusus untuk dashboard pengawasan pemerintah
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Pengaturan Dashboard</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Auto Refresh Data</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Real-time Notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>High Priority Alerts</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-4">Pengaturan Keamanan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Two-Factor Authentication</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Session Timeout (30 min)</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Audit Logging</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <GovernmentDashboard 
              onNavigateToAI={() => setActiveMenuItem('/analisis-ai')}
              onNavigateToMap={() => setActiveMenuItem('/pemetaan')}
              onNavigateToEmergency={() => setActiveMenuItem('/laporan-darurat')}
              onNavigateToAllocation={() => setActiveMenuItem('/alokasi-darurat')}
            />
          );
      }
    }

    // Admin role specific routing
    if (user.role === 'Admin') {
      switch (activeMenuItem) {
        case '/':
          return <DashboardContent userRole={user.role} stats={mockStats} />;
        case '/distributor':
          return <DistributorManagement />;
        case '/laporan':
          return <ReportsModule />;
        case '/tren':
          return <MarketTrendsAnalysis />;
        case '/pemetaan':
          return <MapView />;
        case '/pengguna':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Manajemen Pengguna</h1>
              <p className="text-muted-foreground mb-6">Kelola akun pengguna sistem PupukChain.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Total Pengguna</h3>
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Admin</h3>
                  <p className="text-2xl font-bold text-purple-600">15</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Distributor</h3>
                  <p className="text-2xl font-bold text-green-600">156</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-medium mb-2">Kios Tani</h3>
                  <p className="text-2xl font-bold text-orange-600">1,076</p>
                </div>
              </div>
            </div>
          );
        default:
          return <DashboardContent userRole={user.role} stats={mockStats} />;
      }
    }

    // Default fallback
    return <DashboardContent userRole={user.role} stats={mockStats} />;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar 
          userRole={user.role}
          activeItem={activeMenuItem}
          onItemClick={handleMenuItemClick}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header 
            userRole={user.role}
            userName={user.name}
            organizationName={user.organization}
          />
          
          {/* Mobile Sidebar Trigger */}
          <div className="md:hidden p-2 border-b">
            <SidebarTrigger />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}