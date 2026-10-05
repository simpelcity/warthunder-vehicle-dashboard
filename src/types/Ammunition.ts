/* TANK ROUNDS */
export type Shell = "Kinetic" | "Chemical";

export type KineticShell = "Solid-AP" | "HE-filled-AP" | "Sub-caliber-AP";
export type ChemicalShell = "High-Explosive" | "HEAT" | "Guided-Missiles";

export type SolidAP = "AP" | "APC" | "APBC" | "APCBC";
export type HEFilledAP = "APHE" | "APHEBC" | "AC" | "SAP" | "SAPCBC" | "SAPHEI" | "SAPHECBC" | "AC";
export type SubCaliberAP = "APCR" | "APDS" | "APFSDS";

export type HighExplosive = "HE" | "HE-TF" | "HE-VT" | "HE-OR" | "HE-Grenade" | "VOG" | "Rocket" | "HESH" | "Smoke" | "Shrapnel" | "AHEAD";
export type Heat = "HEAT" | "HEATFS" | "HEAT MP" | "HEAT-Grenade";
export type GuidedMissiles = "ATGM" | "ATGM-OTA" | "ATGM-VT" | "ATGM-Tandem" | "ATGM-HE";

export type ExplosiveType = "TNT" | "Pentolite" | "Smoke composition" | "Exp. D" | "Composition B" | "Comp. A" | "A-IX-1" | "A-IX-2" | "PAX-3" | "CLX663" | "LX-14" | "Octol" | "Fp.02" | "H.5" | "Fp.02 and Np.10" | "PH-Salz and H.10" | "OKFOL" | "RDX/TNT" | "Amatol" | "PETN" | "Np.10" | "Hexal" | "H.10" | "Fp.60/40" | "Fp.10 and Np.10" | "Comp.B, mod." | "DHL-1" | "HMX" | "JH-2" | "JHL-2" | "JHL-3" | "Lyddite" | "Melinite" | "Oshiyaku" | "Picric acid" | "Picric acid/TNT 34/66" | "RDX" | "RDX/PWX" | "Shimose" | "Torpex" | "Type 91";

export type ATGMGuidance = "Semi-Automatic (SACLOS)" | "Beam riding" | "IR" | "Manual (MCLOS)";

export type Armor = "armor_vsmall" | "armor_small" | "armor_middle" | "armor_big";

export type Damage = "damage_small" | "damage" | "explosion_small" | "explosion_middle" | "explosion_big";

export type KineticShellVariant = SolidAP | HEFilledAP | SubCaliberAP;
export type ChemicalShellVariant = HighExplosive | Heat | GuidedMissiles;
export type TankShellVariant = KineticShellVariant | ChemicalShellVariant;

export type BeltBulletNames = "API-T" | "HEI-T" | "APDS" | "HEFI-T" | "HVAP-T" | "APHE" | "FI-T" | "AP-T" | "HEF-T" | "HVAP" | "AP-I" | "AP" | "T";

