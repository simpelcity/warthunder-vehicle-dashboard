import type { VehicleClass } from '@/types/Vehicle'

const classIconFile: Record<VehicleClass, string> = {
  light: "light_tank",
  medium: "medium_tank",
  heavy: "heavy_tank",
  spg: "tank_destroyer",
  spaa: "spaa",
  fighter: "fighter",
  strike: "assault",
  bomber: "bomber"
}

const classIconColor: Record<VehicleClass, string> = {
  light: "#ffeeee",
  medium: "#ffaaaa",
  heavy: "#ff6666",
  spg: "#bde9b5",
  spaa: "#c6a0ff",
  fighter: "#ffac6f",
  strike: "#bde9b5",
  bomber: "#a3b1ff"
}

export function getClassIcons(class_id: VehicleClass) {
  const fileName = classIconFile[class_id];
  const color = classIconColor[class_id];
  return { file: `/src/assets/class/${fileName}.svg`, color };
}