export const BRAND = {
    name: "VitaMind",
    arabicName: "VitaMind",
    description: "A private, guided space for mental wellbeing and clearer next steps.",
} as const;

/**
 * How to reach VitaMind. Left empty on purpose: the real institutional details are provided by the company
 * and shown on /trust only when set (never invented, never a placeholder in front of a health authority).
 */
export const CONTACT: { email: string | null; phone: string | null; address: string | null } = {
    email: null,
    phone: null,
    address: null,
};
