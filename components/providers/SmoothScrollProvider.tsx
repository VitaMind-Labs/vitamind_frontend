"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Détection du mouvement réduit
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Initialisation de Lenis
    const lenis = new Lenis({
      duration: reduceMotion ? 0.5 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing plus fluide (expo)
      smoothWheel: !reduceMotion,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      lerp: reduceMotion ? 1 : 0.1, // Si mouvement réduit, on désactive quasiment le lerp
      // In-page anchors (#features…) scroll smoothly and clear the floating header.
      anchors: { offset: -96, immediate: reduceMotion },
      // Keep native scrolling inside nested scrollable regions (menus, dialogs).
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });

    lenisRef.current = lenis;

    // 3. Synchronisation avec ScrollTrigger
    // On met à jour ScrollTrigger dès que Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Utilisation UNIQUEMENT du ticker de GSAP pour la performance
    // On évite le requestAnimationFrame manuel pour laisser GSAP tout gérer
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 5. Nettoyage (Clean-up)
    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker); // TRÈS IMPORTANT
      ScrollTrigger.getAll().forEach(t => t.kill()); // Nettoie les instances GSAP
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}