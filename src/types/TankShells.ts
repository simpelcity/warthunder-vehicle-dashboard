/* TANK ROUNDS */
import type { TechTree, CountriesUSA, CountriesUSSR, CountriesItaly, CountriesChina, CountriesJapan, CountriesFrance, CountriesIsrael, CountriesSweden, CountriesGermany, CountriesGreatBritain } from "@/types/Countries"

export type Shell = "Kinetic" | "Chemical";

export type KineticShell = "Solid-AP" | "HE-filled-AP" | "Sub-caliber-AP";
export type ChemicalShell = "High-Explosive" | "HEAT" | "Guided-Missiles";

export type SolidAP = "AP" | "APC" | "APBC" | "APCBC";
export type HEFilledAP = "APHE" | "APHEBC" | "AC" | "SAP" | "SAPCBC" | "SAPHEI" | "SAPHECBC" | "AC";
export type SubCaliberAP = "APCR" | "APDS" | "APFSDS";

export type HighExplosive = "HE" | "HE-TF" | "HE-VT" | "HE-OR" | "HE-Grenade" | "VOG" | "Rocket" | "HESH" | "Smoke" | "Shrapnel" | "AHEAD";
export type Heat = "HEAT" | "HEATFS" | "HEAT MP" | "HEAT-Grenade";
export type GuidedMissiles = "ATGM" | "ATGM-OTA" | "ATGM-VT" | "ATGM-Tandem" | "ATGM-HE";

export type ShellExplosiveType = "TNT" | "Pentolite" | "Smoke composition" | "Exp. D" | "Composition B" | "Comp. A" | "A-IX-1" | "A-IX-2" | "PAX-3" | "CLX663" | "LX-14" | "Octol" | "Fp.02" | "H.5" | "Fp.02 and Np.10" | "PH-Salz and H.10" | "OKFOL" | "RDX/TNT" | "Amatol" | "PETN" | "Np.10" | "Hexal" | "H.10" | "Fp.60/40" | "Fp.10 and Np.10" | "Comp.B, mod." | "DHL-1" | "HMX" | "JH-2" | "JHL-2" | "JHL-3" | "Lyddite" | "Melinite" | "Oshiyaku" | "Picric acid" | "Picric acid/TNT 34/66" | "RDX" | "RDX/PWX" | "Shimose" | "Torpex" | "Type 91";

export type Guidance = "Semi-Automatic (SACLOS)" | "Beam riding" | "IR" | "Manual (MCLOS)";

export type Armor = "armor_vsmall" | "armor_small" | "armor_middle" | "armor_big";

export type Damage = "damage_small" | "damage" | "explosion_small" | "explosion_middle" | "explosion_big";

export type Rank = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII";
export type BR = "1.0" | "1.3" | "1.7" | "2.0" | "2.3" | "2.7" | "3.0" | "3.3" | "3.7" | "4.0" | "4.3" | "4.7" | "5.0" | "5.3" | "5.7" | "6.0" | "6.3" | "6.7" | "7.0" | "7.3" | "7.7" | "8.0" | "8.3" | "8.7" | "9.0" | "9.3" | "9.7" | "10.0" | "10.3" | "10.7" | "11.0" | "11.3" | "11.7" | "12.0" | "12.3" | "12.7";

export type KineticShellVariant = SolidAP | HEFilledAP | SubCaliberAP;
export type ChemicalShellVariant = HighExplosive | Heat | GuidedMissiles;
export type TankShellVariant = KineticShellVariant | ChemicalShellVariant;

export interface BaseTankShell {
  id: string;
  designation: string;
  category: Shell;
  family: KineticShell | ChemicalShell;
  variant: TankShellVariant;
  damage?: Damage | null;
  armor?: Armor | null;
}

export interface KineticTankShell extends BaseTankShell {
  category: "Kinetic";
  family: KineticShell;
  variant: KineticShellVariant;
}

export interface SolidAPTankShell extends KineticTankShell {
  category: "Kinetic",
  family: "Solid-AP",
  variant: SolidAP;
}

export interface HEFilledAPTankShell extends KineticTankShell {
  category: "Kinetic",
  family: "HE-filled-AP",
  variant: HEFilledAP;
}

export interface SubCaliberAPTankShell extends KineticTankShell {
  category: "Kinetic",
  family: "Sub-caliber-AP",
  variant: SubCaliberAP;
}

export interface ChemicalTankShell extends BaseTankShell {
  category: "Chemical";
  family: ChemicalShell;
  variant: ChemicalShellVariant;
}

export interface HighExplosiveTankShell extends ChemicalTankShell {
  category: "Chemical";
  family: "High-Explosive";
  variant: HighExplosive;
}

export interface HEATTankShell extends ChemicalTankShell {
  category: "Chemical";
  family: "HEAT";
  variant: Heat;
}

export interface GuidedMissilesTankShell extends ChemicalTankShell {
  category: "Chemical";
  family: "Guided-Missiles";
  variant: GuidedMissiles;
}

export type KineticTankShellVariant = SolidAPTankShell | HEFilledAPTankShell | SubCaliberAPTankShell;
export type ChemicalTankShellVariant = HighExplosiveTankShell | HEATTankShell | GuidedMissilesTankShell;
export type TankShell = KineticTankShellVariant | ChemicalTankShellVariant;

export type CountriesByTechTree = {
  USA: CountriesUSA;
  Germany: CountriesGermany;
  USSR: CountriesUSSR;
  "Great Britain": CountriesGreatBritain;
  Japan: CountriesJapan;
  China: CountriesChina;
  Italy: CountriesItaly;
  France: CountriesFrance;
  Sweden: CountriesSweden;
  Israel: CountriesIsrael;
}

export type TankShellPerformance = {
  [T in TechTree]: {
    id: string;
    vehicleId: string;
    vehicleName: string;
    vehicleTechTree: T;
    vehicleOperator?: CountriesByTechTree[T];
    vehicleRank: Rank;
    vehicleBr: {
      AB?: BR;
      RB: BR;
      SB?: BR;
    }
    damage?: Damage | null;
    armor?: Armor | null;
    penetrationMm: number;
    caliberMm: number;
    projectileMassKg: number;
    muzzleVelocityMs?: number;
    fuzeDelayM?: number;
    fuzeSensitivityMm?: number;
    guidance?: Guidance;
    IRCCM?: boolean;
    launchRangeKm?: number;
    maximumSpeedMs?: number;
    missileGuidanceTimeS?: number;
    explosiveMassKg?: number;
    explosiveType?: ShellExplosiveType;
    tntEquivalentKg?: number;
    smokeRadiusM?: number;
    smokeScreeningTimeS?: number;
    smokeHoldTimeS?: number;
  }
}[TechTree]

export type TankShellDefinition = TankShell & {
  performances: TankShellPerformance[];
};
