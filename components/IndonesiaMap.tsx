import React from 'react';

interface Province {
  id: string;
  name: string;
  path: string;
  center: { x: number; y: number };
  absorption: number;
  target: number;
  percentage: number;
  status: 'high' | 'medium' | 'low';
}

interface IndonesiaMapProps {
  provinces: Province[];
  onProvinceClick?: (province: Province) => void;
  onProvinceHover?: (province: Province | null) => void;
  className?: string;
}

// Simplified Indonesia map with major islands
const indonesiaProvinces: Province[] = [
  // Sumatera
  {
    id: 'aceh',
    name: 'Aceh',
    path: 'M50,80 L70,75 L75,85 L60,95 L45,90 Z',
    center: { x: 60, y: 85 },
    absorption: 420,
    target: 600,
    percentage: 70,
    status: 'medium'
  },
  {
    id: 'sumut',
    name: 'Sumatera Utara',
    path: 'M45,90 L75,85 L80,100 L70,110 L50,105 Z',
    center: { x: 62, y: 98 },
    absorption: 520,
    target: 700,
    percentage: 74,
    status: 'medium'
  },
  {
    id: 'sumbar',
    name: 'Sumatera Barat',
    path: 'M40,105 L70,110 L65,125 L45,120 Z',
    center: { x: 52, y: 115 },
    absorption: 380,
    target: 480,
    percentage: 79,
    status: 'high'
  },
  {
    id: 'riau',
    name: 'Riau',
    path: 'M70,110 L90,105 L95,120 L80,130 L65,125 Z',
    center: { x: 78, y: 118 },
    absorption: 350,
    target: 500,
    percentage: 70,
    status: 'medium'
  },
  {
    id: 'jambi',
    name: 'Jambi',
    path: 'M65,125 L80,130 L85,140 L70,145 L60,135 Z',
    center: { x: 72, y: 135 },
    absorption: 290,
    target: 400,
    percentage: 72,
    status: 'medium'
  },
  {
    id: 'sumsel',
    name: 'Sumatera Selatan',
    path: 'M60,135 L85,140 L90,155 L75,160 L55,150 Z',
    center: { x: 72, y: 148 },
    absorption: 480,
    target: 650,
    percentage: 74,
    status: 'medium'
  },
  {
    id: 'bengkulu',
    name: 'Bengkulu',
    path: 'M45,140 L60,135 L55,150 L40,145 Z',
    center: { x: 50, y: 142 },
    absorption: 180,
    target: 250,
    percentage: 72,
    status: 'medium'
  },
  {
    id: 'lampung',
    name: 'Lampung',
    path: 'M55,150 L75,160 L80,170 L65,175 L50,165 Z',
    center: { x: 65, y: 162 },
    absorption: 420,
    target: 580,
    percentage: 72,
    status: 'medium'
  },
  
  // Java
  {
    id: 'banten',
    name: 'Banten',
    path: 'M80,170 L90,165 L95,175 L85,180 Z',
    center: { x: 87, y: 172 },
    absorption: 320,
    target: 450,
    percentage: 71,
    status: 'medium'
  },
  {
    id: 'jakarta',
    name: 'DKI Jakarta',
    path: 'M90,165 L95,160 L100,165 L95,170 Z',
    center: { x: 96, y: 165 },
    absorption: 85,
    target: 120,
    percentage: 71,
    status: 'medium'
  },
  {
    id: 'jabar',
    name: 'Jawa Barat',
    path: 'M95,170 L120,165 L125,175 L110,180 L85,180 Z',
    center: { x: 105, y: 172 },
    absorption: 850,
    target: 1200,
    percentage: 71,
    status: 'medium'
  },
  {
    id: 'jateng',
    name: 'Jawa Tengah',
    path: 'M110,180 L145,175 L150,185 L135,190 L120,185 Z',
    center: { x: 132, y: 182 },
    absorption: 980,
    target: 1100,
    percentage: 89,
    status: 'high'
  },
  {
    id: 'yogya',
    name: 'D.I. Yogyakarta',
    path: 'M135,190 L145,185 L150,195 L140,200 Z',
    center: { x: 142, y: 192 },
    absorption: 120,
    target: 160,
    percentage: 75,
    status: 'medium'
  },
  {
    id: 'jatim',
    name: 'Jawa Timur',
    path: 'M150,185 L185,180 L190,195 L175,200 L150,195 Z',
    center: { x: 170, y: 190 },
    absorption: 1250,
    target: 1400,
    percentage: 89,
    status: 'high'
  },
  
  // Kalimantan
  {
    id: 'kalbar',
    name: 'Kalimantan Barat',
    path: 'M110,120 L140,115 L145,140 L125,145 L105,135 Z',
    center: { x: 125, y: 130 },
    absorption: 280,
    target: 400,
    percentage: 70,
    status: 'medium'
  },
  {
    id: 'kalteng',
    name: 'Kalimantan Tengah',
    path: 'M125,145 L155,140 L160,160 L140,165 L120,155 Z',
    center: { x: 140, y: 152 },
    absorption: 220,
    target: 350,
    percentage: 63,
    status: 'medium'
  },
  {
    id: 'kalsel',
    name: 'Kalimantan Selatan',
    path: 'M140,165 L160,160 L165,175 L150,180 L135,175 Z',
    center: { x: 150, y: 170 },
    absorption: 190,
    target: 280,
    percentage: 68,
    status: 'medium'
  },
  {
    id: 'kaltim',
    name: 'Kalimantan Timur',
    path: 'M155,140 L180,135 L185,155 L170,160 L160,160 Z',
    center: { x: 170, y: 150 },
    absorption: 180,
    target: 400,
    percentage: 45,
    status: 'low'
  },
  {
    id: 'kalut',
    name: 'Kalimantan Utara',
    path: 'M140,115 L170,110 L175,125 L160,130 L145,125 Z',
    center: { x: 157, y: 120 },
    absorption: 95,
    target: 180,
    percentage: 53,
    status: 'medium'
  },
  
  // Sulawesi
  {
    id: 'sulut',
    name: 'Sulawesi Utara',
    path: 'M200,110 L215,105 L220,115 L210,125 L195,120 Z',
    center: { x: 207, y: 115 },
    absorption: 150,
    target: 220,
    percentage: 68,
    status: 'medium'
  },
  {
    id: 'sulteng',
    name: 'Sulawesi Tengah',
    path: 'M195,120 L210,125 L215,145 L200,150 L190,140 Z',
    center: { x: 202, y: 135 },
    absorption: 180,
    target: 280,
    percentage: 64,
    status: 'medium'
  },
  {
    id: 'sulsel',
    name: 'Sulawesi Selatan',
    path: 'M190,140 L215,145 L220,165 L205,175 L185,165 Z',
    center: { x: 202, y: 155 },
    absorption: 280,
    target: 450,
    percentage: 62,
    status: 'medium'
  },
  {
    id: 'sultenggara',
    name: 'Sulawesi Tenggara',
    path: 'M205,175 L225,170 L230,185 L215,190 L200,185 Z',
    center: { x: 215, y: 180 },
    absorption: 140,
    target: 200,
    percentage: 70,
    status: 'medium'
  },
  {
    id: 'gorontalo',
    name: 'Gorontalo',
    path: 'M210,115 L220,110 L225,120 L215,125 Z',
    center: { x: 217, y: 117 },
    absorption: 80,
    target: 120,
    percentage: 67,
    status: 'medium'
  },
  {
    id: 'sulbar',
    name: 'Sulawesi Barat',
    path: 'M185,150 L195,145 L200,160 L190,165 Z',
    center: { x: 192, y: 155 },
    absorption: 95,
    target: 150,
    percentage: 63,
    status: 'medium'
  },
  
  // Bali & Nusa Tenggara
  {
    id: 'bali',
    name: 'Bali',
    path: 'M190,195 L200,190 L205,200 L195,205 Z',
    center: { x: 197, y: 197 },
    absorption: 180,
    target: 250,
    percentage: 72,
    status: 'medium'
  },
  {
    id: 'ntb',
    name: 'Nusa Tenggara Barat',
    path: 'M205,200 L220,195 L225,205 L210,210 Z',
    center: { x: 215, y: 202 },
    absorption: 160,
    target: 230,
    percentage: 70,
    status: 'medium'
  },
  {
    id: 'ntt',
    name: 'Nusa Tenggara Timur',
    path: 'M225,205 L250,200 L255,210 L240,215 L230,210 Z',
    center: { x: 240, y: 207 },
    absorption: 180,
    target: 380,
    percentage: 47,
    status: 'low'
  },
  
  // Maluku & Papua
  {
    id: 'maluku',
    name: 'Maluku',
    path: 'M250,150 L270,145 L275,165 L260,170 L245,160 Z',
    center: { x: 260, y: 157 },
    absorption: 85,
    target: 150,
    percentage: 57,
    status: 'medium'
  },
  {
    id: 'malut',
    name: 'Maluku Utara',
    path: 'M245,130 L265,125 L270,140 L255,145 L240,135 Z',
    center: { x: 252, y: 135 },
    absorption: 70,
    target: 120,
    percentage: 58,
    status: 'medium'
  },
  {
    id: 'papua',
    name: 'Papua',
    path: 'M280,140 L340,135 L345,170 L325,175 L300,165 L275,155 Z',
    center: { x: 310, y: 155 },
    absorption: 120,
    target: 280,
    percentage: 43,
    status: 'low'
  },
  {
    id: 'papuabarat',
    name: 'Papua Barat',
    path: 'M260,145 L280,140 L285,160 L270,165 L255,155 Z',
    center: { x: 270, y: 152 },
    absorption: 85,
    target: 180,
    percentage: 47,
    status: 'low'
  }
];

export function IndonesiaMap({ provinces = indonesiaProvinces, onProvinceClick, onProvinceHover, className = '' }: IndonesiaMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return '#22c55e'; // green-500
      case 'medium': return '#eab308'; // yellow-500
      case 'low': return '#ef4444'; // red-500
      default: return '#6b7280'; // gray-500
    }
  };

  const getHoverColor = (status: string) => {
    switch (status) {
      case 'high': return '#16a34a'; // green-600
      case 'medium': return '#ca8a04'; // yellow-600
      case 'low': return '#dc2626'; // red-600
      default: return '#4b5563'; // gray-600
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <svg 
        viewBox="0 0 380 250" 
        className="w-full h-full"
        style={{ maxHeight: '100%' }}
      >
        {/* Background ocean */}
        <rect width="380" height="250" fill="#e0f2fe" />
        
        {/* Grid lines for reference */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#bae6fd" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="380" height="250" fill="url(#grid)" />
        
        {/* Province paths */}
        {provinces.map((province) => (
          <g key={province.id}>
            <path
              d={province.path}
              fill={getStatusColor(province.status)}
              stroke="#ffffff"
              strokeWidth="1"
              className="cursor-pointer transition-all duration-200 hover:opacity-80"
              onMouseEnter={() => onProvinceHover?.(province)}
              onMouseLeave={() => onProvinceHover?.(null)}
              onClick={() => onProvinceClick?.(province)}
              style={{
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))'
              }}
            />
            
            {/* Province labels for major ones */}
            {(['jatim', 'jateng', 'jabar', 'sumut', 'sulsel', 'kalbar', 'kaltim'].includes(province.id)) && (
              <text
                x={province.center.x}
                y={province.center.y}
                textAnchor="middle"
                fontSize="8"
                fill="#ffffff"
                fontWeight="600"
                className="pointer-events-none select-none"
                style={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.8))'
                }}
              >
                {province.name.split(' ')[0]}
              </text>
            )}
          </g>
        ))}
        
        {/* Compass */}
        <g transform="translate(340, 30)">
          <circle cx="0" cy="0" r="15" fill="rgba(255,255,255,0.9)" stroke="#374151" strokeWidth="1"/>
          <path d="M 0,-10 L 3,0 L 0,10 L -3,0 Z" fill="#ef4444"/>
          <text x="0" y="25" textAnchor="middle" fontSize="8" fill="#374151" fontWeight="600">N</text>
        </g>
        
        {/* Scale indicator */}
        <g transform="translate(20, 220)">
          <line x1="0" y1="0" x2="40" y2="0" stroke="#374151" strokeWidth="2"/>
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#374151" strokeWidth="2"/>
          <line x1="40" y1="-3" x2="40" y2="3" stroke="#374151" strokeWidth="2"/>
          <text x="20" y="15" textAnchor="middle" fontSize="8" fill="#374151">≈ 500km</text>
        </g>
        
        {/* Title */}
        <text x="190" y="20" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1f2937">
          Peta Sebaran Penyerapan Pupuk Indonesia
        </text>
      </svg>
    </div>
  );
}