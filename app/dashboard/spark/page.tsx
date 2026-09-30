"use client";

import { useEffect } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SparkChat } from "@/components/patient/spark/SparkChat";
import { LogoLoader } from "@/components/shared/LogoLoader";
import { usePatient } from "@/hooks/patient/usePatient";

/**
 * Spark is for ADHD patients. The profile's `hasSpark` comes from the backend's own record of
 * the patient's track, so this redirect only spares other patients a dead screen: the API
 * refuses them (403 SPARK_ADHD_ONLY) whether or not they ever open this URL.
 */
function SparkScreen() {
  const { profile } = usePatient();
  const router = useRouter();
  const prompt = useSearchParams().get("prompt") ?? undefined;

  useEffect(() => {
    if (!profile.hasSpark) router.replace("/dashboard");
  }, [profile.hasSpark, router]);

  return profile.hasSpark ? <SparkChat initialPrompt={prompt} /> : null;
}

export default function SparkPage() {
  return (
    <Suspense fallback={<LogoLoader className="min-h-[60dvh]" />}>
      <SparkScreen />
    </Suspense>
  );
}
