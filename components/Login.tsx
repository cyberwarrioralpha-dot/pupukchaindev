import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { useAuth } from './AuthContext';
import { 
  Shield, 
  Building, 
  Users, 
  Settings, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Loader2,
  Factory
} from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'Government',
      email: 'admin@pupukchain.gov.id',
      name: 'Dr. Budi Santoso',
      organization: 'Kementerian Pertanian RI',
      icon: Shield,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      role: 'Producer',
      email: 'producer@pupuk.co.id',
      name: 'Ir. Siti Rahayu',
      organization: 'PT Pupuk Indonesia',
      icon: Factory,
      color: 'text-green-600 bg-green-50'
    },
    {
      role: 'Distributor',
      email: 'distributor@agro.co.id',
      name: 'Ahmad Hidayat',
      organization: 'CV Agro Nusantara',
      icon: Building,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      role: 'Admin',
      email: 'admin@system.id',
      name: 'Maya Sari',
      organization: 'PupukChain System',
      icon: Settings,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Branding */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">PC</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PupukChain</h1>
                <p className="text-gray-600">Blockchain-based Fertilizer Distribution</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sistem Manajemen Distribusi Pupuk Bersubsidi
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Platform terintegrasi untuk monitoring, tracking, dan manajemen distribusi pupuk bersubsidi 
              menggunakan teknologi blockchain dan AI untuk transparansi dan efisiensi maksimal.
            </p>
          </div>

          <div className="hidden lg:block">
            <h3 className="font-semibold text-gray-900 mb-3">Fitur Utama:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Real-time tracking distribusi pupuk
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Blockchain untuk transparansi supply chain
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                AI-powered analytics dan prediksi
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Multi-role dashboard untuk semua stakeholder
              </li>
            </ul>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex flex-col justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Masuk ke Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </form>

              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Demo Accounts (Password: 123456)</p>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {demoAccounts.map((account) => {
                    const IconComponent = account.icon;
                    return (
                      <Button
                        key={account.email}
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => handleDemoLogin(account.email)}
                        disabled={isLoading}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${account.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">{account.name}</div>
                          <div className="text-xs text-muted-foreground">{account.role} - {account.organization}</div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {account.role}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <p>Sistem PupukChain v2.0</p>
                <p>© 2024 Kementerian Pertanian RI</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}