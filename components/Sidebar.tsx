import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from './ui/sidebar';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  MapPin, 
  Settings, 
  Shield,
  Bell,
  Database,
  FileText,
  TrendingUp,
  Factory,
  Truck,
  QrCode,
  Coins,
  ShoppingCart,
  Receipt,
  Store,
  Activity,
  Monitor,
  Cog,
  Wrench,
  ClipboardList,
  UserCheck,
  DollarSign,
  ScanLine,
  AlertTriangle,
  Brain,
  Zap,
  PieChart,
  Target,
  Eye,
  Calendar,
  Search,
  Filter,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  userRole: string;
  activeItem: string;
  onItemClick: (href: string) => void;
}

export function AppSidebar({ userRole, activeItem, onItemClick }: SidebarProps) {
  const menuItems = (() => {
    switch (userRole) {
      case 'Government':
        return [
          {
            title: 'Dashboard Utama',
            url: '/',
            icon: LayoutDashboard,
            badge: null
          },
          {
            title: 'Manajemen Alokasi',
            url: '/alokasi',
            icon: Package,
            badge: null
          },
          {
            title: 'Alokasi Darurat',
            url: '/alokasi-darurat',
            icon: AlertTriangle,
            badge: 'AI'
          },
          {
            title: 'Notifikasi',
            url: '/notifikasi',
            icon: Bell,
            badge: '5'
          },
          {
            title: 'Analisis AI Regional',
            url: '/analisis-ai',
            icon: Brain,
            badge: 'AI'
          },
          {
            title: 'Laporan Darurat',
            url: '/laporan-darurat',
            icon: AlertTriangle,
            badge: 'AI'
          },
          {
            title: 'Monitoring Stok',
            url: '/monitoring-stok',
            icon: Eye,
            badge: null
          },
          {
            title: 'Analitik & Pelaporan',
            url: '/analitik-pelaporan',
            icon: BarChart3,
            badge: null
          },
          {
            title: 'Manajemen Pengguna',
            url: '/manajemen-pengguna',
            icon: Users,
            badge: null
          },
          {
            title: 'Audit Trail',
            url: '/audit-trail',
            icon: Shield,
            badge: null
          },
          {
            title: 'Pemetaan',
            url: '/pemetaan',
            icon: MapPin,
            badge: null
          },
          {
            title: 'Pengaturan',
            url: '/pengaturan',
            icon: Settings,
            badge: null
          }
        ];

      case 'Producer':
        return [
          {
            title: 'Dashboard Produksi',
            url: '/',
            icon: LayoutDashboard,
            badge: null
          },
          {
            title: 'Monitoring Real-Time',
            url: '/monitoring-realtime',
            icon: Monitor,
            badge: 'LIVE'
          },
          {
            title: 'Manajemen Aset',
            url: '/manajemen-aset',
            icon: Factory,
            badge: null
          },
          {
            title: 'Manajemen Pengiriman',
            url: '/manajemen-pengiriman',
            icon: Truck,
            badge: null
          },
          {
            title: 'QR Code & NFT',
            url: '/qr-nft',
            icon: QrCode,
            badge: null
          },
          {
            title: 'Laporan Produksi',
            url: '/laporan-produksi',
            icon: BarChart3,
            badge: null
          },
          {
            title: 'Pengaturan',
            url: '/pengaturan',
            icon: Settings,
            badge: null
          }
        ];

      case 'Distributor':
        return [
          {
            title: 'Dashboard Distributor',
            url: '/',
            icon: LayoutDashboard,
            badge: null
          },
          {
            title: 'Penerimaan Barang',
            url: '/penerimaan-barang',
            icon: Receipt,
            badge: null
          },
          {
            title: 'Riwayat Transaksi',
            url: '/riwayat-transaksi',
            icon: FileText,
            badge: null
          },
          {
            title: 'Manajemen Pengecer',
            url: '/manajemen-pengecer',
            icon: Store,
            badge: null
          },
          {
            title: 'Laporan Penjualan',
            url: '/laporan-penjualan',
            icon: BarChart3,
            badge: null
          },
          {
            title: 'Scanner QR',
            url: '/scanner',
            icon: ScanLine,
            badge: null
          },
          {
            title: 'Pengaturan',
            url: '/pengaturan',
            icon: Settings,
            badge: null
          }
        ];

      case 'Admin':
      default:
        return [
          {
            title: 'Dashboard',
            url: '/',
            icon: LayoutDashboard,
            badge: null
          },
          {
            title: 'Manajemen Distributor',
            url: '/distributor',
            icon: Users,
            badge: null
          },
          {
            title: 'Laporan',
            url: '/laporan',
            icon: FileText,
            badge: null
          },
          {
            title: 'Tren Pasar',
            url: '/tren',
            icon: TrendingUp,
            badge: null
          },
          {
            title: 'Pemetaan',
            url: '/pemetaan',
            icon: MapPin,
            badge: null
          },
          {
            title: 'Manajemen Pengguna',
            url: '/pengguna',
            icon: Users,
            badge: null
          }
        ];
    }
  })();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">PupukChain</span>
            <span className="text-xs text-muted-foreground">{userRole}</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      onClick={() => onItemClick(item.url)}
                      className="w-full"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === 'AI' ? 'default' : 
                                   item.badge === 'LIVE' ? 'destructive' : 
                                   'secondary'} 
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions for different roles */}
        {userRole === 'Producer' && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onItemClick('/qr-nft')}>
                    <QrCode className="w-4 h-4" />
                    <span>Generate QR</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onItemClick('/monitoring-realtime')}>
                    <Activity className="w-4 h-4" />
                    <span>Live Monitor</span>
                    <Badge variant="destructive" className="ml-auto text-xs">LIVE</Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {userRole === 'Government' && (
          <SidebarGroup>
            <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onItemClick('/analisis-ai')}>
                    <Brain className="w-4 h-4" />
                    <span>AI Analytics</span>
                    <Badge variant="default" className="ml-auto text-xs">AI</Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onItemClick('/laporan-darurat')}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Emergency AI</span>
                    <Badge variant="default" className="ml-auto text-xs">AI</Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {userRole === 'Distributor' && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onItemClick('/scanner')}>
                    <ScanLine className="w-4 h-4" />
                    <span>Scan QR</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onItemClick('/penerimaan-barang')}>
                    <Receipt className="w-4 h-4" />
                    <span>Receive Goods</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs">System Online</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}