"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Hospital } from "@/lib/types";

// We dynamically import Leaflet to avoid SSR issues
let L: typeof import("leaflet") | null = null;

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: { lat: number; lng: number } | null;
  onHospitalClick?: (hospital: Hospital) => void;
  selectedHospitalId?: string;
  className?: string;
}

export function HospitalMap({
  hospitals,
  userLocation,
  onHospitalClick,
  selectedHospitalId,
  className = "",
}: HospitalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  // Load Leaflet dynamically on client side
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((leaflet) => {
      L = leaflet.default || leaflet;

      // Fix default marker icons for webpack/next
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setReady(true);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!ready || !L || !mapContainerRef.current || mapRef.current) return;

    // Default center: Tamil Nadu center
    const defaultCenter: [number, number] = [11.1271, 78.6569];
    const defaultZoom = 7;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(defaultCenter, defaultZoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [ready]);

  // Update markers when hospitals or user location change
  const updateMarkers = useCallback(() => {
    if (!L || !mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    // User location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `<div style="
          width: 20px; height: 20px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(markersRef.current)
        .bindPopup(`<div style="text-align:center;font-weight:600;font-size:13px;">📍 Your Location</div>`);
    }

    // Hospital markers
    hospitals.forEach((h) => {
      const isSelected = h.id === selectedHospitalId;
      const color = isSelected ? "#10b981" : h.has_emergency ? "#ef4444" : "#6366f1";

      const icon = L.divIcon({
        className: "hospital-marker",
        html: `<div style="
          width: ${isSelected ? "32px" : "26px"};
          height: ${isSelected ? "32px" : "26px"};
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3)${isSelected ? ", 0 0 0 4px rgba(16,185,129,0.3)" : ""};
          display: flex; align-items: center; justify-content: center;
          font-size: ${isSelected ? "16px" : "12px"};
          transition: all 0.2s;
          cursor: pointer;
        ">${isSelected ? "🏥" : "+"}</div>`,
        iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13],
      });

      const distText = h.distance != null
        ? `<div style="color:#6b7280;font-size:11px;">📏 ${h.distance.toFixed(1)} km away</div>`
        : "";

      const popup = `
        <div style="min-width:200px;font-family:system-ui,sans-serif;">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${h.name}</div>
          <div style="color:#6b7280;font-size:11px;margin-bottom:6px;">📍 ${h.address}</div>
          ${distText}
          <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:6px;">
            ${h.specialties.slice(0, 4).map(s => `<span style="background:#f0f9ff;color:#0369a1;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:500;">${s}</span>`).join("")}
          </div>
          <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
            <span style="color:#f59e0b;font-size:12px;">⭐ ${h.rating}</span>
            ${h.has_emergency ? '<span style="color:#ef4444;font-size:10px;font-weight:600;">🚑 ER</span>' : ""}
            ${h.accreditation ? `<span style="color:#059669;font-size:10px;">${h.accreditation}</span>` : ""}
          </div>
          ${h.phone ? `<div style="margin-top:4px;font-size:11px;color:#6b7280;">📞 ${h.phone}</div>` : ""}
        </div>
      `;

      const marker = L.marker([h.lat, h.lng], { icon })
        .addTo(markersRef.current!)
        .bindPopup(popup);

      marker.on("click", () => {
        onHospitalClick?.(h);
      });
    });

    // Fit bounds
    const points: [number, number][] = hospitals.map(h => [h.lat, h.lng]);
    if (userLocation) points.push([userLocation.lat, userLocation.lng]);
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [hospitals, userLocation, selectedHospitalId, onHospitalClick]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  if (!ready) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 rounded-xl border ${className}`}>
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div
        ref={mapContainerRef}
        className={`rounded-xl border overflow-hidden ${className}`}
        style={{ minHeight: 400 }}
      />
    </>
  );
}
