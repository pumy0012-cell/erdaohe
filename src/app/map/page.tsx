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
import { getCenter } from "ol/extent";
import { Style, Stroke, Fill, Text } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import "ol/ol.css";

const CENTER_COORDS: [number, number] = [115.85, 39.82];
const INITIAL_ZOOM = 12;

interface LayerItem {
  id: string;
  name: string;
  color: string;
  file: string;
  rgbColor: [number, number, number];
  isClickable: boolean;
  labelField?: string;
  showLabel?: boolean;
}

const layerItems: LayerItem[] = [
  { id: "企业单位", name: "企业单位", color: "bg-primary", file: "/EDH_Qiye.json", rgbColor: [0, 120, 215], isClickable: true, labelField: "Layer", showLabel: true },
  { id: "移民户位置", name: "移民户位置", color: "bg-warning", file: "/fwxx.geojson", rgbColor: [255, 180, 0], isClickable: true },
  { id: "淹没区", name: "淹没区", color: "bg-blue-600", file: "/EDH_YMQ_20Nian.json", rgbColor: [25, 118, 210], isClickable: false },
  { id: "永久用地", name: "永久用地", color: "bg-green-600", file: "/EDH_SNQ.json", rgbColor: [56, 142, 60], isClickable: false },
  { id: "临时用地", name: "临时用地", color: "bg-orange-500", file: "/EDH_LSYD.json", rgbColor: [255, 112, 67], isClickable: false },
  { id: "行政区域", name: "行政区域", color: "bg-indigo-500", file: "/EDH_XZC.json", rgbColor: [63, 81, 181], isClickable: false, labelField: "村", showLabel: true },
];

export default function MapPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["移民户位置", "企业单位", "行政区域"]));
  const [selectedFeature, setSelectedFeature] = useState<{ layerId: string; properties: any } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OLMap | null>(null);
  const layerRefsRef = useRef<Map<string, VectorLayer>>(new Map());
  const colorMapRef = useRef<Map<string, [number, number, number]>>(new Map());
  const headerRef = useRef<HTMLDivElement>(null);
  const immigrantSourceRef = useRef<VectorSource | null>(null);

  // Load GeoJSON and create vector layer
  const createVectorLayer = async (file: string, layerId: string, rgbColor: [number, number, number], isClickable: boolean, labelField?: string, showLabel?: boolean) => {
    try {
      const response = await fetch(file);
      const geojsonData = await response.json();
      
      const source = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonData, {
          featureProjection: 'EPSG:3857',
        }),
      });

      if (layerId === "行政区域" && source.getFeatures().length > 0) {
        const firstFeature = source.getFeatures()[0];
        const props = firstFeature.getProperties();
        console.log("行政区域图层属性:", Object.keys(props));
        console.log("行政区域图层第一个要素:", props);
        console.log("村字段值:", props['村']);
        console.log("CUN1字段值:", props['CUN1']);
        console.log("ZHEN1字段值:", props['ZHEN1']);
        console.log("ZLDWMC字段值:", props['ZLDWMC']);
      }

      const [r, g, b] = rgbColor;
      
      const villageColors: [number, number, number][] = [
        [59, 130, 246],   // 蓝色
        [34, 197, 94],    // 绿色
        [249, 115, 22],   // 橙色
        [168, 85, 247],   // 紫色
        [236, 72, 153],   // 粉色
        [20, 184, 166],   // 青色
        [234, 179, 8],    // 黄色
        [239, 68, 68],    // 红色
        [99, 102, 241],   // 靛蓝
        [16, 185, 129],   // emerald
      ];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let style: any;
      
      if (showLabel && labelField) {
        const isAdminLayer = layerId === "行政区域";
        
        style = (feature: Feature, resolution: number) => {
          let labelText = feature.get(labelField) as string;
          const zoom = mapInstanceRef.current?.getView().getZoom() || 0;
          
          let featureColor: [number, number, number];
          let showLabelNow = false;
          
          if (isAdminLayer) {
            showLabelNow = zoom < 12;
            const featureId = feature.getProperties()['OBJECTID'] || feature.getProperties()['FID'] || 0;
            featureColor = villageColors[featureId % villageColors.length];
            
            if (!labelText) {
              labelText = feature.get('ZLDWMC') as string || feature.get('CUN1') as string || feature.get('ZHEN1') as string;
            }
            if (labelText) {
              labelText = labelText + '村';
            }
          } else {
            showLabelNow = zoom >= 12;
            featureColor = [r, g, b];
          }
          
          if (!showLabelNow || !labelText) {
            return new Style({
              stroke: new Stroke({
                color: `rgba(${featureColor[0]}, ${featureColor[1]}, ${featureColor[2]}, 0.8)`,
                width: isAdminLayer ? 3 : 2,
              }),
              fill: new Fill({
                color: `rgba(${featureColor[0]}, ${featureColor[1]}, ${featureColor[2]}, 0.15)`,
              }),
            });
          }
          
          const maxCharsPerLine = isAdminLayer ? 4 : 6;
          let wrappedText = labelText;
          if (labelText.length > maxCharsPerLine) {
            const lines: string[] = [];
            for (let i = 0; i < labelText.length; i += maxCharsPerLine) {
              lines.push(labelText.slice(i, i + maxCharsPerLine));
            }
            wrappedText = lines.join('\n');
          }
          
          return new Style({
            geometry: isAdminLayer ? (() => {
              const geometry = feature.getGeometry();
              if (geometry) {
                const extent = geometry.getExtent();
                const center = getCenter(extent);
                return new Point(center);
              }
              return undefined;
            })() : undefined,
            stroke: new Stroke({
              color: `rgba(${featureColor[0]}, ${featureColor[1]}, ${featureColor[2]}, 0.8)`,
              width: isAdminLayer ? 3 : 2,
            }),
            fill: new Fill({
              color: `rgba(${featureColor[0]}, ${featureColor[1]}, ${featureColor[2]}, 0.15)`,
            }),
            text: new Text({
              text: wrappedText,
              font: isAdminLayer ? 'bold 14px Inter, sans-serif' : '11px Inter, sans-serif',
              fill: new Fill({
                color: `rgba(${featureColor[0]}, ${featureColor[1]}, ${featureColor[2]}, 1)`,
              }),
              stroke: new Stroke({
                color: 'rgba(255,255,255,0.9)',
                width: 3,
              }),
              textAlign: 'center',
              textBaseline: 'middle',
              placement: 'point',
              overflow: false,
            }),
          });
        };
      } else {
        style = new Style({
          stroke: new Stroke({
            color: `rgba(${r}, ${g}, ${b}, 0.8)`,
            width: 2,
          }),
          fill: new Fill({
            color: `rgba(${r}, ${g}, ${b}, 0.2)`,
          }),
        });
      }
      
      const vectorLayer = new VectorLayer({
        source,
        style,
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

    map.updateSize();

    // Load default active layers
    const loadDefaultLayers = async () => {
      for (const layerItem of layerItems) {
        if (activeLayers.has(layerItem.id) && layerItem.file) {
          const result = await createVectorLayer(layerItem.file, layerItem.id, layerItem.rgbColor, layerItem.isClickable, layerItem.labelField, layerItem.showLabel);
          if (result?.vectorLayer) {
            map.addLayer(result.vectorLayer);
            layerRefsRef.current.set(layerItem.id, result.vectorLayer);
          }
        }
      }
    };
    loadDefaultLayers();

    map.on('moveend', () => {
      setMapZoom(map.getView().getZoom() || INITIAL_ZOOM);
    });

    // Handle map click to select features
    map.on('singleclick', (evt) => {
      let foundFeature = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (foundFeature) return;
        // Get layer ID from the layer itself
        const layerId = Array.from(layerRefsRef.current.entries())
          .find(([_, vectorLayer]) => vectorLayer === layer)?.[0];
        
        if (layerId) {
          const layerConfig = layerItems.find(l => l.id === layerId);
          if (layerConfig?.isClickable) {
            const properties = feature.getProperties();
            // Filter out geometry
            delete properties.geometry;
            setSelectedFeature({
              layerId,
              properties,
            });
            foundFeature = true;
          }
        }
      }, { hitTolerance: 10 });
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
      const layerItem = layerItems.find(l => l.id === layerId);
      const result = await createVectorLayer(file, layerId, rgbColor || [0, 120, 215], isClickable || false, layerItem?.labelField, layerItem?.showLabel);
      if (result?.vectorLayer) {
        mapInstanceRef.current.addLayer(result.vectorLayer);
        layerRefsRef.current.set(layerId, result.vectorLayer);
        newActiveLayers.add(layerId);
      }
    }

    setActiveLayers(newActiveLayers);
  };

  // Handle search by owner name
  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    if (!keyword.trim() || !mapInstanceRef.current) return;

    const layerId = "移民户位置";
    let vectorLayer = layerRefsRef.current.get(layerId);
    let source = vectorLayer?.getSource();

    if (!source) {
      const layerItem = layerItems.find(l => l.id === layerId);
      if (!layerItem?.file) return;
      
      const result = await createVectorLayer(layerItem.file, layerId, layerItem.rgbColor, layerItem.isClickable, layerItem.labelField, layerItem.showLabel);
      if (!result) return;
      
      mapInstanceRef.current.addLayer(result.vectorLayer);
      layerRefsRef.current.set(layerId, result.vectorLayer);
      source = result.source;
    }

    const features = source.getFeatures();
    const matchedFeature = features.find(feature => {
      const props = feature.getProperties();
      const ownerName = props['产权人'] || '';
      return ownerName.includes(keyword.trim());
    });

    if (matchedFeature) {
      const geometry = matchedFeature.getGeometry();
      if (geometry) {
        const extent = geometry.getExtent();
        mapInstanceRef.current.getView().fit(extent, {
          padding: [100, 100, 100, 100],
          duration: 500,
        });
        
        const properties = matchedFeature.getProperties();
        delete properties.geometry;
        setSelectedFeature({
          layerId: "移民户信息",
          properties,
        });
      }
    }
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
        const layerItem = layerItems.find(l => l.id === layerId);
        if (layerItem) {
          const resultWithLabel = await createVectorLayer(file, layerId, rgbColor || [0, 120, 215], isClickable || false, layerItem.labelField, layerItem.showLabel);
          if (resultWithLabel) return resultWithLabel;
        }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Status Bar */}
      <div className="status-bar-height flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl">
        <span className="text-slate-700 font-semibold text-[15px]">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-[18px] h-3 bg-slate-700 rounded-sm" />
          <div className="w-4 h-3 bg-slate-700 rounded-sm" />
          <div className="w-6 h-3 bg-emerald-500 rounded-[3px]" />
        </div>
      </div>

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
              <circle cx="9" cy="6" r="1" fill="currentColor" />
              <circle cx="15" cy="12" r="1" fill="currentColor" />
              <circle cx="9" cy="18" r="1" fill="currentColor" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">移民安置一张图</h1>
            <p className="text-xs text-slate-500">二道河水库工程</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
        {/* OpenLayers Map */}
        <div ref={mapRef} className="absolute inset-0" />

        {/* Search Bar - 浮动在地图之上 */}
        <div className={`absolute top-4 left-4 right-4 z-10 transition-opacity duration-200 ${showSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="h-11 bg-white/90 backdrop-blur rounded-xl flex items-center px-3 gap-2.5 border border-slate-200/50 shadow-lg">
            <Search className="w-[18px] h-[18px] text-slate-400" />
            <input
              type="text"
              placeholder="搜索产权人姓名..."
              value={searchKeyword || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent text-slate-700 text-sm placeholder:text-slate-400 outline-none"
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchKeyword("");
              }}
              className="flex-shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
              title="关闭搜索"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toggle Search Button - shown when search is hidden */}
        {!showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center border border-slate-200/50 shadow-lg active:scale-95 transition-transform z-10"
            title="打开搜索"
          >
            <Search className="w-5 h-5 text-slate-400" />
          </button>
        )}

        {/* Layer Control */}
        <div className="absolute top-20 left-4">
          <div className="bg-white/90 backdrop-blur rounded-xl p-3 space-y-2 border border-slate-200/50 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span className="text-xs text-slate-700 font-medium">图层</span>
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
                        ? 'text-slate-700'
                        : 'text-slate-400'
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
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center border border-slate-200/50 shadow-lg active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5 text-slate-600" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center border border-slate-200/50 shadow-lg active:scale-95 transition-transform"
          >
            <Minus className="w-5 h-5 text-slate-600" />
          </button>
          <button 
            onClick={handleLocate}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all ${
              userLocation 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white/90 backdrop-blur border border-slate-200/50'
            }`}
          >
            <Navigation className={`w-5 h-5 ${userLocation ? 'text-white' : 'text-indigo-500'}`} />
          </button>
        </div>

        {/* enterprise detail panel removed (no markers) */}
        {/* stats panel removed */}

        {/* Feature Info Panel */}
        {selectedFeature && (
          <div className="absolute bottom-32 left-4 right-20 max-w-sm">
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 border border-slate-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-800">移民户信息</h3>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { key: '编号', value: selectedFeature.properties['编号'] },
                  { key: '村', value: selectedFeature.properties['村'] },
                  { key: '组别', value: selectedFeature.properties['组别'] },
                  { key: '产权人', value: selectedFeature.properties['产权人'] },
                  { key: '联系电话', value: selectedFeature.properties['联系电话'] },
                  { key: '认定人口', value: selectedFeature.properties['认定人口'] },
                  { key: '宅基地面积', value: selectedFeature.properties['宅基地面积'] ? `${selectedFeature.properties['宅基地面积']}㎡` : '' },
                  { key: '建筑面积', value: selectedFeature.properties['建筑面积'] ? `${selectedFeature.properties['建筑面积']}㎡` : '' },
                  { key: '层数', value: selectedFeature.properties['层数'] },
                  { key: '宅基地坐落', value: selectedFeature.properties['宅基地坐落'], fullWidth: true },
                ].filter(item => item.value !== undefined && item.value !== null && item.value !== '').map((item) => (
                  <div key={item.key} className={item.fullWidth ? 'col-span-2' : ''}>
                    <div className="text-[10px] text-slate-400">{item.key}</div>
                    <div className="text-xs font-medium text-slate-700 truncate">{String(item.value)}</div>
                  </div>
                ))}
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
