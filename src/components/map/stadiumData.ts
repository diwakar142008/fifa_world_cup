// ─── MetLife Stadium GeoJSON Data ────────────────────────────
// FIFA World Cup 2026 — East Rutherford, NJ
// Center: ~40.8135°N, 74.0745°W

export const STADIUM_CENTER: [number, number] = [-74.0745, 40.8135];

// ─── Zone Definitions ─────────────────────────────────────────

export interface ZoneInfo {
  id: string;
  name: string;
  crowdLevel: number; // 0-100
  status: "low" | "moderate" | "high" | "critical";
  capacity: number;
  current: number;
}

export const zones: ZoneInfo[] = [
  { id: "section-100", name: "Section 100 (Lower Bowl)", crowdLevel: 72, status: "high", capacity: 2800, current: 2016 },
  { id: "section-101", name: "Section 101", crowdLevel: 45, status: "moderate", capacity: 2400, current: 1080 },
  { id: "section-102", name: "Section 102", crowdLevel: 88, status: "critical", capacity: 2600, current: 2288 },
  { id: "section-200", name: "Section 200 (Club Level)", crowdLevel: 55, status: "moderate", capacity: 3200, current: 1760 },
  { id: "section-201", name: "Section 201", crowdLevel: 30, status: "low", capacity: 2800, current: 840 },
  { id: "section-202", name: "Section 202", crowdLevel: 67, status: "high", capacity: 3000, current: 2010 },
  { id: "section-300", name: "Section 300 (Upper Bowl)", crowdLevel: 41, status: "low", capacity: 3500, current: 1435 },
  { id: "section-301", name: "Section 301", crowdLevel: 25, status: "low", capacity: 3000, current: 750 },
  { id: "section-302", name: "Section 302", crowdLevel: 59, status: "moderate", capacity: 3200, current: 1888 },
  { id: "vip-lounge", name: "VIP Lounge", crowdLevel: 35, status: "low", capacity: 500, current: 175 },
  { id: "food-court-1", name: "Food Court 1", crowdLevel: 82, status: "critical", capacity: 400, current: 328 },
  { id: "food-court-2", name: "Food Court 2", crowdLevel: 45, status: "moderate", capacity: 350, current: 158 },
  { id: "food-court-3", name: "Food Court 3", crowdLevel: 91, status: "critical", capacity: 400, current: 364 },
  { id: "concourse-main", name: "Main Concourse", crowdLevel: 63, status: "high", capacity: 5000, current: 3150 },
];

// ─── Points of Interest ───────────────────────────────────────

export interface POI {
  id: string;
  name: string;
  type: "gate" | "restroom" | "food" | "medical" | "info" | "parking" | "entrance" | "escalator" | "elevator" | "store";
  coordinates: [number, number];
  description?: string;
  status?: "open" | "busy" | "closed";
}

export const pointsOfInterest: POI[] = [
  // Gates
  { id: "gate-a", name: "Gate A — Main Entrance", type: "gate", coordinates: [-74.0765, 40.8135], description: "North side • 12 turnstiles", status: "busy" },
  { id: "gate-b", name: "Gate B — East Entrance", type: "gate", coordinates: [-74.0725, 40.8145], description: "East side • 8 turnstiles", status: "open" },
  { id: "gate-c", name: "Gate C — South Entrance", type: "gate", coordinates: [-74.0765, 40.8115], description: "South side • 10 turnstiles", status: "busy" },
  { id: "gate-d", name: "Gate D — West Entrance", type: "gate", coordinates: [-74.0785, 40.8135], description: "West side • 6 turnstiles", status: "open" },

  // Restrooms
  { id: "restroom-a", name: "Restroom — Section 100", type: "restroom", coordinates: [-74.0748, 40.8138], description: "Lower Bowl • 20 stalls", status: "busy" },
  { id: "restroom-b", name: "Restroom — Section 200", type: "restroom", coordinates: [-74.0752, 40.8142], description: "Club Level • 16 stalls", status: "open" },
  { id: "restroom-c", name: "Restroom — Section 300", type: "restroom", coordinates: [-74.0768, 40.8128], description: "Upper Bowl • 24 stalls", status: "busy" },
  { id: "restroom-d", name: "Restroom — Main Concourse", type: "restroom", coordinates: [-74.0740, 40.8132], description: "Concourse • 30 stalls", status: "busy" },

  // Food Courts
  { id: "food-1", name: "Food Court 1 — North", type: "food", coordinates: [-74.0758, 40.8148], description: "Burgers, Pizza, Drinks", status: "busy" },
  { id: "food-2", name: "Food Court 2 — East", type: "food", coordinates: [-74.0730, 40.8140], description: "Tacos, Nachos, Beer", status: "open" },
  { id: "food-3", name: "Food Court 3 — South", type: "food", coordinates: [-74.0755, 40.8122], description: "Hot Dogs, Popcorn, Soda", status: "busy" },
  { id: "food-4", name: "Food Court 4 — West", type: "food", coordinates: [-74.0775, 40.8132], description: "Vegetarian, Gluten-free", status: "open" },

  // Medical
  { id: "med-1", name: "Medical Station — Main", type: "medical", coordinates: [-74.0750, 40.8135], description: "Level 1 • 4 beds • AED on site" },
  { id: "med-2", name: "Medical Station — Upper Bowl", type: "medical", coordinates: [-74.0765, 40.8130], description: "Level 3 • 2 beds" },

  // Information
  { id: "info-1", name: "Information Desk — Main", type: "info", coordinates: [-74.0745, 40.8138], description: "Multilingual staff • Maps" },
  { id: "info-2", name: "Information Desk — Upper", type: "info", coordinates: [-74.0760, 40.8125], description: "Lost & Found • Assistance" },

  // Parking
  { id: "parking-a", name: "Lot A — North", type: "parking", coordinates: [-74.0780, 40.8165], description: "1,200 spaces • 92% full", status: "busy" },
  { id: "parking-b", name: "Lot B — East", type: "parking", coordinates: [-74.0700, 40.8155], description: "800 spaces • 78% full", status: "busy" },
  { id: "parking-c", name: "Lot C — South", type: "parking", coordinates: [-74.0740, 40.8085], description: "600 spaces • 45% full", status: "open" },

  // Entrances & Escalators
  { id: "entrance-main", name: "Main Entry Plaza", type: "entrance", coordinates: [-74.0745, 40.8155], description: "North plaza • Ticket verification" },
  { id: "escalator-1", name: "Escalator — East", type: "escalator", coordinates: [-74.0730, 40.8145], description: "Level 1 → Level 2" },
  { id: "escalator-2", name: "Escalator — West", type: "escalator", coordinates: [-74.0775, 40.8135], description: "Level 1 → Level 3" },
  { id: "elevator-1", name: "Elevator — North", type: "elevator", coordinates: [-74.0750, 40.8145], description: "Accessible • All levels" },
];


// ─── GeoJSON: Stadium Sections (Simplified Polygons) ──────────

export const sectionGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "section-100", name: "Section 100", zone: "lower", crowdLevel: 72, status: "high", color: "#f59e0b" },
      geometry: { type: "Polygon", coordinates: [[[-74.0765, 40.8145], [-74.0750, 40.8148], [-74.0745, 40.8138], [-74.0760, 40.8135], [-74.0765, 40.8145]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-101", name: "Section 101", zone: "lower", crowdLevel: 45, status: "moderate", color: "#6366f1" },
      geometry: { type: "Polygon", coordinates: [[[-74.0750, 40.8148], [-74.0735, 40.8155], [-74.0730, 40.8145], [-74.0745, 40.8138], [-74.0750, 40.8148]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-102", name: "Section 102", zone: "lower", crowdLevel: 88, status: "critical", color: "#f43f5e" },
      geometry: { type: "Polygon", coordinates: [[[-74.0735, 40.8155], [-74.0715, 40.8148], [-74.0725, 40.8135], [-74.0730, 40.8145], [-74.0735, 40.8155]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-200", name: "Section 200", zone: "club", crowdLevel: 55, status: "moderate", color: "#6366f1" },
      geometry: { type: "Polygon", coordinates: [[[-74.0760, 40.8135], [-74.0745, 40.8138], [-74.0740, 40.8128], [-74.0755, 40.8125], [-74.0760, 40.8135]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-201", name: "Section 201", zone: "club", crowdLevel: 30, status: "low", color: "#10b981" },
      geometry: { type: "Polygon", coordinates: [[[-74.0745, 40.8138], [-74.0730, 40.8145], [-74.0725, 40.8135], [-74.0740, 40.8128], [-74.0745, 40.8138]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-202", name: "Section 202", zone: "club", crowdLevel: 67, status: "high", color: "#f59e0b" },
      geometry: { type: "Polygon", coordinates: [[[-74.0730, 40.8145], [-74.0725, 40.8135], [-74.0735, 40.8128], [-74.0740, 40.8128], [-74.0730, 40.8145]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-300", name: "Section 300", zone: "upper", crowdLevel: 41, status: "low", color: "#10b981" },
      geometry: { type: "Polygon", coordinates: [[[-74.0755, 40.8125], [-74.0740, 40.8128], [-74.0735, 40.8118], [-74.0750, 40.8115], [-74.0755, 40.8125]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-301", name: "Section 301", zone: "upper", crowdLevel: 25, status: "low", color: "#10b981" },
      geometry: { type: "Polygon", coordinates: [[[-74.0740, 40.8128], [-74.0735, 40.8128], [-74.0725, 40.8125], [-74.0735, 40.8118], [-74.0740, 40.8128]]] },
    },
    {
      type: "Feature",
      properties: { id: "section-302", name: "Section 302", zone: "upper", crowdLevel: 59, status: "moderate", color: "#6366f1" },
      geometry: { type: "Polygon", coordinates: [[[-74.0750, 40.8115], [-74.0735, 40.8118], [-74.0745, 40.8115], [-74.0750, 40.8115]]] },
    },
  ],
};

// ─── GeoJSON: Gate Markers ────────────────────────────────────

export const gateMarkersGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Gate A", type: "gate", status: "busy", crowdLevel: 78 }, geometry: { type: "Point", coordinates: [-74.0765, 40.8135] } },
    { type: "Feature", properties: { name: "Gate B", type: "gate", status: "open", crowdLevel: 45 }, geometry: { type: "Point", coordinates: [-74.0725, 40.8145] } },
    { type: "Feature", properties: { name: "Gate C", type: "gate", status: "busy", crowdLevel: 23 }, geometry: { type: "Point", coordinates: [-74.0765, 40.8115] } },
    { type: "Feature", properties: { name: "Gate D", type: "gate", status: "open", crowdLevel: 34 }, geometry: { type: "Point", coordinates: [-74.0785, 40.8135] } },
  ],
};

// ─── GeoJSON: Crowd Heatmap Points ────────────────────────────

export const heatmapGeoJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // Dense clusters
    { type: "Feature", properties: { intensity: 0.9 }, geometry: { type: "Point", coordinates: [-74.0760, 40.8140] } },
    { type: "Feature", properties: { intensity: 0.85 }, geometry: { type: "Point", coordinates: [-74.0755, 40.8142] } },
    { type: "Feature", properties: { intensity: 0.8 }, geometry: { type: "Point", coordinates: [-74.0762, 40.8138] } },
    { type: "Feature", properties: { intensity: 0.7 }, geometry: { type: "Point", coordinates: [-74.0758, 40.8135] } },
    { type: "Feature", properties: { intensity: 0.75 }, geometry: { type: "Point", coordinates: [-74.0750, 40.8145] } },
    // Moderate clusters
    { type: "Feature", properties: { intensity: 0.6 }, geometry: { type: "Point", coordinates: [-74.0730, 40.8145] } },
    { type: "Feature", properties: { intensity: 0.55 }, geometry: { type: "Point", coordinates: [-74.0735, 40.8140] } },
    { type: "Feature", properties: { intensity: 0.5 }, geometry: { type: "Point", coordinates: [-74.0740, 40.8135] } },
    { type: "Feature", properties: { intensity: 0.45 }, geometry: { type: "Point", coordinates: [-74.0745, 40.8130] } },
    { type: "Feature", properties: { intensity: 0.5 }, geometry: { type: "Point", coordinates: [-74.0738, 40.8125] } },
    // Sparse areas
    { type: "Feature", properties: { intensity: 0.3 }, geometry: { type: "Point", coordinates: [-74.0765, 40.8125] } },
    { type: "Feature", properties: { intensity: 0.25 }, geometry: { type: "Point", coordinates: [-74.0770, 40.8130] } },
    { type: "Feature", properties: { intensity: 0.2 }, geometry: { type: "Point", coordinates: [-74.0720, 40.8135] } },
    { type: "Feature", properties: { intensity: 0.15 }, geometry: { type: "Point", coordinates: [-74.0715, 40.8140] } },
    { type: "Feature", properties: { intensity: 0.35 }, geometry: { type: "Point", coordinates: [-74.0755, 40.8120] } },
    // Food court clusters
    { type: "Feature", properties: { intensity: 0.95 }, geometry: { type: "Point", coordinates: [-74.0758, 40.8148] } },
    { type: "Feature", properties: { intensity: 0.9 }, geometry: { type: "Point", coordinates: [-74.0755, 40.8122] } },
    { type: "Feature", properties: { intensity: 0.4 }, geometry: { type: "Point", coordinates: [-74.0730, 40.8140] } },
    // Entrance clusters
    { type: "Feature", properties: { intensity: 0.8 }, geometry: { type: "Point", coordinates: [-74.0765, 40.8135] } },
    { type: "Feature", properties: { intensity: 0.6 }, geometry: { type: "Point", coordinates: [-74.0725, 40.8145] } },
  ],
};

// ─── Layer Configuration ──────────────────────────────────────

export interface LayerConfig {
  id: string;
  label: string;
  visible: boolean;
  description: string;
}

export const mapLayers: LayerConfig[] = [
  { id: "zones", label: "Zone Crowd Levels", visible: true, description: "Color-coded section occupancy" },
  { id: "heatmap", label: "Crowd Heatmap", visible: false, description: "Real-time crowd density heat" },
  { id: "gates", label: "Gates", visible: true, description: "Entry and exit gates" },
  { id: "pois", label: "Points of Interest", visible: true, description: "Restrooms, food, medical, info" },
  { id: "parking", label: "Parking", visible: true, description: "Parking lot occupancy" },
];
