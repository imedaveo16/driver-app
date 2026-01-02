'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MissionMapProps {
  incidentLocation: { lat: number; lng: number; address: string };
  driverLocation?: { lat: number; lng: number };
  height?: string;
}

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function MissionMap({ incidentLocation, driverLocation, height = '400px' }: MissionMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const incidentMarkerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with dark mode
    const map = L.map(mapContainerRef.current, {
      center: [incidentLocation.lat, incidentLocation.lng],
      zoom: 14,
      zoomControl: false, // We'll add custom zoom controls
    });

    // Add dark mode tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // Add zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [incidentLocation.lat, incidentLocation.lng]);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Custom icon for incident location (red with shield)
    const incidentIcon = L.divIcon({
      className: 'custom-incident-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: 3px solid #fca5a5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
          animation: pulse-marker 2s infinite;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <style>
          @keyframes pulse-marker {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        </style>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Remove old incident marker
    if (incidentMarkerRef.current) {
      mapRef.current.removeLayer(incidentMarkerRef.current);
    }

    // Add new incident marker
    incidentMarkerRef.current = L.marker(
      [incidentLocation.lat, incidentLocation.lng],
      { icon: incidentIcon }
    ).addTo(mapRef.current);

    // Add popup with incident info
    incidentMarkerRef.current.bindPopup(`
      <div style="
        text-align: right;
        font-family: system-ui, -apple-system, sans-serif;
        direction: rtl;
        min-width: 200px;
      ">
        <div style="
          font-weight: bold;
          color: #ef4444;
          font-size: 14px;
          margin-bottom: 8px;
        ">
          📍 موقع الحادث
        </div>
        <div style="
          color: #374151;
          font-size: 13px;
          line-height: 1.6;
        ">
          ${incidentLocation.address}
        </div>
        <div style="
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        ">
          ${incidentLocation.lat.toFixed(6)}, ${incidentLocation.lng.toFixed(6)}
        </div>
      </div>
    `);

    // Fit map to show incident
    if (!driverLocation) {
      mapRef.current.setView([incidentLocation.lat, incidentLocation.lng], 14);
    }

  }, [incidentLocation, isMapReady]);

  useEffect(() => {
    if (!mapRef.current || !isMapReady || !driverLocation) return;

    // Custom icon for driver location (orange with truck)
    const driverIcon = L.divIcon({
      className: 'custom-driver-marker',
      html: `
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: 3px solid #fdba74;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.7);
          animation: pulse-driver 1.5s infinite;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
        <style>
          @keyframes pulse-driver {
            0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(249, 115, 22, 0.7); }
            50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(249, 115, 22, 0.9); }
          }
        </style>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
    });

    // Remove old driver marker
    if (driverMarkerRef.current) {
      mapRef.current.removeLayer(driverMarkerRef.current);
    }

    // Add new driver marker
    driverMarkerRef.current = L.marker(
      [driverLocation.lat, driverLocation.lng],
      { icon: driverIcon }
    ).addTo(mapRef.current);

    driverMarkerRef.current.bindPopup(`
      <div style="
        text-align: right;
        font-family: system-ui, -apple-system, sans-serif;
        direction: rtl;
        min-width: 180px;
      ">
        <div style="
          font-weight: bold;
          color: #f97316;
          font-size: 14px;
          margin-bottom: 6px;
        ">
          🚑 موقعك الحالي
        </div>
        <div style="
          color: #374151;
          font-size: 12px;
          line-height: 1.5;
        ">
          ${driverLocation.lat.toFixed(6)}, ${driverLocation.lng.toFixed(6)}
        </div>
      </div>
    `);

    // Remove old route line
    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
    }

    // Draw route line between driver and incident
    routeLineRef.current = L.polyline(
      [
        [driverLocation.lat, driverLocation.lng],
        [incidentLocation.lat, incidentLocation.lng],
      ],
      {
        color: '#f97316',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
      }
    ).addTo(mapRef.current);

    // Fit map to show both markers
    const bounds = L.latLngBounds([
      [driverLocation.lat, driverLocation.lng],
      [incidentLocation.lat, incidentLocation.lng],
    ]);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

  }, [driverLocation, incidentLocation, isMapReady]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-xl overflow-hidden border-2 border-orange-500/30"
      />

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 rounded-lg p-3 text-xs space-y-2 z-[1000]">
        <div className="flex items-center gap-2 text-orange-100">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-red-300" />
          <span>موقع الحادث</span>
        </div>
        <div className="flex items-center gap-2 text-orange-100">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-orange-300" />
          <span>موقعك الحالي</span>
        </div>
      </div>
    </div>
  );
}
