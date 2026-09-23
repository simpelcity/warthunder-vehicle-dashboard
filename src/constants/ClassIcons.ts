import type { Class } from '@/types/Classes'

const classIconFile: Record<Class, string> = {
  light: "light_tank",
  medium: "medium_tank",
  heavy: "heavy_tank",
  spg: "tank_destroyer",
  spaa: "spaa",
  fighter: "fighter",
  strike: "assault",
  bomber: "bomber"
}

const classIconColor: Record<Class, string> = {
  light: "#ffeeee",
  medium: "#ffaaaa",
  heavy: "#ff6666",
  spg: "#bde9b5",
  spaa: "#c6a0ff",
  fighter: "#ffac6f",
  strike: "#bde9b5",
  bomber: "#a3b1ff"
}

export function getClassIcons(vehicle: { class: Class }) {
  const fileName = classIconFile[vehicle.class];
  const color = classIconColor[vehicle.class];
  return { file: `/src/assets/class/${fileName}.svg`, color };
}