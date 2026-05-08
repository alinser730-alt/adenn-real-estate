
"use client";

import { useMemo, useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";
import { properties } from "../lib/properties";

export default function MapSearch() {
  const [center, setCenter] = useState([45.0187, 12.7865]);
  const [radius, setRadius] = useState(3);

  const circle = useMemo(() => {
    return turf.circle(center, radius, { steps: 64, units: "kilometers" });
  }, [center, radius]);

  const filtered = useMemo(() => {
    return properties.filter((p) =>
      turf.booleanPointInPolygon(
        turf.point([p.lng, p.lat]),
        circle
      )
    );
  }, [circle]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "70%" }}>
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: center[0],
            latitude: center[1],
            zoom: 12
          }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onClick={(e) => setCenter([e.lngLat.lng, e.lngLat.lat])}
        >
          <Source id="circle" type="geojson" data={circle}>
            <Layer
              id="fill"
              type="fill"
              paint={{ "fill-color": "#3b82f6", "fill-opacity": 0.2 }}
            />
          </Source>

          {filtered.map((p) => (
            <Marker key={p.id} longitude={p.lng} latitude={p.lat}>
              <div style={{ background: "black", color: "white", padding: 5 }}>
                {p.price}$
              </div>
            </Marker>
          ))}
        </Map>
      </div>

      <div style={{ width: "30%", padding: 10 }}>
        <h3>العقارات</h3>
        <input
          type="range"
          min="1"
          max="20"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        {filtered.map((p) => (
          <div key={p.id}>
            {p.title} - {p.price}$
          </div>
        ))}
      </div>
    </div>
  );
}
