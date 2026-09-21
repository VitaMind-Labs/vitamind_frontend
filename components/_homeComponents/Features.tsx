"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Brain,
  Lightbulb,
  ShieldCheck,
  Activity,
  HeartPulse,
  ArrowUpRight,
  Zap,
  Eye,
  BarChart3
} from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  color: string;
  size: "large" | "medium" | "small";
  category: "core" | "insight" | "wellness";
};

const FEATURES_DATA: Feature[] = [
  {
    icon: <Brain size={28} />,
    title: "Neural Emotional Mapping",
    description: "Deep resonance tracking through nuanced interaction patterns and biometric fusion for complete emotional awareness.",
    stat: "98%",
    statLabel: "Accuracy",
    color: "#518591",
    size: "large",
    category: "core"
  },
  {
    icon: <Lightbulb size={28} />,
    title: "Behavioral Insights",
    description: "Hidden pattern recognition in your daily routines that reveals what truly drives your mental wellbeing.",
    stat: "40%",
    statLabel: "Improvement",
    color: "#e3b01c",
    size: "medium",
    category: "insight"
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Preventive Care",
    description: "Proactive alerts and early intervention protocols before escalation, keeping you ahead of challenges.",
    stat: "2wk",
    statLabel: "Early Detection",
    color: "#2c3e3b",
    size: "small",
    category: "wellness"
  },
  {
    icon: <Activity size={28} />,
    title: "Mood Analytics",
    description: "Beautiful timeline visualizations with predictive trend analysis that make your journey tangible.",
    stat: "30d",
    statLabel: "Forecast",
    color: "#518591",
    size: "medium",
    category: "insight"
  },
  {
    icon: <HeartPulse size={28} />,
    title: "Micro-Interventions",
    description: "Daily calibrated wellness actions based on your unique response patterns and biometric data.",
    stat: "5min",
    statLabel: "Per Session",
    color: "#e3b01c",
    size: "small",
    category: "wellness"
  },
  {
    icon: <Zap size={28} />,
    title: "Real-time Response",
    description: "Instant adaptation to emotional shifts with millisecond latency for seamless support when you need it most.",
    stat: "24/7",
    statLabel: "Available",
    color: "#518591",
    size: "medium",
    category: "core"
  },
  {
    icon: <Eye size={28} />,
    title: "Pattern Recognition",
    description: "Machine learning algorithms that identify subtle emotional signatures before they become apparent to you.",
    stat: "94%",
    statLabel: "Precision",
    color: "#2c3e3b",
    size: "small",
    category: "insight"
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Progress Forecasting",
    description: "Predictive modeling of your wellness trajectory with actionable milestones for sustainable growth.",
    stat: "89%",
    statLabel: "Accuracy",
    color: "#e3b01c",
    size: "medium",
    category: "core"
  }
];

export const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Regrouper par catégorie pour l'affichage
  const coreFeatures = FEATURES_DATA.filter(f => f.category === "core");
  const insightFeatures = FEATURES_DATA.filter(f => f.category === "insight");
  const wellnessFeatures = FEATURES_DATA.filter(f => f.category === "wellness");

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-32 md:py-40 bg-white relative overflow-hidden"
    >
      {/* En-tête de section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-6">
              <Sparkles size={16} className="text-[#e3b01c]" />
              <span className="text-sm font-medium text-gray-500">Intelligence Engine</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 tracking-tight leading-[1.1]"
          >
            Three layers of{" "}
            <span className="bg-gradient-to-r from-[#518591] via-[#2c3e3b] to-[#e3b01c] bg-clip-text text-transparent">
              intelligence
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg mt-6 max-w-2xl"
          >
            Every feature works in harmony. Core intelligence drives insights, insights trigger wellness actions.
          </motion.p>
        </div>
      </div>

      {/* Grille principale - Structure en 3 colonnes */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne 1 - Core Intelligence */}
          <div>
            <div className="sticky top-32">
              <div className="mb-6">
                <div className="w-12 h-px bg-[#518591] mb-3" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#518591]">
                  Core Engine
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  The foundation of everything
                </p>
              </div>
              <div className="space-y-4">
                {coreFeatures.map((feature, idx) => (
                  <FeatureCard
                    key={idx}
                    feature={feature}
                    isHovered={hoveredId === idx}
                    onHover={() => setHoveredId(idx)}
                    onLeave={() => setHoveredId(null)}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Colonne 2 - Insights */}
          <div>
            <div className="sticky top-32">
              <div className="mb-6">
                <div className="w-12 h-px bg-[#e3b01c] mb-3" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#e3b01c]">
                  Deep Insights
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Patterns you never saw coming
                </p>
              </div>
              <div className="space-y-4">
                {insightFeatures.map((feature, idx) => (
                  <FeatureCard
                    key={idx}
                    feature={feature}
                    isHovered={hoveredId === idx + coreFeatures.length}
                    onHover={() => setHoveredId(idx + coreFeatures.length)}
                    onLeave={() => setHoveredId(null)}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Colonne 3 - Wellness */}
          <div>
            <div className="sticky top-32">
              <div className="mb-6">
                <div className="w-12 h-px bg-[#2c3e3b] mb-3" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2c3e3b]">
                  Active Wellness
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Actions that transform
                </p>
              </div>
              <div className="space-y-4">
                {wellnessFeatures.map((feature, idx) => (
                  <FeatureCard
                    key={idx}
                    feature={feature}
                    isHovered={hoveredId === idx + coreFeatures.length + insightFeatures.length}
                    onHover={() => setHoveredId(idx + coreFeatures.length + insightFeatures.length)}
                    onLeave={() => setHoveredId(null)}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ligne de connexion décorative entre les colonnes */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent pointer-events-none hidden lg:block" />
    </section>
  );
};

// Sous-composant Carte
const FeatureCard = ({
  feature,
  isHovered,
  onHover,
  onLeave,
  index
}: {
  feature: Feature;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      className="group cursor-pointer"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
          x: isHovered ? 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative p-6 rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-900/5"
      >
        {/* Indicateur de catégorie coloré */}
        <motion.div
          className="absolute top-0 left-6 w-8 h-1 rounded-b-full"
          style={{ backgroundColor: feature.color }}
          animate={{ width: isHovered ? 24 : 16 }}
        />

        <div className="flex items-start gap-4">
          {/* Icône */}
          <motion.div
            animate={{
              rotate: isHovered ? [0, -10, 10, -5, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${feature.color}10`, color: feature.color }}
          >
            {feature.icon}
          </motion.div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h4 className="font-bold text-gray-900 text-base leading-tight">
                {feature.title}
              </h4>
              <motion.div
                animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.4 }}
                className="flex-shrink-0"
              >
                <ArrowUpRight size={14} className="text-gray-400" />
              </motion.div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-3">
              {feature.description}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold" style={{ color: feature.color }}>
                {feature.stat}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                {feature.statLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Effet de brillance au hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? `0 0 0 1px ${feature.color}20, 0 4px 20px -8px ${feature.color}40`
              : "0 0 0 0px transparent",
          }}
        />
      </motion.div>
    </motion.div>
  );
};