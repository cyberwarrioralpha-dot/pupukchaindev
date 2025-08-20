import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Camera, Smartphone, Scan, AlertCircle, CheckCircle, X, Volume2, VolumeX } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: string) => void;
  isActive: boolean;
  onClose: () => void;
}

interface DetectedDevice {
  id: string;
  name: string;
  type: 'camera' | 'scanner';
  isActive: boolean;
}

export function QRScanner({ onScan, onError, isActive, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<DetectedDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [scanMode, setScanMode] = useState<'camera' | 'hardware'>('camera');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [lastScan, setLastScan] = useState<string>('');
  const [scanCount, setScanCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock QR code patterns for simulation
  const mockQRPatterns = [
    'BATCH-2024-001234|Pupuk Urea|10|Ton|Gudang Provinsi Jawa Timur|2024-01-15|2025-01-15',
    'BATCH-2024-001235|NPK Premium|5|Ton|PT Pupuk Indonesia|2024-01-16|2025-01-16',
    'BATCH-2024-001236|TSP|8|Ton|Gudang Provinsi Jawa Barat|2024-01-17|2025-01-17'
  ];

  // Initialize camera and hardware detection
  useEffect(() => {
    if (isActive) {
      initializeDevices();
    }
    return () => {
      cleanup();
    };
  }, [isActive]);

  const initializeDevices = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      
      // Get available cameras
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const cameras = mediaDevices.filter(device => device.kind === 'videoinput');
      
      const detectedDevices: DetectedDevice[] = cameras.map((camera, index) => ({
        id: camera.deviceId || `camera-${index}`,
        name: camera.label || `Camera ${index + 1}`,
        type: 'camera',
        isActive: index === 0
      }));

      // Detect hardware scanners (simulated)
      const hardwareScanners = [
        { id: 'hw-scanner-1', name: 'Honeywell 1900G', type: 'scanner' as const, isActive: false },
        { id: 'hw-scanner-2', name: 'Zebra DS2208', type: 'scanner' as const, isActive: false }
      ];

      // Check for USB/Serial hardware scanners
      if ('serial' in navigator) {
        try {
          const ports = await (navigator as any).serial.getPorts();
          if (ports.length > 0) {
            detectedDevices.push(...hardwareScanners);
          }
        } catch (error) {
          console.log('Serial API not available or no hardware scanners detected');
        }
      }

      setDevices(detectedDevices);
      setSelectedDevice(detectedDevices[0]?.id || '');
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasPermission(false);
      onError('Camera permission denied or not available');
    }
  };

  const startCameraScanning = async () => {
    if (!hasPermission) return;
    
    try {
      const constraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment' // Use back camera on mobile
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        startQRDetection();
      }
    } catch (error) {
      onError('Failed to start camera scanning');
    }
  };

  const startHardwareScanning = () => {
    setIsScanning(true);
    // Simulate hardware scanner activation
    if (soundEnabled) {
      playBeep();
    }
    
    // Mock hardware scanner detection
    scanIntervalRef.current = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of detecting QR code
        const randomPattern = mockQRPatterns[Math.floor(Math.random() * mockQRPatterns.length)];
        handleSuccessfulScan(randomPattern);
      }
    }, 2000);
  };

  const startQRDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    scanIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);
        
        // Simulate QR code detection
        if (Math.random() < 0.2) { // 20% chance of detecting QR code
          const randomPattern = mockQRPatterns[Math.floor(Math.random() * mockQRPatterns.length)];
          handleSuccessfulScan(randomPattern);
        }
      }
    }, 500);
  };

  const handleSuccessfulScan = (data: string) => {
    setLastScan(data);
    setScanCount(prev => prev + 1);
    
    if (soundEnabled) {
      playBeep();
    }
    
    if (autoAccept) {
      onScan(data);
      stopScanning();
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const cleanup = () => {
    stopScanning();
  };

  const playBeep = () => {
    // Create a beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleManualAccept = () => {
    if (lastScan) {
      onScan(lastScan);
      stopScanning();
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">QR Code Scanner</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Permission Status */}
        {hasPermission === false && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Camera permission is required for QR code scanning. Please allow camera access and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Scanner Mode Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant={scanMode === 'camera' ? 'default' : 'outline'}
            onClick={() => setScanMode('camera')}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Camera Scanner
          </Button>
          <Button
            variant={scanMode === 'hardware' ? 'default' : 'outline'}
            onClick={() => setScanMode('hardware')}
            className="flex items-center gap-2"
          >
            <Scan className="w-4 h-4" />
            Hardware Scanner
          </Button>
        </div>

        {/* Device Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Available Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices
                .filter(device => device.type === (scanMode === 'camera' ? 'camera' : 'scanner'))
                .map((device) => (
                  <div
                    key={device.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDevice === device.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedDevice(device.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device.type === 'camera' ? (
                          <Camera className="w-4 h-4" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                        <span className="font-medium">{device.name}</span>
                      </div>
                      {selectedDevice === device.id && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Scanner Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Scanner Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                  Sound {soundEnabled ? 'On' : 'Off'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoAccept"
                  checked={autoAccept}
                  onChange={(e) => setAutoAccept(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoAccept" className="text-sm">
                  Auto-accept valid QR codes
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scanner Display */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="relative">
              {scanMode === 'camera' && (
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  
                  {/* Scanning overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-green-500 relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                        
                        {/* Scanning line animation */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {scanMode === 'hardware' && (
                <div className="bg-gray-100 rounded-lg p-12 text-center" style={{ height: '400px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <Scan className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Hardware Scanner Ready</h3>
                    <p className="text-muted-foreground mb-4">
                      Point the hardware scanner at a QR code to scan
                    </p>
                    {isScanning && (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Scanning...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scan Results */}
        {lastScan && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                QR Code Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-mono text-sm break-all">{lastScan}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Scans detected: {scanCount}
                </span>
                {!autoAccept && (
                  <Button onClick={handleManualAccept} size="sm">
                    Accept & Process
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          {!isScanning ? (
            <Button
              onClick={scanMode === 'camera' ? startCameraScanning : startHardwareScanning}
              disabled={!hasPermission || !selectedDevice}
              className="px-8"
            >
              <Scan className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="outline" className="px-8">
              Stop Scanning
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}