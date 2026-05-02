import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { format } from 'date-fns';
import { Loader2, MapPin } from 'lucide-react';

// ─── Fix Vite broken default marker icon paths ────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Green start marker (origin) ──────────────────────────────────────────────
const startIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;
    background:#22c55e;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:3px solid white;
    box-shadow:0 4px 16px rgba(34,197,94,0.55);
  "></div>`,
  iconSize:    [32, 44],
  iconAnchor:  [16, 44],
  popupAnchor: [0, -48],
});

// ─── Red current location marker (destination) ────────────────────────────────
const endIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;
    background:#ef4444;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:3px solid white;
    box-shadow:0 4px 16px rgba(239,68,68,0.55);
  "></div>`,
  iconSize:    [32, 44],
  iconAnchor:  [16, 44],
  popupAnchor: [0, -48],
});

// ─── Intermediate stop markers — grey dots ────────────────────────────────────
const midIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:14px;height:14px;
    background:#64748b;
    border-radius:50%;
    border:2px solid white;
    box-shadow:0 1px 5px rgba(0,0,0,0.3);
  "></div>`,
  iconSize:    [14, 14],
  iconAnchor:  [7, 7],
  popupAnchor: [0, -10],
});

// ─── Auto-fit all markers in view ─────────────────────────────────────────────
const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

// ─── Geocoding: city name → coordinates (Nominatim, free) ────────────────────
const geocodeCache = {};
const geocodeLocation = async (locationStr) => {
  if (!locationStr) return null;
  const key = locationStr.trim().toLowerCase();
  if (geocodeCache[key]) return geocodeCache[key];
  try {
    const q   = encodeURIComponent(`${locationStr}, India`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data?.length > 0) {
      const c = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache[key] = c;
      return c;
    }
  } catch (_) {}
  return null;
};

// ─── OSRM Road Route fetcher (direct API call, no library needed) ─────────────
const fetchRoadRoute = async (waypoints) => {
  if (waypoints.length < 2) return null;
  try {
    // OSRM expects: lng,lat;lng,lat;...
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const url    = `https://router.project-osrm.org/route/v1/driving/${coords}?geometries=geojson&overview=full`;
    const res    = await fetch(url);
    const data   = await res.json();
    if (data?.routes?.[0]?.geometry?.coordinates) {
      // OSRM returns [lng,lat] — convert to [lat,lng] for Leaflet
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
  } catch (_) {}
  return null;
};

// ─── Main TrackingMap Component ───────────────────────────────────────────────
const TrackingMap = ({ events }) => {
  const [resolvedEvents, setResolvedEvents] = useState([]);
  const [routeCoords,    setRouteCoords]    = useState(null);
  const [isLoading,      setIsLoading]      = useState(false);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.eventTime) - new Date(b.eventTime)
  );

  useEffect(() => {
    if (sortedEvents.length === 0) {
      setResolvedEvents([]);
      setRouteCoords(null);
      return;
    }

    const resolve = async () => {
      setIsLoading(true);

      // Step 1: resolve coordinates for every event
      const resolved = await Promise.all(
        sortedEvents.map(async (event) => {
          if (event.latitude && event.longitude) {
            return { ...event, resolvedLat: event.latitude, resolvedLng: event.longitude };
          }
          const c = await geocodeLocation(event.location);
          return c
            ? { ...event, resolvedLat: c.lat, resolvedLng: c.lng }
            : { ...event, resolvedLat: null,   resolvedLng: null  };
        })
      );
      const valid = resolved.filter(e => e.resolvedLat && e.resolvedLng);
      setResolvedEvents(valid);

      // Step 2: fetch real road route from OSRM
      if (valid.length >= 2) {
        const waypoints = valid.map(e => [e.resolvedLat, e.resolvedLng]);
        const route     = await fetchRoadRoute(waypoints);
        setRouteCoords(route);
      }

      setIsLoading(false);
    };

    resolve();
  }, [events]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="card" style={{
        height: '420px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '16px',
        background: 'var(--bg)',
      }}>
        <Loader2 size={36} style={{ color: '#22c55e', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>
          Loading road route...
        </p>
      </div>
    );
  }

  // ── No coordinates ─────────────────────────────────────────────────────────
  if (resolvedEvents.length === 0) {
    return (
      <div className="card" style={{
        height: '420px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '12px',
        background: 'var(--bg)',
      }}>
        <MapPin size={40} style={{ color: 'var(--text-muted)' }} />
        <p style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>
          Map coordinates not available for this shipment.
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Coordinates are attached when tracking events are added by the courier.
        </p>
      </div>
    );
  }

  const allPositions = resolvedEvents.map(e => [e.resolvedLat, e.resolvedLng]);
  const center       = allPositions[allPositions.length - 1];

  return (
    <div style={{
      width: '100%', height: '420px',
      borderRadius: '16px', overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    }}>
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* ── CartoDB Voyager — English labels, colorful roads, clean ── */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Auto-fit all markers */}
        <FitBounds positions={routeCoords ?? allPositions} />

        {/* Green road route line (from OSRM), fallback to straight line */}
        {routeCoords ? (
          <>
            {/* Outer glow */}
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#86efac', weight: 8, opacity: 0.45 }}
            />
            {/* Main green route */}
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#16a34a', weight: 4, opacity: 0.95 }}
            />
          </>
        ) : (
          <Polyline
            positions={allPositions}
            pathOptions={{ color: '#16a34a', weight: 4, opacity: 0.8, dashArray: '8,6' }}
          />
        )}

        {/* ── Markers ── */}
        {resolvedEvents.map((event, index) => {
          const isFirst  = index === 0;
          const isLast   = index === resolvedEvents.length - 1;
          const icon     = isFirst ? startIcon : isLast ? endIcon : midIcon;

          return (
            <Marker
              key={index}
              position={[event.resolvedLat, event.resolvedLng]}
              icon={icon}
            >
              <Popup>
                <div style={{ minWidth: '190px', fontFamily: 'inherit', lineHeight: 1.6 }}>
                  <p style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                    {isFirst ? '🟢 Pickup Point' : isLast ? '🔴 Current Location' : `📦 Stop ${index + 1}`}
                  </p>
                  <p style={{ color: isFirst ? '#16a34a' : isLast ? '#ef4444' : '#c2410c', fontWeight: '600', marginBottom: '2px' }}>
                    {event.status}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                    📍 {event.location}
                  </p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {format(new Date(event.eventTime), 'MMM dd, yyyy • hh:mm a')}
                  </p>
                  {event.remarks && (
                    <p style={{
                      fontSize: '11px', fontStyle: 'italic', marginTop: '6px',
                      color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '6px',
                    }}>
                      "{event.remarks}"
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
