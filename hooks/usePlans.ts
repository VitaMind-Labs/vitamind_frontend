"use client";

import { billingApi, type ApiPlan } from "@/lib/api/billing";
import { usePatientResource } from "@/hooks/usePatientResource";

/**
 * The plan a visitor can buy, from the database. There is one: the cheapest active plan.
 * Public route, so it works before sign-in.
 */
export function usePlans() {
  const resource = usePatientResource<ApiPlan[]>("billing:plans", () => billingApi.plans(), { staleMs: 60_000 });
  return { ...resource, plan: resource.data?.[0] ?? null };
}
