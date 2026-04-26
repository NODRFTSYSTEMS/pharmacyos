"use client";

import { useEffect, useRef } from "react";
import type { City } from "@/types/cities";

interface Props {
  cities: City[];
  selectedCityId: string | null;
  onCitySelect: (id: string) => void;
  height?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

export function ColombiaMap({ cities, selectedCityId, onCitySelect, height = "500px" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    // Inject Leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS if not already loaded
    const initMap = () => {
      if (!containerRef.current || mapRef.current) return;
      const L = window.L;

      const map = L.map(containerRef.current, {
        center: [4.5, -74.0],
        zoom: 6,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;

      cities.forEach((city) => {
        const size = city.isHeritageVillage ? 28 : 36;
        const icon = L.divIcon({
          html: `<div style="
            width:${size}px;height:${size}px;
            background:${city.markerColor};
            border:2.5px solid #fff;
            border-radius:50%;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            cursor:pointer;
            transition:transform 0.15s;
            display:flex;align-items:center;justify-content:center;
            font-size:${city.isHeritageVillage ? "10px" : "12px"};
            color:#fff;font-weight:700;font-family:system-ui;
          ">${city.name.charAt(0)}</div>`,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([city.lat, city.lng], { icon })
          .addTo(map)
          .bindTooltip(
            `<strong>${city.name}</strong><br/><span style="font-size:0.8em;color:#666">${city.department}</span>`,
            { direction: "top", offset: [0, -size / 2] }
          )
          .on("click", () => onCitySelect(city.id))
          .on("keyup", (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") onCitySelect(city.id);
          });

        marker.getElement()?.setAttribute("tabindex", "0");
        marker.getElement()?.setAttribute("aria-label", `${city.name}, ${city.department}`);
        markersRef.current.set(city.id, marker);
      });
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (!el) return;
      const inner = el.querySelector("div");
      if (!inner) return;
      inner.style.transform = id === selectedCityId ? "scale(1.3)" : "scale(1)";
      inner.style.zIndex = id === selectedCityId ? "1000" : "";
    });
  }, [selectedCityId]);

  const resetView = () => {
    mapRef.current?.setView([4.5, -74.0], 6);
  };

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", borderRadius: "16px" }} />
      <button
        onClick={resetView}
        aria-label="Reset map view to Colombia"
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "var(--ocean, #1f3a4d)",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          padding: "7px 18px",
          fontSize: "0.78rem",
          fontWeight: 600,
          fontFamily: "var(--font-body, system-ui)",
          cursor: "pointer",
          letterSpacing: "0.03em",
        }}
      >
        ↺ Reset View
      </button>
    </div>
  );
}
