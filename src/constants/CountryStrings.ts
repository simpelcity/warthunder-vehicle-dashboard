import type { TechTree, Countries } from '@/types/Countries'

export function getCountryStrings(vehicle: { country: TechTree, operator?: Countries }) {
  if (vehicle.operator === "Canada (modern)") return "Canada"
  if (vehicle.operator === "Hungary (old)") return "Hungary"
  if (vehicle.operator === "South Africa (modern)") return "South Africa"
  else return vehicle.operator
}