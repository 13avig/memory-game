import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import buildingsData from "../data/buildings.json";
import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Building {
  name: string;
  latitude: number;
  longitude: number;
  marker?: mapboxgl.Marker;
}

interface MapProps {
  correctBuildings: string[];
}

export default function Map({ correctBuildings }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{[key: string]: mapboxgl.Marker}>({});
  const buildings: Building[] = buildingsData.map(building => ({
    ...building,
    latitude: parseFloat(building.latitude),
    longitude: parseFloat(building.longitude)
  }));

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-122.259, 37.872],
        zoom: 15,
        attributionControl: false,
        maxBounds: [[-122.27, 37.86], [-122.25, 37.88]]
      });

      // Add attribution control to bottom right corner of the map
      const attributionControl = new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: null
      });
      map.current.addControl(attributionControl, 'bottom-right');

      map.current.on("style.load", () => {
        if (map.current) {
          const style = map.current.getStyle();
          if (style?.layers) {
            style.layers.forEach((layer) => {
              if (layer.type === "symbol" || layer.id.includes('label')) {
                map.current?.setLayoutProperty(layer.id, "visibility", "none");
              }
            });
          }
        }
      });

  buildings.forEach((building) => {
    // **CHANGED:** Create a marker element that includes a label
    const markerEl = document.createElement("div");
    markerEl.className = "marker";
    //markerEl.style.position = "relative"; // for proper label positioning
    markerEl.style.width = "25px";
    markerEl.style.height = "25px";
    markerEl.style.backgroundImage =
      "url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)";
    markerEl.style.backgroundSize = "cover";
    markerEl.style.display = "none"; // hidden by default

    // **CHANGED:** Create a label element that displays the building name
    const labelEl = document.createElement("span");
    labelEl.className = "marker-label";
    labelEl.textContent = building.name;
    labelEl.style.position = "absolute";
    labelEl.style.left = "20px"; // adjust to position the label to the right of the pin
    labelEl.style.top = "50%";
    labelEl.style.transform = "translateY(-50%)";
    //labelEl.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    labelEl.style.padding = "2px 4px";
    labelEl.style.borderRadius = "1px";
    labelEl.style.whiteSpace = "nowrap";
    labelEl.style.fontFamily = "Poppins";
    labelEl.style.fontSize = "9px";

    markerEl.appendChild(labelEl);

    const marker = new mapboxgl.Marker({
      element: markerEl,
      anchor: "bottom",
      pitchAlignment: "map",
      rotationAlignment: "map"
    }).setLngLat([building.longitude, building.latitude]);

    marker.addTo(map.current!);
    markersRef.current[building.name] = marker;
  });
}
}, []);

// **CHANGED:** Simplified effect to toggle marker visibility based on correctBuildings
useEffect(() => {
Object.entries(markersRef.current).forEach(([buildingName, marker]) => {
  const element = marker.getElement();
  element.style.display = correctBuildings.includes(buildingName)
    ? "block"
    : "none";
});
}, [correctBuildings]);

// Optional: Feature state changes (if needed for your map style)
useEffect(() => {
if (!map.current) return;

correctBuildings.forEach((buildingName) => {
  const building = buildings.find((b) => b.name === buildingName);
  if (building) {
    map.current?.setFeatureState(
      {
        source: "berkeley",
        sourceLayer: "data-driven-circles",
        id: building.name,
      },
      { visible: true }
    );

    map.current?.setFeatureState(
      {
        source: "berkeley",
        sourceLayer: "data-driven-circles-labels",
        id: building.name,
      },
      { visible: true }
    );
  }
});
}, [correctBuildings]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg relative">
      <style>
        {`
          .mapboxgl-ctrl-bottom-right {
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 5px;
          }
        `}
      </style>
    </div>
  );
}