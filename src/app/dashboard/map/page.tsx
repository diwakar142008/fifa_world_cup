"use client";

import { useState, useCallback, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import {
  Map,
  Layers,
  Thermometer,
  Navigation,
  Search,
  Circle,
  Users,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  pointsOfInterest,
  zones,
  mapLayers as defaultLayers,
  type POI,
  type LayerConfig,
} from "@/components/map/stadiumData";
import clsx from "clsx";

// Dynamically import the map component (client-only, no SSR)
const StadiumMap = dynamic(() => import("@/components/map/StadiumMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050510] rounded-2xl">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-[#050510] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-stadium-400">Loading stadium map...</p>
      </div>
    </div>
  ),
});

// ─── POI Type Styling ─────────────────────────────────────────

const poiStyles: Record<string, { label: string; color: string; bg: string }> =
  {
    gate: { label: "Gate", color: "text-gold-400", bg: "bg-gold-500/10" },
    restroom: {
      label: "Restroom",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    food: {
      label: "Food Court",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    medical: {
      label: "Medical",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    info: { label: "Info", color: "text-stadium-400", bg: "bg-stadium-500/10" },
    parking: {
      label: "Parking",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    entrance: { label: "Entrance", color: "text-white", bg: "bg-white/10" },
    escalator: {
      label: "Escalator",
      color: "text-stadium-300",
      bg: "bg-stadium-500/10",
    },
    elevator: {
      label: "Elevator",
      color: "text-stadium-300",
      bg: "bg-stadium-500/10",
    },
    store: { label: "Store", color: "text-amber-400", bg: "bg-amber-500/10" },
  };

// ─── Zone Status Styling ──────────────────────────────────────

const zoneStatusStyles: Record<string, { color: string; bg: string }> = {
  low: { color: "text-emerald", bg: "bg-emerald/10" },
  moderate: { color: "text-stadium-400", bg: "bg-stadium-500/10" },
  high: { color: "text-amber", bg: "bg-amber/10" },
  critical: { color: "text-rose", bg: "bg-rose/10" },
};

// ─── Page ─────────────────────────────────────────────────────

export default function StadiumMapPage() {
  const [layers, setLayers] = useState<LayerConfig[]>(defaultLayers);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLayerToggle = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l)),
    );
  }, []);

  const handleZoneClick = useCallback((zoneId: string, zoneName: string) => {
    setSelectedZone(zoneId);
    setSelectedPOI(null);
  }, []);

  const handlePOIClick = useCallback((poi: POI) => {
    setSelectedPOI(poi);
    setSelectedZone(null);
  }, []);

  // Filtered zones by search
  const filteredZones = useMemo(() => {
    if (!searchQuery) return zones;
    const q = searchQuery.toLowerCase();
    return zones.filter(
      (z) => z.name.toLowerCase().includes(q) || z.id.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Filtered POIs by search
  const filteredPOIs = useMemo(() => {
    if (!searchQuery) return pointsOfInterest;
    const q = searchQuery.toLowerCase();
    return pointsOfInterest.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const activeLayerCount = layers.filter((l) => l.visible).length;

  return (
    <>
      <DashboardHeader
        title="Interactive Stadium Map"
        subtitle="MetLife Stadium • Live view • Tap zones and markers for details"
        role="Stadium Map"
        roleGradient="from-gold-500 to-amber-600"
      />

      <div className="flex-1 flex overflow-hidden">
        {/* ─── Map Area ──────────────────────────────────────────── */}
        <div className="flex-1 relative">
          <StadiumMap
            layers={layers}
            onZoneClick={handleZoneClick}
            onPOIClick={handlePOIClick}
          />

          {/* Selected Feature Card (Overlay) */}
          {(selectedZone || selectedPOI) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
              <div className="glass-strong rounded-2xl p-4 animate-in slide-up">
                {selectedPOI ? (
                  <div className="flex items-start gap-3">
                    <div
                      className={clsx(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                        poiStyles[selectedPOI.type]?.bg || "bg-white/5",
                      )}
                    >
                      <Navigation
                        className={clsx(
                          "w-4 h-4",
                          poiStyles[selectedPOI.type]?.color || "text-white",
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">
                          {selectedPOI.name}
                        </h3>
                        <span
                          className={clsx(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded",
                            poiStyles[selectedPOI.type]?.bg || "bg-white/5",
                            poiStyles[selectedPOI.type]?.color || "text-white",
                          )}
                        >
                          {poiStyles[selectedPOI.type]?.label ||
                            selectedPOI.type}
                        </span>
                      </div>
                      {selectedPOI.description && (
                        <p className="text-xs text-stadium-400 mt-1">
                          {selectedPOI.description}
                        </p>
                      )}
                      {selectedPOI.status && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className={clsx(
                              "w-1.5 h-1.5 rounded-full",
                              selectedPOI.status === "busy"
                                ? "bg-amber"
                                : selectedPOI.status === "closed"
                                  ? "bg-rose"
                                  : "bg-emerald",
                            )}
                          />
                          <span className="text-xs text-stadium-500 capitalize">
                            {selectedPOI.status}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPOI(null);
                        setSelectedZone(null);
                      }}
                      className="p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                      aria-label="Close"
                    >
                      <span className="text-stadium-500 text-sm">✕</span>
                    </button>
                  </div>
                ) : selectedZone ? (
                  (() => {
                    const zone = zones.find((z) => z.id === selectedZone);
                    if (!zone) return null;
                    return (
                      <div className="flex items-start gap-3">
                        <div
                          className={clsx(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                            zoneStatusStyles[zone.status]?.bg || "bg-white/5",
                          )}
                        >
                          <Users
                            className={clsx(
                              "w-4 h-4",
                              zoneStatusStyles[zone.status]?.color ||
                                "text-white",
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-white">
                            {zone.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3 h-3 text-stadium-400" />
                              <span className="text-xs text-stadium-400">
                                {zone.current.toLocaleString()} /{" "}
                                {zone.capacity.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-stadium-400" />
                              <span className="text-xs text-stadium-400">
                                {zone.crowdLevel}% capacity
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={clsx(
                                "h-full rounded-full transition-all",
                                {
                                  "bg-rose": zone.status === "critical",
                                  "bg-amber": zone.status === "high",
                                  "bg-stadium-400": zone.status === "moderate",
                                  "bg-emerald": zone.status === "low",
                                },
                              )}
                              style={{ width: `${zone.crowdLevel}%` }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPOI(null);
                            setSelectedZone(null);
                          }}
                          className="p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                          aria-label="Close"
                        >
                          <span className="text-stadium-500 text-sm">✕</span>
                        </button>
                      </div>
                    );
                  })()
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* ─── Side Panel ────────────────────────────────────────── */}
        <div className="w-72 lg:w-80 xl:w-88 bg-[#050510]/90 backdrop-blur-xl border-l border-white/5 overflow-y-auto shrink-0 hidden lg:block">
          <div className="p-4 space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stadium-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search zones, gates, facilities..."
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-stadium-500 outline-none focus:border-gold-500/30 focus:bg-white/10 transition-all"
                aria-label="Search map"
              />
            </div>

            {/* Layer Controls */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-stadium-400" />
                Map Layers
                <span className="text-stadium-500 font-normal normal-case text-[10px]">
                  ({activeLayerCount}/{layers.length})
                </span>
              </h3>
              <div className="space-y-1.5">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => handleLayerToggle(layer.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left"
                  >
                    <div
                      className={clsx(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0",
                        layer.visible
                          ? "bg-gold-500 border-gold-500"
                          : "border-stadium-600 bg-transparent",
                      )}
                    >
                      {layer.visible && (
                        <svg
                          className="w-3 h-3 text-[#050510]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-stadium-200">{layer.label}</p>
                      <p className="text-[10px] text-stadium-500 truncate">
                        {layer.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-stadium-400" />
                Legend
              </h3>
              <div className="space-y-1.5">
                {[
                  { label: "Gate", color: "bg-gold-400" },
                  { label: "Restroom", color: "bg-cyan-400" },
                  { label: "Food Court", color: "bg-orange-400" },
                  { label: "Medical", color: "bg-emerald-400" },
                  { label: "Information", color: "bg-stadium-400" },
                  { label: "Parking", color: "bg-purple-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className={clsx("w-3 h-3 rounded-full", item.color)} />
                    <span className="text-xs text-stadium-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Quick View */}
            {!searchQuery && (
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-stadium-400" />
                  Zone Crowd Levels
                </h3>
                <div className="space-y-1.5">
                  {zones.slice(0, 8).map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => handleZoneClick(zone.id, zone.name)}
                      className={clsx(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-all",
                        selectedZone === zone.id && "bg-white/5",
                      )}
                    >
                      <span className="text-sm text-stadium-300 truncate">
                        {zone.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-stadium-500" />
                          <span className="text-xs text-stadium-400 font-mono">
                            {zone.crowdLevel}%
                          </span>
                        </div>
                        <div
                          className={clsx("w-2 h-2 rounded-full", {
                            "bg-rose": zone.status === "critical",
                            "bg-amber": zone.status === "high",
                            "bg-stadium-400": zone.status === "moderate",
                            "bg-emerald": zone.status === "low",
                          })}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <div>
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                  Results ({filteredZones.length + filteredPOIs.length})
                </h3>
                <div className="space-y-1">
                  {filteredPOIs.map((poi) => (
                    <button
                      key={poi.id}
                      onClick={() => handlePOIClick(poi)}
                      className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all text-left",
                        selectedPOI?.id === poi.id && "bg-white/5",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                          poiStyles[poi.type]?.bg || "bg-white/5",
                        )}
                      >
                        <Navigation
                          className={clsx(
                            "w-3.5 h-3.5",
                            poiStyles[poi.type]?.color || "text-white",
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-stadium-200 truncate">
                          {poi.name}
                        </p>
                        <p className="text-xs text-stadium-500">
                          {poiStyles[poi.type]?.label || poi.type}
                        </p>
                      </div>
                    </button>
                  ))}
                  {filteredPOIs.length === 0 && filteredZones.length === 0 && (
                    <p className="text-sm text-stadium-500 text-center py-4">
                      No results found
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            {!searchQuery && (
              <div className="glass rounded-2xl p-4">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                  Stadium Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Capacity", value: "75,000" },
                    { label: "Current", value: "62,843" },
                    { label: "Gates Open", value: "4/4" },
                    {
                      label: "POI Markers",
                      value: `${pointsOfInterest.length}`,
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-lg font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-stadium-500">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
