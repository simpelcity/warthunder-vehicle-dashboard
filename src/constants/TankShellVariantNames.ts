import type { TankShellVariant, Guidance } from "@/src/types/Ammunition";

export const tankShellVariantNames = {
  AP: "Armor-Piercing",
  APC: "Armor-Piercing Capped",
  APBC: "Armor-Piercing Ballistic Capped",
  APCBC: "Armor-Piercing Capped Ballistic Capped",
  APHE: "Armor-Piercing High-Explosive",
  APHEBC: "Armor-Piercing High-Explosive Ballistic Capped",
  AC: "Anti-Concrete",
  SAP: "Semi Armor-Piercing",
  SAPCBC: "Semi Armor-Piercing Capped Ballistic Capped",
  SAPHEI: "Semi Armor-Piercing High-Explosive Incendiary",
  SAPHECBC: "Semi Armor-Piercing High-Explosive Capped Ballistic Capped",
  APCR: "Armor-Piercing Composite Rigid",
  APDS: "Armor-Piercing Discarding Sabot",
  APFSDS: "Armor-Piercing Fin-Stabilised Discarding Sabot",
  HE: "High-Explosive",
  "HE-TF": "High-Explosive with Time Fuze",
  "HE-VT": "High-Explosive Variable Time Fuze",
  "HE-OR": "High-Explosive Obstacle Reduction",
  "HE-Grenade": "High-Explosive fragmentation Grenade",
  VOG: "Anti-Personnel Fragmentation Grenade",
  Rocket: "Rocket",
  HESH: "High-Explosive Squash Head",
  Smoke: "Smoke",
  Shrapnel: "Shrapnel",
  AHEAD: "Shrapnel shell with time fuze",
  HEAT: "High-Explosive Anti-Tank",
  HEATFS: "High-Explosive Anti-Tank Fin-Stabilised",
  "HEAT MP": "High-Explosive Anti-Tank, Multi-Purpose",
  "HEAT-Grenade": "High-Explosive Anti-Tank Grenade",
  ATGM: "Anti-Tank Guided Missile",
  "ATGM-OTA": "Anti-Tank Guided Missile (Overfly Top Attack)",
  "ATGM-VT": "Anti-Tank Guided Missile (Variable Time Fuze)",
  "ATGM-Tandem": "Anti-Tank Guided Missile (Tandem-charge)",
  "ATGM-HE": "Anti-Tank Guided Missile (High-Explosive)",
} as const satisfies Record<TankShellVariant, string>;

export function getTankShellVariantName(variant: TankShellVariant) {
  if (variant === 'APFSDS') return `${tankShellVariantNames[variant]} shot`
  else if (variant.toLowerCase().includes('grenade')) return tankShellVariantNames[variant]
  else if (variant === "HE") return `${tankShellVariantNames[variant]} fragmentation shell`
  else if (variant.toLowerCase().includes("atgm")) return tankShellVariantNames[variant]
  else if (variant === "HE-TF") return `${tankShellVariantNames[variant]}`
  else return `${tankShellVariantNames[variant]} shell`
}

export const shellGuidanceNames: Record<Guidance, string> = {
  "Semi-Automatic (SACLOS)": "Semi-Automatic-Command-to-Line-Of-Sight",
  "Manual (MCLOS)": "Manual-Command-to-Line-Of-Sight",
  "Beam riding": "Beam riding",
  "IR": "Infrared"
}

export function getShellGuidanceName(guidance: Guidance) {
  return `${shellGuidanceNames[guidance]}`
}