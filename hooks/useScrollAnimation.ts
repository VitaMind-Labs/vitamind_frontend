"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const registerSection = (index: number, element: HTMLDivElement | null) => {
    sectionRefs.current[index] = element;
  };

  const createParallaxLayer = (
    element: HTMLElement,
    speed: number = 0.5,
    trigger?: HTMLElement
  ) => {
    gsap.to(element, {
      y: () => -window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: trigger || element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });
  };

  const createFadeInAnimation = (
    element: HTMLElement,
    delay: number = 0,
    duration: number = 1.2
  ) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  };

  const createFloatAnimation = (
    element: HTMLElement,
    intensity: number = 0.3,
    duration: number = 3
  ) => {
    gsap.to(element, {
      y: `-=${intensity * 10}px`,
      duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  };

  const createStaggerReveal = (
    elements: HTMLElement[],
    stagger: number = 0.1,
    from: "left" | "right" | "top" | "bottom" = "bottom"
  ) => {
    const directionMap = {
      left: { x: -50 },
      right: { x: 50 },
      top: { y: -50 },
      bottom: { y: 50 },
    };

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        ...directionMap[from],
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elements[0]?.parentElement,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  };

  const createTransformAnimation = (
    element: HTMLElement,
    properties: Record<string, any>,
    scrollTriggerConfig?: any
  ) => {
    const animation = gsap.to(element, {
      ...properties,
      ease: "power3.out",
      scrollTrigger: scrollTriggerConfig
        ? {
            ...scrollTriggerConfig,
            toggleActions: "play none none reverse",
          }
        : undefined,
    });

    return animation;
  };

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return {
    registerSection,
    createParallaxLayer,
    createFadeInAnimation,
    createFloatAnimation,
    createStaggerReveal,
    createTransformAnimation,
  };
}