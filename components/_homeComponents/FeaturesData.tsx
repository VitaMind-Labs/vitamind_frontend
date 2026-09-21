import { Brain, Lightbulb, ShieldCheck, Sparkles, Activity, HeartPulse } from "lucide-react";
import { ReactNode } from "react";

export type FeatureData = {
    icon: ReactNode;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
    color: string;
};

export const FEATURES_DATA: FeatureData[] = [
    {
        icon: <Brain size={32} />,
        title: "Neural Emotional Mapping",
        description: "Deep resonance tracking through nuanced interaction patterns and biometric fusion for complete emotional awareness.",
        stat: "98%",
        statLabel: "Accuracy",
        color: "#518591"
    },
    {
        icon: <Lightbulb size={32} />,
        title: "Behavioral Insights",
        description: "Hidden pattern recognition in your daily routines that reveals what truly drives your mental wellbeing.",
        stat: "40%",
        statLabel: "Improvement",
        color: "#e3b01c"
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Preventive Care",
        description: "Proactive alerts and early intervention protocols before escalation, keeping you ahead of challenges.",
        stat: "2wk",
        statLabel: "Early Detection",
        color: "#2c3e3b"
    },
    {
        icon: <Sparkles size={32} />,
        title: "AI Therapy",
        description: "24/7 empathetic conversational intelligence tailored to your unique communication style and needs.",
        stat: "24/7",
        statLabel: "Available",
        color: "#518591"
    },
    {
        icon: <Activity size={32} />,
        title: "Mood Analytics",
        description: "Beautiful timeline visualizations with predictive trend analysis that make your journey tangible.",
        stat: "30d",
        statLabel: "Forecast",
        color: "#e3b01c"
    },
    {
        icon: <HeartPulse size={32} />,
        title: "Micro-Interventions",
        description: "Daily calibrated wellness actions based on your unique response patterns and biometric data.",
        stat: "5min",
        statLabel: "Per Session",
        color: "#2c3e3b"
    },
];
