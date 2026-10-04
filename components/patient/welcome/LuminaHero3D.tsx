"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { LuminaOrb } from "@/components/patient/ui/primitives";

const LuminaScene = dynamic(() => import("@/components/patient/welcome/LuminaScene"), { ssr: false });

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** The 3D Lumina; a soft CSS orb stands in when WebGL is unavailable or fails. */
export function LuminaHero3D({ speaking }: { speaking: boolean }) {
  const reduce = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    // WebGL support can only be probed in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(webglAvailable());
  }, []);

  const fallback = (
    <div className="flex size-full items-center justify-center">
      <LuminaOrb size={220} breathe={!reduce} />
    </div>
  );

  return (
    <div className="relative size-full" role="img" aria-label="VitaMind">
      {webgl === null ? null : webgl ? (
        <SceneBoundary fallback={fallback}>
          <LuminaScene speaking={speaking} still={Boolean(reduce)} />
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
