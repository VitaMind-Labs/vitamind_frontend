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

/** A price in the currency the API quoted it in (never assumed), digits kept Latin in Arabic too. */
export function formatMoney(amount: number, currency: string, locale = "en-US"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        numberingSystem: "latn",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/** Dictionary key (`subscription.basic | pro`) for a plan tier from the database. */
export function tierCopyKey(tier: string): "basic" | "pro" {
    return tier === "PRO" ? "pro" : "basic";
}

export type PlanFeatureCopy = {
    reportsOne: string;
    reportsMany: string;
    journal: string;
    journalUnlimited: string;
    insights: string;
    behavior: string;
    priority: string;
    trial: string;
};

/** Feature bullets built from the plan's own flags, so the list can never disagree with what it grants. */
export function planFeatureLines(
    plan: {
        reportsPerMonth: number;
        hasUnlimitedJournal: boolean;
        hasAdvancedInsights: boolean;
        hasBehaviorAnalysis: boolean;
        hasPrioritySupport: boolean;
        trialDays: number;
    },
    copy: PlanFeatureCopy,
): string[] {
    return [
        plan.reportsPerMonth === 1 ? copy.reportsOne : copy.reportsMany.replace("{n}", String(plan.reportsPerMonth)),
        plan.hasUnlimitedJournal ? copy.journalUnlimited : copy.journal,
        ...(plan.hasAdvancedInsights ? [copy.insights] : []),
        ...(plan.hasBehaviorAnalysis ? [copy.behavior] : []),
        ...(plan.hasPrioritySupport ? [copy.priority] : []),
        ...(plan.trialDays > 0 ? [copy.trial.replace("{n}", String(plan.trialDays))] : []),
    ];
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
