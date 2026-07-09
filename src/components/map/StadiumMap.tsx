"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  pointsOfInterest,
  sectionGeoJSON,
  gateMarkersGeoJSON,
  heatmapGeoJSON,
  STADIUM_CENTER,
  type POI,
  type LayerConfig,
} from "./stadiumData";

// ─── Fix Leaflet default icon paths ───────────────────────────

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Color helpers ────────────────────────────────────────────

const poiColors: Record<string, string> = {
  gate: "#f0c929",
  restroom: "#06b6d4",
  food: "#f97316",
  medical: "#10b981",
  info: "#6366f1",
  parking: "#8b5cf6",
  entrance: "#ffffff",
  escalator: "#94a3b8",
  elevator: "#94a3b8",
  store: "#f59e0b",
};

const zoneStatusColors: Record<string, string> = {
  low: "#10b981",
  moderate: "#818cf8",
  high: "#f59e0b",
  critical: "#f43f5e",
};

// ─── Props ────────────────────────────────────────────────────

interface StadiumMapProps {
  layers: LayerConfig[];
  onLayerToggle?: (layerId: string) => void;
  onZoneClick?: (zoneId: string, zoneName: string) => void;
  onPOIClick?: (poi: POI) => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────

export default function StadiumMap({
  layers,
  onZoneClick,
  onPOIClick,
  className = "",
}: StadiumMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const initialized = useRef(false);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(15.5);

  // Layer group refs for visibility toggling
  const layerGroups = useRef<Record<string, L.LayerGroup>>({});

  useEffect(() => {
    if (initialized.current || !mapContainer.current) return;
    initialized.current = true;

    // ── Init Map ───────────────────────────────────────────────
    const m = L.map(mapContainer.current, {
      center: STADIUM_CENTER as [number, number],
      zoom: 15.5,
      zoomControl: false,
      attributionControl: true,
    });

    // ── Professional Dark Map Tiles (CartoDB, FREE) ────────────
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 20,
        subdomains: "abcd",
        className: "",
      },
    ).addTo(m);

    L.control.zoom({ position: "bottomright" }).addTo(m);

    // ── Stadium Bowl Polygon (MetLife Stadium - East Rutherford, NJ) ──
    const bowlCoords: [number, number][] = [
      [-74.0765, 40.8145],
      [-74.0735, 40.8155],
      [-74.0715, 40.8148],
      [-74.0725, 40.8125],
      [-74.0745, 40.8115],
      [-74.0775, 40.812],
      [-74.0785, 40.8135],
      [-74.0765, 40.8145],
    ];

    const bowl = L.polygon(bowlCoords, {
      color: "#818cf8",
      weight: 2.5,
      opacity: 0.7,
      fillColor: "#1e1b4b",
      fillOpacity: 0.5,
    }).addTo(m);

    // ── Parking Lots ─────────────────────────────────────────────
    const parkingCoords: [number, number][][] = [
      [
        [-74.0805, 40.8165],
        [-74.0785, 40.8175],
        [-74.077, 40.816],
        [-74.079, 40.815],
        [-74.0805, 40.8165],
      ],
      [
        [-74.0705, 40.816],
        [-74.0685, 40.8155],
        [-74.069, 40.8135],
        [-74.071, 40.814],
        [-74.0705, 40.816],
      ],
      [
        [-74.081, 40.8125],
        [-74.0795, 40.811],
        [-74.078, 40.812],
        [-74.0795, 40.8135],
        [-74.081, 40.8125],
      ],
    ];

    parkingCoords.forEach((coords) => {
      L.polygon(coords, {
        color: "rgba(139, 92, 246, 0.3)",
        weight: 1,
        opacity: 0.5,
        fillColor: "rgba(139, 92, 246, 0.15)",
        fillOpacity: 0.4,
      }).addTo(m);
    });

    // ── Roads / Approach Paths ───────────────────────────────────
    const roadCoords: [number, number][][] = [
      [
        [-74.082, 40.813],
        [-74.0785, 40.814],
        [-74.075, 40.813],
      ],
      [
        [-74.071, 40.814],
        [-74.068, 40.8135],
        [-74.066, 40.813],
      ],
      [
        [-74.077, 40.816],
        [-74.075, 40.8165],
        [-74.073, 40.816],
      ],
    ];

    roadCoords.forEach((coords) => {
      L.polyline(coords, {
        color: "rgba(165, 180, 252, 0.2)",
        weight: 3,
        opacity: 0.3,
      }).addTo(m);
    });

    // ── Zones ──────────────────────────────────────────────────
    const zoneGroup = L.layerGroup().addTo(m);
    const zoneFeatures: {
      feature: L.Polygon;
      id: string;
      name: string;
      crowdLevel: number;
      status: string;
      color: string;
    }[] = [];

    if (sectionGeoJSON.type === "FeatureCollection") {
      sectionGeoJSON.features.forEach((f: GeoJSON.Feature) => {
        if (
          f.geometry?.type === "Polygon" ||
          f.geometry?.type === "MultiPolygon"
        ) {
          const coords =
            f.geometry.type === "Polygon"
              ? (f.geometry.coordinates[0] as [number, number][]).map(
                  (c) => [c[1], c[0]] as [number, number],
                )
              : (f.geometry.coordinates[0][0] as [number, number][]).map(
                  (c) => [c[1], c[0]] as [number, number],
                );

          const props = f.properties || {};
          const zoneColor = zoneStatusColors[props.status] || "#818cf8";

          const polygon = L.polygon(coords, {
            color: "#ffffff",
            weight: 1.5,
            opacity: 0.15,
            fillColor: zoneColor,
            fillOpacity: 0.4,
          }).addTo(zoneGroup);

          polygon.on("click", () => {
            onZoneClick?.(props.id, props.name);
            polygon
              .bindPopup(
                `
              <div style="font-family:system-ui;color:#1e1b4b;">
                <strong style="font-size:14px;">${props.name}</strong>
                <div style="font-size:12px;margin-top:4px;">Crowd Level: ${props.crowdLevel}%</div>
                <div style="font-size:12px;">Status: <span style="color:${zoneColor};">●</span> ${props.status}</div>
              </div>
            `,
              )
              .openPopup();
          });

          polygon.on("mouseover", () => {
            polygon.setStyle({ fillOpacity: 0.7 });
            m.getContainer().style.cursor = "pointer";
          });
          polygon.on("mouseout", () => {
            polygon.setStyle({ fillOpacity: 0.4 });
            m.getContainer().style.cursor = "";
          });

          zoneFeatures.push({
            feature: polygon,
            id: props.id,
            name: props.name,
            crowdLevel: props.crowdLevel,
            status: props.status,
            color: zoneColor,
          });
        }
      });
    }
    layerGroups.current.zones = zoneGroup;

    // ── Gates (Circle Markers) ─────────────────────────────────
    const gateGroup = L.layerGroup().addTo(m);
    if (gateMarkersGeoJSON.type === "FeatureCollection") {
      gateMarkersGeoJSON.features.forEach((f: GeoJSON.Feature) => {
        if (f.geometry?.type === "Point") {
          const [lng, lat] = f.geometry.coordinates;
          const name = f.properties?.name || "";
          const circle = L.circleMarker([lat, lng], {
            radius: 8,
            color: "#ffffff",
            weight: 2,
            fillColor: "#f0c929",
            fillOpacity: 0.9,
          }).addTo(gateGroup);

          circle.bindPopup(
            `<div style="font-family:system-ui;color:#1e1b4b;"><strong>${name}</strong></div>`,
          );
          circle.on("mouseover", () => {
            circle.setRadius(10);
          });
          circle.on("mouseout", () => {
            circle.setRadius(8);
          });
        }
      });
    }
    layerGroups.current.gates = gateGroup;

    // ── POIs ───────────────────────────────────────────────────
    const poiGroup = L.layerGroup().addTo(m);
    pointsOfInterest.forEach((poi) => {
      const [lng, lat] = poi.coordinates;
      const color = poiColors[poi.type] || "#94a3b8";

      const marker = L.circleMarker([lat, lng], {
        radius: 5,
        color: "#ffffff",
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.85,
      }).addTo(poiGroup);

      marker.bindPopup(`
        <div style="font-family:system-ui;color:#1e1b4b;max-width:200px;">
          <strong style="font-size:14px;">${poi.name}</strong>
          <div style="font-size:12px;margin-top:4px;color:#64748b;">${poi.description || ""}</div>
          ${poi.status ? `<div style="font-size:11px;margin-top:4px;">Status: ${poi.status}</div>` : ""}
        </div>
      `);

      marker.on("click", () => onPOIClick?.(poi));
      marker.on("mouseover", () => {
        marker.setRadius(7);
        m.getContainer().style.cursor = "pointer";
      });
      marker.on("mouseout", () => {
        marker.setRadius(5);
        m.getContainer().style.cursor = "";
      });
    });
    layerGroups.current.pois = poiGroup;

    // ── Heatmap (simplified: circle markers with opacity gradient) ──
    const heatGroup = L.layerGroup().addTo(m);
    if (heatmapGeoJSON.type === "FeatureCollection") {
      heatmapGeoJSON.features.forEach((f: GeoJSON.Feature) => {
        if (f.geometry?.type === "Point") {
          const [lng, lat] = f.geometry.coordinates;
          const intensity = f.properties?.intensity || 0.5;
          const r = 15 + intensity * 25;
          const opacity = 0.2 + intensity * 0.5;

          // Heatmap gradient color based on intensity
          let color = "#10b981";
          if (intensity > 0.8) color = "#f43f5e";
          else if (intensity > 0.6) color = "#f59e0b";
          else if (intensity > 0.4) color = "#818cf8";
          else color = "#10b981";

          L.circleMarker([lat, lng], {
            radius: r,
            color,
            weight: 0,
            fillColor: color,
            fillOpacity: opacity,
          }).addTo(heatGroup);
        }
      });
    }
    layerGroups.current.heatmap = heatGroup;

    // ── Set initial visibility ─────────────────────────────────
    const visibilityMap: Record<string, L.LayerGroup> = {
      zones: zoneGroup,
      gates: gateGroup,
      pois: poiGroup,
      heatmap: heatGroup,
      parking: L.layerGroup(),
    };

    layers.forEach((layer) => {
      const group = visibilityMap[layer.id];
      if (group) {
        if (!layer.visible) m.removeLayer(group);
      }
    });

    // ── Events ─────────────────────────────────────────────────
    m.on("zoomend", () => setZoom(m.getZoom()));

    mapInstance.current = m;
    setMapLoaded(true);

    return () => {
      m.remove();
      initialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── React to Layer Visibility Changes ──────────────────────

  useEffect(() => {
    if (!mapInstance.current || !mapLoaded) return;
    const m = mapInstance.current;

    layers.forEach((layer) => {
      const group = layerGroups.current[layer.id];
      if (!group) return;
      if (layer.visible) {
        if (!m.hasLayer(group)) group.addTo(m);
      } else {
        if (m.hasLayer(group)) m.removeLayer(group);
      }
    });
  }, [layers, mapLoaded]);

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden ${className}`}
    >
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050510] z-[1000]">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <div className="w-5 h-5 border-2 border-[#050510] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-stadium-400">Loading stadium map...</p>
          </div>
        </div>
      )}

      {/* Zoom Overlay */}
      {mapLoaded && (
        <div className="absolute top-4 left-4 glass-strong rounded-xl px-3 py-2 text-xs z-[1000]">
          <span className="text-stadium-400">Zoom: </span>
          <span className="text-white font-mono">{zoom.toFixed(1)}×</span>
        </div>
      )}

      {/* Map style overrides */}
      <style jsx global>{`
        .leaflet-container {
          background: #050510;
          font-family: var(--font-sans), system-ui, sans-serif;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .leaflet-popup-tip {
          box-shadow: none;
        }
        .leaflet-control-zoom a {
          background: rgba(5, 5, 16, 0.8) !important;
          color: #c7d2fe !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
        .leaflet-control-attribution {
          background: rgba(5, 5, 16, 0.6) !important;
          color: #6366f1 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: #818cf8 !important;
        }
      `}</style>
    </div>
  );
}
