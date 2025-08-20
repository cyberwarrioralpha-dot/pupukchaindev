import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Shield, 
  LogOut,
  Edit,
  Clock
} from 'lucide-react';

export function UserProfile() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Government': return 'bg-blue-500';
      case 'Producer': return 'bg-green-500';
      case 'Distributor': return 'bg-orange-500';
      case 'Admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Government': return '🏛️';
      case 'Producer': return '🏭';
      case 'Distributor': return '🚚';
      case 'Admin': return '⚙️';
      default: return '👤';
    }
  };

  // Safe date formatting function
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      
      return dateObj.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Safe datetime formatting function
  const formatDateTime = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      
      return dateObj.toLocaleString('id-ID');
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return 'N/A';
    }
  };

  return (
    <>
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-2 hover:bg-muted"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang profil dan pengaturan akun pengguna
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Header Profile */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-2xl">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.organization}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getRoleColor(user.role)} text-white`}>
                    {getRoleIcon(user.role)} {user.role}
                  </Badge>
                  <Badge variant={user.isActive ? 'default' : 'destructive'}>
                    {user.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informasi Kontak
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {user.profile?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Telepon</p>
                        <p className="text-sm text-muted-foreground">{user.profile.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Username</p>
                      <p className="text-sm text-muted-foreground">{user.username}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Informasi Organisasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Organisasi</p>
                      <p className="text-sm text-muted-foreground">{user.organization}</p>
                    </div>
                  </div>
                  {user.profile?.department && (
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Departemen</p>
                        <p className="text-sm text-muted-foreground">{user.profile.department}</p>
                      </div>
                    </div>
                  )}
                  {user.profile?.position && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Posisi</p>
                        <p className="text-sm text-muted-foreground">{user.profile.position}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Address Information */}
            {user.profile?.address && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Alamat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{user.profile.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.profile.city}, {user.profile.province}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Hak Akses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informasi Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Tanggal Bergabung</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Login Terakhir</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(user.lastLogin)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">ID Pengguna</p>
                    <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <div className="flex justify-end">
              <Button 
                variant="destructive" 
                onClick={() => {
                  logout();
                  setShowProfile(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}