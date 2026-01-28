import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ItineraryDay } from '../types';

// Fix Leaflet's default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
    itinerary: ItineraryDay[];
    activeDayIndex: number;
}

// Helper to center map on new coordinates
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ itinerary, activeDayIndex }) => {
    const [activeDay, setActiveDay] = useState<ItineraryDay | null>(null);
    const [coordinates, setCoordinates] = useState<Record<string, [number, number]>>({});
    const [route, setRoute] = useState<[number, number][]>([]);

    // Mock function to get coords (In real app, use Geocoding API)
    // For now, we simulate coordinates based on city/landmarks to demonstrate pins
    const getCoordinates = (location: string): [number, number] => {
        // Simple mock logic for demonstration. 
        // Ideally this would come from the AI response or a geocoding service.
        // Base coords for popular cities to ensure pins land roughly on a map.
        const cityCoords: Record<string, [number, number]> = {
            "Kyoto": [35.0116, 135.7681],
            "Tokyo": [35.6762, 139.6503],
            "Osaka": [34.6937, 135.5023],
            "Paris": [48.8566, 2.3522],
            "London": [51.5074, -0.1278],
            "Rome": [41.9028, 12.4964],
            "New York": [40.7128, -74.0060],
            "Bali": [-8.4095, 115.1889],
            "Bangkok": [13.7563, 100.5018],
            "Reykjavik": [64.1466, -21.9426]
        };

        // Find closest match or default (random offset for visual variety)
        const base = Object.keys(cityCoords).find(c => location.includes(c)) ? cityCoords[Object.keys(cityCoords).find(c => location.includes(c))!] : [0, 0];

        // Add small random offset to separate pins in same city
        return [base[0] + (Math.random() - 0.5) * 0.05, base[1] + (Math.random() - 0.5) * 0.05];
    };

    useEffect(() => {
        if (activeDayIndex >= 0 && itinerary[activeDayIndex]) {
            setActiveDay(itinerary[activeDayIndex]);
        } else {
            setActiveDay(null); // Show all? Or keep previous?
        }
    }, [activeDayIndex, itinerary]);

    // Generate markers and route when active day changes
    useEffect(() => {
        if (!activeDay) return;

        const newCoords: Record<string, [number, number]> = {};
        const newRoute: [number, number][] = [];

        // Hotel
        if (activeDay.accommodation) {
            newCoords['Hotel'] = getCoordinates(activeDay.city + " hotel");
            newRoute.push(newCoords['Hotel']);
        }

        // Activities
        activeDay.activities.forEach(act => {
            const coord = getCoordinates(activeDay.city + " " + act.activity);
            newCoords[act.activity] = coord;
            newRoute.push(coord);
        });

        setCoordinates(newCoords);
        setRoute(newRoute);

    }, [activeDay]);

    if (!activeDay) return <div className="h-full w-full bg-sand-200 flex items-center justify-center">Select a day to view map</div>;

    // Use the first point as center, or city default
    const center = route.length > 0 ? route[0] : getCoordinates(activeDay.city);

    return (
        <div className="h-full w-full rounded-[2rem] overflow-hidden shadow-inner relative z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={center} zoom={12} />

                {/* Render Markers */}
                {Object.entries(coordinates).map(([name, pos], idx) => (
                    <Marker key={idx} position={pos}>
                        <Popup>
                            <strong className="text-forest-900">{name}</strong>
                        </Popup>
                    </Marker>
                ))}

                {/* Render Route Polyline */}
                {route.length > 1 && (
                    <Polyline positions={route} color="#059669" weight={4} dashArray="10, 10" />
                )}

            </MapContainer>

            <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-xl shadow-lg z-[400] text-xs max-w-[150px]">
                <p className="font-bold text-forest-700 mb-1">🗺️ {activeDay.city}</p>
                <p className="text-charcoal-500">{activeDay.activities.length} stops</p>
            </div>
        </div>
    );
};
