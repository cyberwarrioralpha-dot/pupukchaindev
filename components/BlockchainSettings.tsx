import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { 
  Settings, 
  Wallet, 
  Globe, 
  Shield, 
  Database, 
  Zap, 
  Link, 
  Bell, 
  Key,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Download,
  Upload,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Trash2,
  Plus,
  Minus,
  Activity,
  Lock,
  Unlock,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Clock,
  DollarSign,
  Gauge,
  Target,
  TrendingUp,
  Info,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface BlockchainNetwork {
  id: string;
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  status: 'connected' | 'disconnected' | 'error';
}

interface WalletConfig {
  address: string;
  name: string;
  type: 'metamask' | 'walletconnect' | 'ledger' | 'trezor';
  isConnected: boolean;
  balance: number;
  isDefault: boolean;
}

interface ContractConfig {
  name: string;
  address: string;
  abi: string;
  version: string;
  isVerified: boolean;
  deployedAt: Date;
}

interface GasSettings {
  gasLimit: number;
  maxGasPrice: number;
  priorityFee: number;
  gasStrategy: 'slow' | 'standard' | 'fast' | 'custom';
  autoAdjust: boolean;
}

interface SecuritySettings {
  requireConfirmation: boolean;
  transactionTimeout: number;
  maxTransactionValue: number;
  whitelist: string[];
  blacklist: string[];
  mfaEnabled: boolean;
  autoLock: boolean;
  autoLockTime: number;
}

interface NotificationSettings {
  transactionComplete: boolean;
  transactionFailed: boolean;
  lowGas: boolean;
  networkChange: boolean;
  contractEvents: boolean;
  priceAlerts: boolean;
  securityAlerts: boolean;
}

const mockNetworks: BlockchainNetwork[] = [
  {
    id: 'ethereum-mainnet',
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
    blockExplorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    status: 'connected'
  },
  {
    id: 'polygon-mainnet',
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
    isTestnet: false,
    status: 'connected'
  },
  {
    id: 'bsc-mainnet',
    name: 'Binance Smart Chain',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    isTestnet: false,
    status: 'disconnected'
  },
  {
    id: 'ethereum-sepolia',
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR-PROJECT-ID',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
    isTestnet: true,
    status: 'connected'
  }
];

const mockWallets: WalletConfig[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'MetaMask Wallet',
    type: 'metamask',
    isConnected: true,
    balance: 2.5,
    isDefault: true
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'Hardware Wallet',
    type: 'ledger',
    isConnected: false,
    balance: 0,
    isDefault: false
  }
];

const mockContracts: ContractConfig[] = [
  {
    name: 'PupukChain NFT',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    abi: '[{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]',
    version: '1.0.0',
    isVerified: true,
    deployedAt: new Date('2024-01-15')
  },
  {
    name: 'PupukChain Registry',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    abi: '[{"inputs":[],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
    version: '1.2.0',
    isVerified: true,
    deployedAt: new Date('2024-02-01')
  }
];

interface BlockchainSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BlockchainSettings({ isOpen, onClose }: BlockchainSettingsProps) {
  const [activeTab, setActiveTab] = useState('network');
  const [networks, setNetworks] = useState<BlockchainNetwork[]>(mockNetworks);
  const [wallets, setWallets] = useState<WalletConfig[]>(mockWallets);
  const [contracts, setContracts] = useState<ContractConfig[]>(mockContracts);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum-mainnet');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Settings states
  const [gasSettings, setGasSettings] = useState<GasSettings>({
    gasLimit: 21000,
    maxGasPrice: 50,
    priorityFee: 2,
    gasStrategy: 'standard',
    autoAdjust: true
  });
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireConfirmation: true,
    transactionTimeout: 300,
    maxTransactionValue: 1000,
    whitelist: [],
    blacklist: [],
    mfaEnabled: false,
    autoLock: true,
    autoLockTime: 30
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    transactionComplete: true,
    transactionFailed: true,
    lowGas: true,
    networkChange: true,
    contractEvents: false,
    priceAlerts: false,
    securityAlerts: true
  });

  // Network management
  const [newNetwork, setNewNetwork] = useState<Partial<BlockchainNetwork>>({
    name: '',
    chainId: 0,
    rpcUrl: '',
    blockExplorerUrl: '',
    nativeCurrency: { name: '', symbol: '', decimals: 18 },
    isTestnet: false
  });

  const handleNetworkConnection = async (networkId: string) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setNetworks(prev => prev.map(network => 
      network.id === networkId 
        ? { ...network, status: 'connected' }
        : network
    ));
    
    setConnectionStatus('connected');
    setIsConnecting(false);
  };

  const addCustomNetwork = () => {
    if (newNetwork.name && newNetwork.chainId && newNetwork.rpcUrl) {
      const network: BlockchainNetwork = {
        id: `custom-${Date.now()}`,
        name: newNetwork.name,
        chainId: newNetwork.chainId,
        rpcUrl: newNetwork.rpcUrl,
        blockExplorerUrl: newNetwork.blockExplorerUrl || '',
        nativeCurrency: newNetwork.nativeCurrency || { name: '', symbol: '', decimals: 18 },
        isTestnet: newNetwork.isTestnet || false,
        status: 'disconnected'
      };
      
      setNetworks(prev => [...prev, network]);
      setNewNetwork({
        name: '',
        chainId: 0,
        rpcUrl: '',
        blockExplorerUrl: '',
        nativeCurrency: { name: '', symbol: '', decimals: 18 },
        isTestnet: false
      });
      setHasChanges(true);
    }
  };

  const connectWallet = async (walletType: string) => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock wallet connection success
    const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
    
    setWallets(prev => prev.map(wallet => 
      wallet.type === walletType 
        ? { ...wallet, isConnected: true, address: mockAddress, balance: Math.random() * 10 }
        : wallet
    ));
    
    setIsConnecting(false);
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsConnecting(true);
    
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasChanges(false);
    setIsConnecting(false);
  };

  const resetSettings = () => {
    setGasSettings({
      gasLimit: 21000,
      maxGasPrice: 50,
      priorityFee: 2,
      gasStrategy: 'standard',
      autoAdjust: true
    });
    
    setSecuritySettings({
      requireConfirmation: true,
      transactionTimeout: 300,
      maxTransactionValue: 1000,
      whitelist: [],
      blacklist: [],
      mfaEnabled: false,
      autoLock: true,
      autoLockTime: 30
    });
    
    setNotificationSettings({
      transactionComplete: true,
      transactionFailed: true,
      lowGas: true,
      networkChange: true,
      contractEvents: false,
      priceAlerts: false,
      securityAlerts: true
    });
    
    setHasChanges(true);
  };

  const getNetworkStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNetworkStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected': return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden mx-4">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Blockchain Settings
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7 rounded-none border-b">
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="gas">Gas & Fees</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <div className="h-96 overflow-y-auto">
              {/* Network Settings */}
              <TabsContent value="network" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Network Configuration</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleNetworkConnection(selectedNetwork)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wifi className="w-4 h-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {networks.map((network) => (
                    <Card key={network.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <h4 className="font-medium">{network.name}</h4>
                          {network.isTestnet && (
                            <Badge variant="secondary" className="text-xs">Testnet</Badge>
                          )}
                        </div>
                        <Badge className={getNetworkStatusColor(network.status)}>
                          {getNetworkStatusIcon(network.status)}
                          {network.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chain ID:</span>
                          <span className="font-mono">{network.chainId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span>{network.nativeCurrency.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">RPC:</span>
                          <span className="font-mono text-xs truncate max-w-24">
                            {network.rpcUrl}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleNetworkConnection(network.id)}
                          disabled={network.status === 'connected'}
                        >
                          {network.status === 'connected' ? 'Connected' : 'Connect'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(network.rpcUrl)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Add Custom Network */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Add Custom Network</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="networkName">Network Name</Label>
                      <Input
                        id="networkName"
                        value={newNetwork.name}
                        onChange={(e) => setNewNetwork({...newNetwork, name: e.target.value})}
                        placeholder="Custom Network"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chainId">Chain ID</Label>
                      <Input
                        id="chainId"
                        type="number"
                        value={newNetwork.chainId}
                        onChange={(e) => setNewNetwork({...newNetwork, chainId: parseInt(e.target.value)})}
                        placeholder="1337"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rpcUrl">RPC URL</Label>
                      <Input
                        id="rpcUrl"
                        value={newNetwork.rpcUrl}
                        onChange={(e) => setNewNetwork({...newNetwork, rpcUrl: e.target.value})}
                        placeholder="https://rpc.custom-network.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="explorerUrl">Block Explorer URL</Label>
                      <Input
                        id="explorerUrl"
                        value={newNetwork.blockExplorerUrl}
                        onChange={(e) => setNewNetwork({...newNetwork, blockExplorerUrl: e.target.value})}
                        placeholder="https://explorer.custom-network.com"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Switch
                      checked={newNetwork.isTestnet}
                      onCheckedChange={(checked) => setNewNetwork({...newNetwork, isTestnet: checked})}
                    />
                    <Label>This is a testnet</Label>
                  </div>
                  <Button onClick={addCustomNetwork} className="mt-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Network
                  </Button>
                </Card>
              </TabsContent>

              {/* Wallet Settings */}
              <TabsContent value="wallets" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Wallet Management</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Wallet
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {wallets.map((wallet, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{wallet.name}</h4>
                            <p className="text-sm text-gray-600 font-mono">
                              {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {wallet.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                          <Badge className={wallet.isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {wallet.isConnected ? 'Connected' : 'Disconnected'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 capitalize">{wallet.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Balance:</span>
                          <span className="ml-2">{wallet.balance.toFixed(4)} ETH</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {!wallet.isConnected && (
                          <Button 
                            size="sm" 
                            onClick={() => connectWallet(wallet.type)}
                            disabled={isConnecting}
                          >
                            {isConnecting ? 'Connecting...' : 'Connect'}
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Address
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View on Explorer
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Always verify wallet addresses before sending transactions. Never share your private keys or seed phrases.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Contract Settings */}
              <TabsContent value="contracts" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Smart Contracts</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contract
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {contracts.map((contract, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Database className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{contract.name}</h4>
                            <p className="text-sm text-gray-600 font-mono">
                              {contract.address.substring(0, 10)}...{contract.address.substring(contract.address.length - 8)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contract.isVerified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="secondary">v{contract.version}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Deployed:</span>
                          <span className="ml-2">{contract.deployedAt.toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">ABI Length:</span>
                          <span className="ml-2">{contract.abi.length} chars</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View ABI
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Address
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View on Explorer
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Gas & Fees Settings */}
              <TabsContent value="gas" className="p-6 space-y-6">
                <h3 className="text-lg font-medium">Gas & Transaction Fees</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Gas Strategy</h4>
                    <Select value={gasSettings.gasStrategy} onValueChange={(value: any) => setGasSettings({...gasSettings, gasStrategy: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow (Low Fee)</SelectItem>
                        <SelectItem value="standard">Standard (Recommended)</SelectItem>
                        <SelectItem value="fast">Fast (High Fee)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Auto-adjust Gas</h4>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={gasSettings.autoAdjust}
                        onCheckedChange={(checked) => setGasSettings({...gasSettings, autoAdjust: checked})}
                      />
                      <Label>Automatically adjust gas prices</Label>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Gas Limits & Prices</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Gas Limit: {gasSettings.gasLimit.toLocaleString()}</Label>
                      <Slider
                        value={[gasSettings.gasLimit]}
                        onValueChange={(value) => setGasSettings({...gasSettings, gasLimit: value[0]})}
                        max={1000000}
                        min={21000}
                        step={1000}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Max Gas Price: {gasSettings.maxGasPrice} Gwei</Label>
                      <Slider
                        value={[gasSettings.maxGasPrice]}
                        onValueChange={(value) => setGasSettings({...gasSettings, maxGasPrice: value[0]})}
                        max={200}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Priority Fee: {gasSettings.priorityFee} Gwei</Label>
                      <Slider
                        value={[gasSettings.priorityFee]}
                        onValueChange={(value) => setGasSettings({...gasSettings, priorityFee: value[0]})}
                        max={50}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </Card>
                
                <Alert>
                  <Gauge className="h-4 w-4" />
                  <AlertDescription>
                    Higher gas prices result in faster transaction confirmation but cost more.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="p-6 space-y-6">
                <h3 className="text-lg font-medium">Security Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Transaction Security</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={securitySettings.requireConfirmation}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireConfirmation: checked})}
                        />
                        <Label>Require confirmation for all transactions</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={securitySettings.mfaEnabled}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, mfaEnabled: checked})}
                        />
                        <Label>Enable multi-factor authentication</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={securitySettings.autoLock}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, autoLock: checked})}
                        />
                        <Label>Auto-lock wallet after inactivity</Label>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Transaction Limits</h4>
                    <div className="space-y-3">
                      <div>
                        <Label>Max Transaction Value (ETH)</Label>
                        <Input
                          type="number"
                          value={securitySettings.maxTransactionValue}
                          onChange={(e) => setSecuritySettings({...securitySettings, maxTransactionValue: parseFloat(e.target.value)})}
                          step="0.1"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <Label>Transaction Timeout (seconds)</Label>
                        <Input
                          type="number"
                          value={securitySettings.transactionTimeout}
                          onChange={(e) => setSecuritySettings({...securitySettings, transactionTimeout: parseInt(e.target.value)})}
                          min="30"
                          max="3600"
                        />
                      </div>
                      
                      <div>
                        <Label>Auto-lock Time (minutes)</Label>
                        <Input
                          type="number"
                          value={securitySettings.autoLockTime}
                          onChange={(e) => setSecuritySettings({...securitySettings, autoLockTime: parseInt(e.target.value)})}
                          min="5"
                          max="120"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Address Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Whitelist (Trusted Addresses)</Label>
                      <Textarea
                        placeholder="Enter addresses separated by newlines"
                        value={securitySettings.whitelist.join('\n')}
                        onChange={(e) => setSecuritySettings({...securitySettings, whitelist: e.target.value.split('\n').filter(addr => addr.trim())})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Blacklist (Blocked Addresses)</Label>
                      <Textarea
                        placeholder="Enter addresses separated by newlines"
                        value={securitySettings.blacklist.join('\n')}
                        onChange={(e) => setSecuritySettings({...securitySettings, blacklist: e.target.value.split('\n').filter(addr => addr.trim())})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="p-6 space-y-6">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Transaction Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.transactionComplete}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, transactionComplete: checked})}
                        />
                        <Label>Transaction completed</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.transactionFailed}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, transactionFailed: checked})}
                        />
                        <Label>Transaction failed</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.lowGas}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lowGas: checked})}
                        />
                        <Label>Low gas warning</Label>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">System Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.networkChange}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, networkChange: checked})}
                        />
                        <Label>Network changes</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.contractEvents}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, contractEvents: checked})}
                        />
                        <Label>Contract events</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notificationSettings.securityAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
                        />
                        <Label>Security alerts</Label>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Market Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={notificationSettings.priceAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, priceAlerts: checked})}
                      />
                      <Label>Price alerts</Label>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="p-6 space-y-6">
                <h3 className="text-lg font-medium">Advanced Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Backup & Recovery</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export Settings
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Settings
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Key className="w-4 h-4 mr-2" />
                        Backup Private Keys
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Development Tools</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Logs
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Activity className="w-4 h-4 mr-2" />
                        Network Statistics
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Debug Information</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    <div>Version: 1.0.0</div>
                    <div>Network: {networks.find(n => n.id === selectedNetwork)?.name}</div>
                    <div>Connected Wallets: {wallets.filter(w => w.isConnected).length}</div>
                    <div>Active Contracts: {contracts.length}</div>
                  </div>
                </Card>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Advanced settings can affect system performance and security. Only modify if you understand the implications.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        
        <div className="border-t p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetSettings}
              disabled={isConnecting}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              disabled={!hasChanges || isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}