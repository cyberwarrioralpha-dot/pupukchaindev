import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Search,
  Menu,
  Shield,
  Building,
  Clock
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { Input } from './ui/input';

interface HeaderProps {
  userRole: 'Government' | 'Producer' | 'Distributor' | 'Admin';
  userName: string;
  organizationName: string;
}

export function Header({ userRole, userName, organizationName }: HeaderProps) {
  const { logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [notifications] = useState(12); // Mock notification count

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Government': return 'bg-blue-100 text-blue-800';
      case 'Producer': return 'bg-green-100 text-green-800';
      case 'Distributor': return 'bg-orange-100 text-orange-800';
      case 'Admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Government': return <Shield className="w-3 h-3" />;
      case 'Producer': return <Building className="w-3 h-3" />;
      case 'Distributor': return <Building className="w-3 h-3" />;
      case 'Admin': return <Settings className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side - Logo and Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <div className="hidden md:block">
              <h1 className="font-semibold">PupukChain</h1>
              <p className="text-xs text-muted-foreground">
                {userRole} Dashboard
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search..."
                  className="w-64"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="text-muted-foreground"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center gap-2">
          {/* Live Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 font-medium">Live</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1 min-w-0 h-5 text-xs bg-red-500">
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className={`text-xs ${getRoleColor(userRole)}`}>
                      {getRoleIcon(userRole)}
                      <span className="ml-1">{userRole}</span>
                    </Badge>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{organizationName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className={`text-xs ${getRoleColor(userRole)}`}>
                      {getRoleIcon(userRole)}
                      <span className="ml-1">{userRole}</span>
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Session Info */}
              <div className="px-2 py-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Session aktif sejak {new Date().toLocaleTimeString('id-ID')}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="w-4 h-4 mr-2" />
                Notifikasi
                {notifications > 0 && (
                  <Badge className="ml-auto px-1 min-w-0 h-4 text-xs bg-red-500">
                    {notifications}
                  </Badge>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}