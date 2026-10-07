export type BeltBulletNames = "API-T" | "HEI-T" | "APDS" | "HEFI-T" | "HVAP-T" | "APHE" | "FI-T" | "AP-T" | "HEF-T" | "HVAP" | "AP-I" | "AP" | "T";

const bulletVariants: Record<BeltBulletNames, string> = {
  "APDS": "Armor-Piercing Discarding Sabot",
  "API-T": "Armor-Piercing Incendiary Tracer",
  "HEI-T": "High-Explosive Incendiary Tracer",
  "HEFI-T": "High-explosive Fragmentation Incendiary Tracer",
  "HVAP-T": "High-velocity Armor-Piercing Tracer",
  "APHE": "Armor-Piercing High-Explosive",
  "FI-T": "Fragmentation Incendiary Tracer",
  "AP-I": "Armor-Piercing Incendiary",
  "AP-T": "Armor-Piercing Tracer",
  "HEF-T": "High-Explosive fragmentation Tracer",
  "HVAP": "High-Velocity Armor-Piercing",
  "AP": "Armor-Piercing",
  "T": "Tracer"
}

export function getBulletVariantName(variant: BeltBulletNames) {
  return `${bulletVariants[variant]}`;
}