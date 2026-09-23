import type { Class } from '@/types/Classes'

const classStrings: Record<Class, string> = {
  light: "Light tank",
  medium: "Medium tank",
  heavy: "Heavy tank",
  spg: "Tank destroyer",
  spaa: "SPAA",
  fighter: "Fighter",
  strike: "Strike aircraft",
  bomber: "Bomber"
}

export function getClassStrings(vehicle: { class: Class }) {
  const classString = classStrings[vehicle.class];
  return classString;
}