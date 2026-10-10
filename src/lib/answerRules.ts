// The actual range/format rules, kept free of any Prisma import so this
// module is safe to use from both server code (lib/validation.ts) and
// client components (the survey wizard's instant-feedback validation).
// Keeping one copy here means the two call sites can never silently drift
// apart on what "a valid age" means.
import { US_STATE_CODES } from "@/lib/usStates";

export const ANSWER_RULES: Record<string, (raw: string) => string | null> = {
  age: (raw) => {
    if (!/^\d+$/.test(raw)) return "Age must be a whole number.";
    const value = Number(raw);
    if (value < 18 || value > 120) return "Age must be between 18 and 120.";
    return null;
  },
  state: (raw) => {
    const value = raw.toUpperCase();
    if (!/^[A-Z]{2}$/.test(value)) {
      return "Use a 2-letter state abbreviation, such as CA.";
    }
    if (!US_STATE_CODES.has(value)) {
      return `"${value}" isn't a US state abbreviation.`;
    }
    return null;
  },
  householdSize: (raw) => {
    if (!/^\d+$/.test(raw)) return "Household size must be a whole number.";
    if (Number(raw) < 1) return "Household size must be at least 1.";
    return null;
  },
};
