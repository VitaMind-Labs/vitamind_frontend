"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

type ScrollTriggerConfig = {
  start?: string;
  end?: string;
  scrub?: number | boolean;
  toggleActions?: string;
  [key: string]: unknown;
};

type AnimationConfig = {
  duration?: number;
  stagger?: number;
  ease?: string;
  scrollTrigger?: ScrollTriggerConfig;
  [key: string]: unknown;
};

export function usePerformanceOptimization() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkReducedMotion = () => {
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    const measureFps = () => {
      let lastTime = performance.now();
      let frames = 0;
      let fps = 60;

      const tick = () => {
        const currentTime = performance.now();
        frames++;

        if (currentTime > lastTime + 1000) {
          fps = Math.round((frames * 1000) / (currentTime - lastTime));
          setFps(fps);
          frames = 0;
          lastTime = currentTime;
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    checkMobile();
    checkReducedMotion();
    measureFps();

    window.addEventListener("resize", checkMobile);
    window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .addEventListener("change", checkReducedMotion);

    gsap.ticker.lagSmoothing(0);
    gsap.ticker.fps(60);

    if (isMobile || reducedMotion || fps < 50) {
      gsap.globalTimeline.timeScale(1.5);
      gsap.defaults({
        duration: 0.8,
        ease: "power2.out",
      });
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .removeEventListener("change", checkReducedMotion);
    };
  }, [isMobile, reducedMotion, fps]);

  const optimizeAnimation = (animationConfig: AnimationConfig): AnimationConfig => {
    const optimized = { ...animationConfig };

    if (isMobile) {
      optimized.duration = (optimized.duration || 1) * 0.7;
      optimized.stagger = (optimized.stagger || 0.1) * 1.5;
      
      if (optimized.scrollTrigger) {
        optimized.scrollTrigger.start = "top 90%";
        optimized.scrollTrigger.end = "top 70%";
        optimized.scrollTrigger.scrub = optimized.scrollTrigger.scrub ? 1.2 : false;
      }
    }

    if (reducedMotion) {
      optimized.duration = 0.3;
      optimized.ease = "none";
      
      if (optimized.scrollTrigger) {
        optimized.scrollTrigger.toggleActions = "play none none none";
      }
    }

    if (fps < 50) {
      optimized.duration = (optimized.duration || 1) * 0.8;
      
      if (optimized.scrollTrigger && optimized.scrollTrigger.scrub) {
        optimized.scrollTrigger.scrub = 0.5;
      }
    }

    return optimized;
  };

  const createOptimizedScrollTrigger = (config: ScrollTriggerConfig): ScrollTriggerConfig => {
    const optimizedConfig = { ...config };

    if (isMobile) {
      optimizedConfig.start = optimizedConfig.start || "top 90%";
      optimizedConfig.end = optimizedConfig.end || "top 60%";
      optimizedConfig.scrub = optimizedConfig.scrub ? 1 : false;
      optimizedConfig.markers = false;
    }

    if (reducedMotion) {
      optimizedConfig.scrub = false;
      optimizedConfig.toggleActions = "play none none none";
    }

    if (fps < 50) {
      optimizedConfig.scrub = optimizedConfig.scrub ? 0.5 : false;
    }

    return optimizedConfig;
  };

  const shouldAnimate = () => {
    if (reducedMotion) return false;
    if (isMobile && fps < 30) return false;
    return true;
  };

  const getAnimationScale = () => {
    let scale = 1;
    if (isMobile) scale *= 0.8;
    if (reducedMotion) scale *= 0.3;
    if (fps < 50) scale *= 0.7;
    return scale;
  };

  return {
    isMobile,
    reducedMotion,
    fps,
    optimizeAnimation,
    createOptimizedScrollTrigger,
    shouldAnimate,
    getAnimationScale,
  };
}