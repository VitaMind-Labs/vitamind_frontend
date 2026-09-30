import { api } from "./client";

/** Patient payments & subscriptions — `/api/v1/payments/*`, `/api/v1/subscriptions/*`, `/api/v1/me/subscription`. */

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED";

/** A plan exactly as the database holds it (`/subscriptions/plans`). Prices are in `currency`, never assumed. */
export type ApiPlan = {
  id: string;
  tier: "BASIC" | "PRO";
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number;
  trialDays: number;
  reportsPerMonth: number;
  hasAdvancedInsights: boolean;
  hasUnlimitedJournal: boolean;
  hasBehaviorAnalysis: boolean;
  hasPrioritySupport: boolean;
  /** English summary built from the flags above (the UI builds its own, localised). */
  features: string[];
};

export type MySubscription = {
  id: string;
  nickname: string;
  email: string;
  subscriptionPlanId: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  trialEndDate: string | null;
  subscriptionPlan: ApiPlan | null;
  /** Paid and not past its end date. */
  hasActiveSubscription: boolean;
  /** Paid, or a trial that has not ended: what the patient app actually requires. */
  hasAccess: boolean;
};

export const billingApi = {
  plans: () => api.get<ApiPlan[]>("/subscriptions/plans", undefined, { auth: false }),
  /** null when the account no longer exists. */
  mySubscription: () => api.get<MySubscription | null>("/me/subscription"),
  /** Mocked payment completion — idempotent; 409 `SUBSCRIPTION_ALREADY_ACTIVE` while a paid period is running. */
  complete: (planId: string) => api.post<unknown>("/payments/complete", { planId }),
  subscribe: (planId: string) => api.post<unknown>("/payments/subscribe", { planId }),
  checkout: (input: { planId: string; successUrl: string; cancelUrl: string }) =>
    api.post<{ url?: string; sessionId?: string }>("/payments/checkout", input),
};
