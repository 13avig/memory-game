import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BuildingGuess } from '../types/hardMode';

interface HardModeMapProps {
  onMapClick: (coordinates: [number, number]) => void;
  guesses: BuildingGuess[];
  showCorrectLocations: boolean;
  currentBuildingIndex: number;
}

export default function HardModeMap({ 
  onMapClick, 
  guesses, 
  showCorrectLocations,
  currentBuildingIndex 
}: HardModeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.259, 37.872],
      zoom: 15,
      maxBounds: [[-122.27, 37.86], [-122.25, 37.88]]
    });

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

    map.current.on('click', (e) => {
      onMapClick([e.lngLat.lng, e.lngLat.lat]);
    });

    return () => {
      Object.values(markers.current).forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add markers for guesses
    guesses.forEach((guess, index) => {
      // Create guess marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = index === currentBuildingIndex ? '#ff0000' : '#3388ff';
      el.style.border = '2px solid white';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(guess.guessLocation)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div>${guess.buildingName}</div>`))
        .addTo(map.current!);

      markers.current[`guess-${index}`] = marker;

      // If showing correct locations, add those markers too
      if (showCorrectLocations) {
        const correctEl = document.createElement('div');
        correctEl.className = 'marker';
        correctEl.style.width = '20px';
        correctEl.style.height = '20px';
        correctEl.style.borderRadius = '50%';
        correctEl.style.backgroundColor = '#00ff00';
        correctEl.style.border = '2px solid white';

        const correctMarker = new mapboxgl.Marker(correctEl)
          .setLngLat(guess.actualLocation)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<div>${guess.buildingName} (Correct Location)</div>`))
          .addTo(map.current!);

        markers.current[`correct-${index}`] = correctMarker;
      }
    });
  }, [guesses, showCorrectLocations, currentBuildingIndex]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
} 