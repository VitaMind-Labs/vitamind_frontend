"use client";

import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { SparkTask } from "@/lib/api/patient-types";
import { formatDay, localDay } from "@/lib/patient/format";

/** "Today", "Tomorrow" or the date a Spark task is planned for - the one wording shared by the task list and Home. */
export function useTaskWhen() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const { today, tomorrow } = useMemo(() => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    return { today: localDay(now), tomorrow: localDay(next) };
  }, []);

  return (task: SparkTask) => {
    const day = task.scheduledDate ?? task.deadline;
    if (!day) return copy.spark.tasks.noDate;
    if (day === today) return copy.spark.tasks.today;
    if (day === tomorrow) return copy.spark.tasks.tomorrow;
    return formatDay(day, language);
  };
}
