"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SparkChat } from "@/components/patient/spark/SparkChat";
import { usePatient } from "@/hooks/patient/usePatient";

/**
 * Spark is for ADHD patients. The profile's `hasSpark` comes from the backend's own record of
 * the patient's track, so this redirect only spares other patients a dead screen: the API
 * refuses them (403 SPARK_ADHD_ONLY) whether or not they ever open this URL.
 */
export default function SparkPage() {
  const { profile } = usePatient();
  const router = useRouter();

  useEffect(() => {
    if (!profile.hasSpark) router.replace("/dashboard");
  }, [profile.hasSpark, router]);

  return profile.hasSpark ? <SparkChat /> : null;
}
