import type { TechTree, Countries } from '@/types/Countries'
import type { VehicleClass } from '@/src/types/VehicleClasses'
import type { VehicleType } from '@/src/types/VehicleTypes'
import type { VehicleStatus } from '@/src/types/VehicleStatuses'

export type Vehicle = {
  id: string
  name: string
  rank: number
  battle_rating_rb: number
  nations: {
    id: string
    name: string
  }[]
  status_id: string
}

export type VehicleDetails = {
  id: string
  name: string
  battle_rating_ab: number
  battle_rating_rb: number
  battle_rating_sb: number
}