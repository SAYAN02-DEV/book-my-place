"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MarkerData = {
    id: string;
    longitude: number;
    latitude: number;
    color?: string;
    popup?: string;
}

type MapContextType = {
    markers: MarkerData[];
    addMarker: (marker: MarkerData) => void;
    removeMarker: (id: string) => void;
    updateMarker: (id: string, updates: Partial<MarkerData>) => void;
    clearMarkers: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const addMarker = (marker: MarkerData) => {
        setMarkers(prev => [...prev, marker]);
    };

    const removeMarker = (id: string) => {
        setMarkers(prev => prev.filter(m => m.id !== id));
    };

    const updateMarker = (id: string, updates: Partial<MarkerData>) => {
        setMarkers(prev => prev.map(m => 
            m.id === id ? { ...m, ...updates } : m
        ));
    };

    const clearMarkers = () => {
        setMarkers([]);
    };

    return (
        <MapContext.Provider value={{ markers, addMarker, removeMarker, updateMarker, clearMarkers }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMap must be used within MapProvider');
    }
    return context;
};
