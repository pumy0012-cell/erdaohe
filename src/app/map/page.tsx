"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Layers, Navigation, Plus, Minus, X } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Map as OLMap, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { defaults as defaultControls } from "ol/control";
import { Style, Stroke, Fill } from "ol/style";
import "ol/ol.css";

const CENTER_COORDS: [number, number] = [115.85, 39.82];
const INITIAL_ZOOM = 12;

const layerItems = [
  { id: "企业单位", name: "企业单位", color: "bg-primary", file: "/EDH_Qiye.json", rgbColor: [0, 120, 215], isClickable: true },
  { id: "移民户位置", name: "移民户位置", color: "bg-warning", file: "/fwxx.geojson", rgbColor: [255, 180, 0], isClickable: true },
  { id: "淹没区", name: "淹没区", color: "bg-blue-600", file: "/EDH_YMQ_20Nian.json", rgbColor: [25, 118, 210], isClickable: false },
  { id: "永久用地", name: "永久用地", color: "bg-green-600", file: "/EDH_SNQ.json", rgbColor: [56, 142, 60], isClickable: false },
  { id: "临时用地", name: "临时用地", color: "bg-orange-500", file: "/EDH_LSYD.json", rgbColor: [255, 112, 67], isClickable: false },
  { id: "行政区域", name: "行政区域", color: "bg-indigo-500", file: "/EDH_XZC.json", rgbColor: [63, 81, 181], isClickable: false },
];

export default function MapPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());
  const [selectedFeature, setSelectedFeature] = useState<{ layerId: string; properties: any } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OLMap | null>(null);
  const layerRefsRef = useRef<Map<string, VectorLayer>>(new Map());
  const colorMapRef = useRef<Map<string, [number, number, number]>>(new Map());
  const headerRef = useRef<HTMLDivElement>(null);

  // Load GeoJSON and create vector layer
  const createVectorLayer = async (file: string, layerId: string, rgbColor: [number, number, number], isClickable: boolean) => {
    try {
      const response = await fetch(file);
      const geojsonData = await response.json();
      
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonData, {
          featureProjection: 'EPSG:3857',
        }),
      });

      const [r, g, b] = rgbColor;
      const vectorLayer = new VectorLayer({
        source,
        style: new Style({
          stroke: new Stroke({
            color: `rgba(${r}, ${g}, ${b}, 0.8)`,
            width: 2,
          }),
          fill: new Fill({
            color: `rgba(${r}, ${g}, ${b}, 0.2)`,
          }),
        }),
      });

      return { vectorLayer, source, isClickable };
    } catch (error) {
      console.error(`Error loading layer ${layerId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize layer refs as a Map
    if (!layerRefsRef.current || !(layerRefsRef.current instanceof Map)) {
      layerRefsRef.current = new Map();
    }

    const esriLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: '© Esri',
      }),
      className: 'esri-tile',
    });

    const map = new OLMap({
      target: mapRef.current,
      layers: [esriLayer],
      view: new View({
        center: fromLonLat(CENTER_COORDS),
        zoom: INITIAL_ZOOM,
      }),
      controls: defaultControls({
        zoom: false,
      }),
    });

    mapInstanceRef.current = map;

    map.on('moveend', () => {
      setMapZoom(map.getView().getZoom() || INITIAL_ZOOM);
    });

    // Handle map click to select features
    map.on('singleclick', (evt) => {
      let foundFeature = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (foundFeature) return;
        // Find which layer this feature belongs to
        for (const [layerId, vectorLayer] of layerRefsRef.current.entries()) {
          if (layer === vectorLayer) {
            const layerConfig = layerItems.find(l => l.id === layerId);
            if (layerConfig?.isClickable) {
              setSelectedFeature({
                layerId,
                properties: feature.getProperties(),
              });
              foundFeature = true;
              break;
            }
          }
        }
      });
      if (!foundFeature) {
        setSelectedFeature(null);
      }
    });

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  // adjust map container to sit between header and bottom nav
  useEffect(() => {
    const adjust = () => {
      if (!mapRef.current) return;
      const headerEl = headerRef.current;
      const bottomEl = document.getElementById('bottom-nav');
      const topPx = headerEl ? Math.ceil(headerEl.getBoundingClientRect().bottom) : 0;
      const bottomPx = bottomEl ? Math.ceil(bottomEl.getBoundingClientRect().height) : 0;
      mapRef.current.style.top = `${topPx}px`;
      mapRef.current.style.bottom = `${bottomPx}px`;
    };
    // initial adjust and on resize
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  // Handle layer toggle
  const handleLayerToggle = async (layerId: string, file: string | null, rgbColor?: [number, number, number], isClickable?: boolean) => {
    if (!mapInstanceRef.current || !file) return;

    const newActiveLayers = new Set(activeLayers);
    const layerConfig = layerItems.find(l => l.id === layerId);

    if (newActiveLayers.has(layerId)) {
      // Remove layer
      newActiveLayers.delete(layerId);
      const layer = layerRefsRef.current.get(layerId);
      if (layer) {
        mapInstanceRef.current.removeLayer(layer);
        layerRefsRef.current.delete(layerId);
      }
    } else {
      // Add layer
      const result = await createVectorLayer(file, layerId, rgbColor || [0, 120, 215], isClickable || false);
      if (result?.vectorLayer) {
        mapInstanceRef.current.addLayer(result.vectorLayer);
        layerRefsRef.current.set(layerId, result.vectorLayer);
        newActiveLayers.add(layerId);
      }
    }

    setActiveLayers(newActiveLayers);
  };

  // Handle layer double click to zoom to layer extent
  const handleLayerDoubleClick = async (layerId: string, file: string | null, rgbColor?: [number, number, number], isClickable?: boolean) => {
    if (!mapInstanceRef.current || !file) return;

    try {
      // If layer not loaded, load it first
      let vectorLayer = layerRefsRef.current.get(layerId);
      let source;
      if (!vectorLayer) {
        const result = await createVectorLayer(file, layerId, rgbColor || [0, 120, 215], isClickable || false);
        if (!result) return;
        vectorLayer = result.vectorLayer;
        source = result.source;
      } else {
        source = vectorLayer.getSource();
      }

      if (!source) return;

      const features = source.getFeatures();
      if (features.length === 0) return;

      // Calculate extent from features
      let extent: [number, number, number, number] | null = null;
      features.forEach((feature) => {
        const geom = feature.getGeometry();
        if (geom) {
          const featureExtent = geom.getExtent();
          if (extent === null) {
            extent = featureExtent;
          } else {
            extent = [
              Math.min(extent[0], featureExtent[0]),
              Math.min(extent[1], featureExtent[1]),
              Math.max(extent[2], featureExtent[2]),
              Math.max(extent[3], featureExtent[3]),
            ];
          }
        }
      });

      if (extent) {
        // Fit map view to extent with padding
        const view = mapInstanceRef.current.getView();
        view.fit(extent, { padding: [50, 50, 50, 50], duration: 500 });
      }
    } catch (error) {
      console.error(`Error zooming to layer ${layerId}:`, error);
    }
  };

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
      <div ref={headerRef} className="h-14 flex items-center px-4 bg-background border-b border-border">
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
        {/* OpenLayers Map: leave space at top for search and at bottom for bottom nav */}
        <div ref={mapRef} className="absolute left-0 right-0" />

        {/* Search Bar */}
        {showSearch && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="h-11 bg-card/95 backdrop-blur rounded-xl flex items-center px-3 gap-2.5 border border-border shadow-lg">
              <Search className="w-[18px] h-[18px] text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索企业、事业单位..."
                className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={() => setShowSearch(false)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                title="关闭搜索"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Toggle Search Button - shown when search is hidden */}
        {!showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="absolute top-4 left-4 w-10 h-10 bg-card/95 backdrop-blur rounded-xl flex items-center justify-center border border-border shadow-lg active:scale-95 transition-transform z-10"
            title="打开搜索"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
        )}

        {/* Layer Control */}
        <div className="absolute top-20 left-4">
          <div className="bg-card/95 backdrop-blur rounded-xl p-3 space-y-2 border border-border shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground font-medium">图层</span>
            </div>
            {layerItems.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center gap-2 cursor-pointer w-full hover:opacity-80 transition-opacity"
              >
                {/* Checkbox - click to toggle layer visibility */}
                <button
                  onClick={() => handleLayerToggle(layer.id, layer.file, layer.rgbColor, layer.isClickable)}
                  disabled={!layer.file}
                  className="flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="点击切换图层显示"
                >
                  <div
                    className={`w-3 h-3 rounded transition-colors ${
                      activeLayers.has(layer.id)
                        ? layer.color
                        : 'bg-input border border-muted-foreground'
                    }`}
                  />
                </button>
                
                {/* Layer name - double click to zoom to layer extent */}
                <span
                  onDoubleClick={() => handleLayerDoubleClick(layer.id, layer.file, layer.rgbColor, layer.isClickable)}
                  className={`text-xs flex-1 select-none ${
                    activeLayers.has(layer.id)
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  } ${layer.file ? 'cursor-pointer hover:underline' : 'cursor-not-allowed'}`}
                  title="双击缩放到图层位置"
                >
                  {layer.name}
                </span>
              </div>
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

        {/* enterprise detail panel removed (no markers) */}
        {/* stats panel removed */}

        {/* Feature Info Panel */}
        {selectedFeature && (
          <div className="absolute bottom-32 left-4 right-20 max-w-sm">
            <div className="bg-card/95 backdrop-blur rounded-xl p-4 border border-border shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">{selectedFeature.layerId}</h3>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(selectedFeature.properties).map(([key, value]) => {
                  // Skip geometry and internal OL properties
                  if (key === 'geometry' || key.startsWith('_')) return null;
                  return (
                    <div key={key} className="text-xs">
                      <span className="text-muted-foreground font-medium">{key}:</span>
                      <span className="text-foreground ml-2">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
