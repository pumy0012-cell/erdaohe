"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Layers, Navigation, Plus, Minus, Building2, Briefcase, MapPin, Crosshair } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";

const CENTER_COORDS: [number, number] = [115.85, 39.82];
const INITIAL_ZOOM = 12;

const layerItems = [
  { name: "企业单位", color: "bg-primary", active: true },
  { name: "事业单位", color: "bg-accent", active: true },
  { name: "移民户位置", color: "bg-warning", active: true },
  { name: "工程项目", color: "bg-purple-500", active: true },
  { name: "淹没区", color: "bg-blue-600", active: false },
  { name: "永久用地", color: "bg-green-600", active: false },
  { name: "临时用地", color: "bg-orange-500", active: false },
];

const enterpriseData = [
  { id: 1, name: "北京水投水务工程建设管理有限公司", type: "企业", x: 30, y: 25 },
  { id: 2, name: "北京市水利规划设计研究院", type: "事业单位", x: 65, y: 30 },
  { id: 3, name: "中水北方勘测设计研究有限责任公司", type: "企业", x: 25, y: 45 },
  { id: 4, name: "黄河勘测规划设计研究院有限公司", type: "企业", x: 70, y: 55 },
  { id: 5, name: "长江监理", type: "企业", x: 40, y: 65 },
  { id: 6, name: "北京艺林生态科技有限公司", type: "企业", x: 55, y: 40 },
  { id: 7, name: "北京国道通公路设计研究院", type: "企业", x: 35, y: 55 },
  { id: 8, name: "北京市市政工程设计研究总院", type: "事业单位", x: 60, y: 70 },
];

const mapStats = [
  { label: "企业单位", value: "6家", color: "text-primary" },
  { label: "事业单位", value: "2家", color: "text-accent" },
  { label: "覆盖面积", value: "12.5km²", color: "text-warning" },
];

export default function MapPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState<number | null>(null);
  const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const osmLayer = new TileLayer({
      source: new OSM({
        attributions: '© OpenStreetMap contributors',
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer],
      view: new View({
        center: fromLonLat(CENTER_COORDS),
        zoom: INITIAL_ZOOM,
      }),
    });

    mapInstanceRef.current = map;

    map.on('moveend', () => {
      setMapZoom(map.getView().getZoom() || INITIAL_ZOOM);
    });

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  const handleLocate = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getView().animate({
        center: fromLonLat(CENTER_COORDS),
        zoom: INITIAL_ZOOM,
      });
    }
    setUserLocation({ x: 50, y: 50 });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.animate({ zoom: view.getZoom()! + 1 });
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.animate({ zoom: view.getZoom()! - 1 });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Status Bar */}
      <div className="status-bar-height flex items-center justify-between px-4 bg-background">
        <span className="text-foreground font-semibold text-[15px]">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-3 bg-foreground rounded-sm" />
          <div className="w-4 h-3 bg-foreground rounded-sm" />
          <div className="w-6 h-3 bg-green-500 rounded-[3px]" />
        </div>
      </div>

      {/* Header */}
      <div className="h-14 flex items-center px-4 bg-background border-b border-border">
        <button onClick={() => router.push("/dashboard")} className="mr-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
              <circle cx="9" cy="6" r="1" fill="currentColor" />
              <circle cx="15" cy="12" r="1" fill="currentColor" />
              <circle cx="9" cy="18" r="1" fill="currentColor" />
            </svg>
          </div>
        </button>
        <h1 className="text-lg font-semibold text-foreground">移民安置一张图</h1>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* OpenLayers Map */}
        <div ref={mapRef} className="absolute inset-0" />

        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4">
          <div className="h-11 bg-card/95 backdrop-blur rounded-xl flex items-center px-3 gap-2.5 border border-border shadow-lg">
            <Search className="w-[18px] h-[18px] text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索企业、事业单位..."
              className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        {/* Layer Control */}
        <div className="absolute top-20 left-4">
          <div className="bg-card/95 backdrop-blur rounded-xl p-3 space-y-2 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground font-medium">图层</span>
            </div>
            {layerItems.map((layer, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <div className={`w-3 h-3 rounded ${layer.active ? layer.color : 'bg-input border border-muted-foreground'}`} />
                <span className={`text-xs ${layer.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {layer.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-32 right-4 space-y-2">
          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 bg-card/95 backdrop-blur rounded-xl flex items-center justify-center border border-border shadow-lg active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5 text-foreground" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 bg-card/95 backdrop-blur rounded-xl flex items-center justify-center border border-border shadow-lg active:scale-95 transition-transform"
          >
            <Minus className="w-5 h-5 text-foreground" />
          </button>
          <button 
            onClick={handleLocate}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all ${
              userLocation 
                ? 'bg-primary text-white' 
                : 'bg-card/95 backdrop-blur border border-border'
            }`}
          >
            <Navigation className={`w-5 h-5 ${userLocation ? 'text-white' : 'text-primary'}`} />
          </button>
        </div>

        {/* Selected Enterprise Info */}
        {selectedEnterprise && (
          <div className="absolute bottom-32 left-4 right-20">
            <div className="bg-card/95 backdrop-blur rounded-xl p-4 border border-border shadow-lg">
              {(() => {
                const enterprise = enterpriseData.find(e => e.id === selectedEnterprise);
                if (!enterprise) return null;
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        enterprise.type === '企业' ? 'bg-primary/10' : 'bg-accent/10'
                      }`}>
                        {enterprise.type === '企业' ? (
                          <Building2 className="w-4 h-4 text-primary" />
                        ) : (
                          <Briefcase className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{enterprise.name}</h3>
                        <span className={`text-xs ${
                          enterprise.type === '企业' ? 'text-primary' : 'text-accent'
                        }`}>{enterprise.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>房山区二道河水库工程区域</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Stats Panel */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-card/95 backdrop-blur rounded-xl p-4 border border-border shadow-lg">
            <div className="flex justify-around">
              {mapStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
