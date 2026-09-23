import type { Status } from '@/types/Status'

const classIconFile: Record<Classes, string> = {
  light: "light_tank",
  medium: "medium_tank",
  heavy: "heavy_tank",
  spg: "tank_destroyer",
  spaa: "spaa",
  fighter: "fighter",
  strike: "assault",
  bomber: "bomber"
}

export function getClassIcons(vehicle: { class: Classes }) {
  const fileName = classIconFile[vehicle.class];
  return `/src/assets/${fileName}.svg`;
}