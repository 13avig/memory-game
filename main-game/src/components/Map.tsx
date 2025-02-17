import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import buildingsData from "../data/buildings.json";

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
        // style: "mapbox://styles/mapbox/streets-v12",
        style: "mapbox://styles/13avig/cm731rkb3000101rae1h74wjz",
        center: [-122.259, 37.872],
        zoom: 15,
        attributionControl: false, // Disable default attribution control
        maxBounds: [[-122.27, 37.86], [-122.25, 37.88]] // Optional: restrict map bounds
      });

      // Add attribution control to bottom right corner of the map
      const attributionControl = new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: null
      });
      map.current.addControl(attributionControl, 'bottom-right');

      map.current.on("style.load", () => {
        if (map.current) {
          // Hide all labels and symbols initially
          const style = map.current.getStyle();
          if (style?.layers) {
            // Hide all symbol and label layers
            style.layers.forEach((layer) => {
              if (layer.type === "symbol" || layer.id.includes('label')) {
                map.current?.setLayoutProperty(layer.id, "visibility", "none");
              }
            });
          }

          // Hide our custom layers too
          const customLayers = ['place-labels', 'data-driven-circles', 'data-driven-circles-labels'];
          customLayers.forEach(layer => {
            map.current?.setLayoutProperty(layer, 'visibility', 'none');
          });
        }
      });

      // Initialize markers (hidden by default)
      buildings.forEach((building) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '25px';
        el.style.height = '25px';
        el.style.backgroundImage = 'url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)';
        el.style.backgroundSize = 'cover';
        el.style.display = 'none';

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          anchor: 'bottom'
        }).setHTML(`<div style="font-family: 'Poppins'; padding: 8px;">${building.name}</div>`);

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom',
          pitchAlignment: 'map',    // Keep marker flat against the map
          rotationAlignment: 'map'  // Keep marker aligned with map rotation
        })
          .setLngLat([building.longitude, building.latitude])
          .setPopup(popup);

        if (map.current) {
          marker.addTo(map.current);
        }
        markersRef.current[building.name] = marker;
      });
    }
  }, []);

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([buildingName, marker]) => {
      const element = marker.getElement();
      if (correctBuildings.includes(buildingName)) {
        element.style.display = 'block';
        const popup = marker.getPopup();
        if (popup!.isOpen() && map.current) {
          popup!.addTo(map.current);
        }
      } else {
        element.style.display = 'none';
        marker.getPopup()!.remove();
      }
    });
  }, [correctBuildings]);

  // Update visibility for correct guesses
  useEffect(() => {
    if (!map.current) return;
    
    correctBuildings.forEach(buildingName => {
      const building = buildings.find(b => b.name === buildingName);
      if (building) {
        // Show the dot and label for this specific building
        map.current?.setFeatureState(
          {
            source: 'berkeley',
            sourceLayer: 'data-driven-circles',
            id: building.name
          },
          { visible: true }
        );
        
        map.current?.setFeatureState(
          {
            source: 'berkeley',
            sourceLayer: 'data-driven-circles-labels',
            id: building.name
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