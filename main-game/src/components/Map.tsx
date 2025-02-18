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

  const staticMarkers = [
    { lng: -122.25914, lat: 37.87129 },
    { lng: -122.26041, lat: 37.87058 },
    { lng: -122.260471, lat: 37.868761 },
  ];

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

          const customLayers = ['place-labels', 'data-driven-circles', 'data-driven-circles-labels'];
          customLayers.forEach(layer => {
            map.current?.setLayoutProperty(layer, 'visibility', 'none');
          });
        }
      });

  //     buildings.forEach((building) => {
  //       const el = document.createElement('div');
  //       el.className = 'marker';
  //       el.style.width = '25px';
  //       el.style.height = '25px';
  //       el.style.backgroundImage = 'url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)';
  //       el.style.backgroundSize = 'cover';
  //       el.style.display = 'none';

  //       const popup = new mapboxgl.Popup({
  //         offset: 25,
  //         closeButton: false,
  //         closeOnClick: false,
  //         anchor: 'bottom'
  //       }).setHTML(`<div style="font-family: 'Poppins'; padding: 8px;">${building.name}</div>`);

  //       const marker = new mapboxgl.Marker({
  //         element: el,
  //         anchor: 'bottom',
  //         pitchAlignment: 'map',
  //         rotationAlignment: 'map'
  //       })
  //         .setLngLat([building.longitude, building.latitude])
  //         .setPopup(popup);

  //       if (map.current) {
  //         marker.addTo(map.current);
  //       }
  //       markersRef.current[building.name] = marker;
  //     });
  //   }
  // }, []);

  staticMarkers.forEach(({ lng, lat }) => {
    const el = document.createElement("div");
    el.className = "static-marker";
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.backgroundImage =
      "url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)";
    el.style.backgroundSize = "cover";

    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .addTo(map.current!);
  });

  // Initialize interactive markers (hidden by default)
      buildings.forEach((building) => {
        const el = document.createElement("div");
        el.className = "marker";
        el.style.width = "25px";
        el.style.height = "25px";
        el.style.backgroundImage =
          "url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)";
        el.style.backgroundSize = "cover";
        el.style.display = "none";

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          anchor: "bottom",
        }).setHTML(
          `<div style="font-family: 'Poppins'; padding: 8px;">${building.name}</div>`
        );

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: "bottom",
        })
          .setLngLat([building.longitude, building.latitude])
          .setPopup(popup);

        marker.addTo(map.current!);
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

  useEffect(() => {
    if (!map.current) return;
    
    correctBuildings.forEach(buildingName => {
      const building = buildings.find(b => b.name === buildingName);
      if (building) {
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