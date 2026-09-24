import type { Nation } from '@/types/Nation'

const nationStrings: Record<Nation, string> = {
  aviation: "Aviation",
  helicopters: "Helicopters",
  ground: "Ground Vehicles",
  ships: "Bluewater Fleet",
  boats: "Coastal Fleet"
}

export function getNationStrings(vehicle: { nation: Nation }) {
  const nationString = nationStrings[vehicle.nation];
  return nationString;
}