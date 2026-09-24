import type { TechTree, Countries } from '@/types/Countries'
import type { Class } from '@/types/Classes'
import type { Nation } from '@/types/Nation'
import type { Status } from '@/types/Status'

export type Vehicle = {
  id: number
  vehicle_id: string
  name: string
  country: TechTree
  operator: Countries
  rank: number
  br_ab: number
  br_rb: number
  br_sb: number
  class: Class
  status: Status
  nation: Nation
}