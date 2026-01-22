"use client"
import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from '@/contexts/MapContext';

type MapProps = { 
    latitude: number;
    longitude: number;
}

const Map = ({ latitude, longitude }: MapProps) => {
    const { markers } = useMap();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const markersRef = useRef<globalThis.Map<string, mapboxgl.Marker>>(new globalThis.Map());
    const acessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    
    // Initialize map only once
    useEffect(() => {
        if (!mapContainerRef.current) return;
        
        mapboxgl.accessToken = acessToken;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [longitude, latitude],
            zoom: 15
        });

        markerRef.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);

        return () =>{
            markerRef.current?.remove();
            markersRef.current.forEach(marker => marker.remove());
            mapRef.current?.remove();
        }
    }, []);

    // Update center marker when latitude/longitude changes
    useEffect(() => {
        if (mapRef.current && markerRef.current) {
            mapRef.current.setCenter([longitude, latitude]);
            markerRef.current.setLngLat([longitude, latitude]);
        }
    }, [latitude, longitude]);

    // Update additional markers without re-rendering map
    useEffect(() => {
        if (!mapRef.current) return;

        // Remove markers that are no longer in the array
        const currentMarkerIds = new Set(markers.map(m => m.id));
        markersRef.current.forEach((marker, id) => {
            if (!currentMarkerIds.has(id)) {
                marker.remove();
                markersRef.current.delete(id);
            }
        });

        // Add or update markers
        markers.forEach(markerData => {
            const existingMarker = markersRef.current.get(markerData.id);
            
            if (existingMarker) {
                // Update existing marker position
                existingMarker.setLngLat([markerData.longitude, markerData.latitude]);
            } else {
                // Create new marker
                const marker = new mapboxgl.Marker({ color: markerData.color || '#3FB1CE' })
                    .setLngLat([markerData.longitude, markerData.latitude]);
                
                if (markerData.popup) {
                    marker.setPopup(new mapboxgl.Popup().setHTML(markerData.popup));
                }
                
                marker.addTo(mapRef.current!);
                markersRef.current.set(markerData.id, marker);
            }
        });
    }, [markers]);

  return (
    <div id='map-container' ref = {mapContainerRef} className='absolute top-0 left-0 h-screen w-full'></div>
  )
}

export default Map;
