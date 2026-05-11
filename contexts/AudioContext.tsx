"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AudioContextType = {
    isSoundEnabled: boolean;
    setIsSoundEnabled: (enabled: boolean) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

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
