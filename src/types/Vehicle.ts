import type { TechTree, Countries } from '@/types/Countries'
import type { Shell, KineticShell, ChemicalShell, TankShellVariant, Armor, Damage, ExplosiveType, ATGMGuidance } from '@/types/Ammunition'

export type VehicleClass = "light" | "medium" | "heavy" | "spg" | "spaa" | "fighter" | "strike" | "bomber";
export type VehicleStatus = "techtree" | "premium" | "squadron" | "event";
export type VehicleType = "air" | "helis" | "ground" | "ships" | "boats";

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type BR = 1.0 | 1.3 | 1.7 | 2.0 | 2.3 | 2.7 | 3.0 | 3.3 | 3.7 | 4.0 | 4.3 | 4.7 | 5.0 | 5.3 | 5.7 | 6.0 | 6.3 | 6.7 | 7.0 | 7.3 | 7.7 | 8.0 | 8.3 | 8.7 | 9.0 | 9.3 | 9.7 | 10.0 | 10.3 | 10.7 | 11.0 | 11.3 | 11.7 | 12.0 | 12.3 | 12.7 | 13.0 | 13.3 | 13.7 | 14.0 | 14.3 | 14.7;

export type Vehicle = {
  id: string
  name: string
  rank: Rank
  battle_rating_rb: BR
  nations: {
    id: string
    name: TechTree
  }
  status_id: VehicleStatus
}

export type WeaponFeatures = {
  id: string
  name: string
  description: string
}

export type VehicleAmmunition = {
  ammunition: {
    category: Shell
    damage_type: Damage
    designation: string
    family: KineticShell | ChemicalShell
    id: string
    variant: TankShellVariant
  }
  ammunition_id: string
  armor_type: Armor
  caliber_mm: number
  damage_type: Damage
  explosive_mass_kg?: number
  explosive_type?: ExplosiveType
  fuze_delay_m?: number
  fuze_sensitivity_mm?: number
  guidance?: ATGMGuidance
  id: number
  irccm: boolean
  launch_range_km?: number
  maximum_speed_ms?: number
  missile_guidance_time_s?: number
  muzze_velocity_ms: number
  penetration_mm: number
  projectile_mass_kg: number
  smoke_hold_time_s?: number
  smoke_radius_m?: number
  smoke_screening_time_s?: number
  tnt_equivalent_kg?: number
  vehicle_weapon_id: number
}

export type VehicleBelts = {}

export type WeaponAmmunition = {}

export type VehicleWeapons = {
  ammo_quantity: number
  belt_capacity?: number
  features?: WeaponFeatures[]
  fire_rate_rpm?: number
  first_order_ammo?: number
  id: number
  quantity: number
  reload_time_seconds: string
  slot: string
  type: string
  vehicle_ammunition: VehicleAmmunition[]
  vehicle_belts: VehicleBelts[]
  vehicle_id: string
  weapon: {
    caliber_mm: number
    id: string
    name: string
    weapon_ammunition: WeaponAmmunition[]
    weapon_type?: string
  }
  weapon_id: string
}

export type VehicleDetails = {
  id: string
  name: string
  vehicle_type_id: VehicleType
  vehicle_types: {
    id: VehicleType
    name: string
  }
  nation_id: string
  nations: {
    id: string
    name: TechTree
  }
  operator_id?: string
  operators?: {
    id: string
    name: Countries
  }
  rank: number
  battle_rating_ab: BR
  battle_rating_rb: BR
  battle_rating_sb: BR
  status_id: VehicleClass
  vehicle_statuses: {
    id: VehicleStatus
    name: string
  }
  class_id: VehicleClass
  vehicle_classes: {
    id: VehicleClass
    name: string
  }
  research?: number
  purchase?: number
  vehicle_weapons: VehicleWeapons[]
}