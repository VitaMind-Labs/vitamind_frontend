export type PlanId = "basic" | "pro" | "parents";

export type Plan = {
    id: PlanId;
    name: string;
    priceAed: number;
    trialDays: number;
    features: readonly string[];
};

export const PLANS = [
    {
        id: "basic",
        name: "Basic",
        priceAed: 29,
        trialDays: 7,
        features: [
            "3 assessments per month",
            "Journal with text entries",
            "Session history and insights",
            "Email support",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        priceAed: 59,
        trialDays: 7,
        features: [
            "Unlimited assessments",
            "Journal with voice and text",
            "Mira voice conversations",
            "Pattern analysis and reports",
            "Priority support",
        ],
    },
    {
        id: "parents",
        name: "Parents",
        priceAed: 89,
        trialDays: 7,
        features: [
            "All Pro features",
            "Up to 4 family profiles",
            "Family overview you control",
            "Family insights dashboard",
            "Priority support",
        ],
    },
] as const satisfies readonly Plan[];

export const DEFAULT_PLAN_ID: PlanId = "basic";

export function getPlan(planId: string | null | undefined): Plan {
    return PLANS.find((plan) => plan.id === planId) ?? PLANS.find((plan) => plan.id === DEFAULT_PLAN_ID)!;
}

export function formatAed(priceAed: number): string {
    return new Intl.NumberFormat("en-AE", {
        numberingSystem: "latn",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(priceAed);
}

/** Dictionary key for a plan (`subscription.basic | pro | parents`). */
export function planCopyKey(planId: PlanId): "basic" | "pro" | "parents" {
    return planId;
}
