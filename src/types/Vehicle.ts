import type { TechTree, Countries } from '@/types/Countries'
import {  } from '@/types/TankShells'

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

export type VehicleDetails = {
  id: string
  name: string
  battle_rating_ab: BR
  battle_rating_rb: BR
  battle_rating_sb: BR
}