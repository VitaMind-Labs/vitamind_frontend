"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AudioContextType = {
    isSoundEnabled: boolean;
    setIsSoundEnabled: (enabled: boolean) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);
const STORAGE_KEY = "vitamind-diagnostic-sound";

export function AudioProvider({ children }: { children: ReactNode }) {
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        if (typeof window === "undefined") return true;
        return window.localStorage.getItem(STORAGE_KEY) !== "off";
    });

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, isSoundEnabled ? "on" : "off");
    }, [isSoundEnabled]);

    return (
        <AudioContext.Provider value={{ isSoundEnabled, setIsSoundEnabled }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within AudioProvider");
    }
    return context;
}
