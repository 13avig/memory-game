import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import buildingsData from "../data/buildings.json";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Building {
  name: string;
  lat: number;
  lng: number;
  marker?: mapboxgl.Marker;
}

interface MapProps {
    correctBuildings: string[];
  }

export default function Map({ correctBuildings }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const buildings: Building[] = buildingsData; // Cast the imported JSON as an array of Building objects

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-122.259, 37.872],
        zoom: 15
      });

      map.current.on("style.load", () => {
        if (map.current) {
          const style = map.current.getStyle();
          if (style?.layers) {
            style.layers.forEach((layer) => {
              if (layer.type === "symbol") {
                map.current?.setLayoutProperty(layer.id, "visibility", "none");
              }
            });
          }
        }
      });

      // Add markers for buildings
      buildings.forEach((building) => {
        const marker = new mapboxgl.Marker({ color: "gray" })
          .setLngLat([building.lng, building.lat])
          .setPopup(new mapboxgl.Popup().setText(building.name))
          .addTo(map.current as mapboxgl.Map);

        building.marker = marker; // Now TypeScript recognizes 'marker' as a valid property
      });
    }
  }, []);

  useEffect(() => {
    // Highlight correct buildings
    correctBuildings.forEach((name) => {
      const foundBuilding = buildings.find((b) => b.name.toLowerCase() === name);
      if (foundBuilding?.marker) {
        foundBuilding.marker.getElement().style.backgroundColor = "green";
      }
    });
  }, [correctBuildings]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg"></div>;
}