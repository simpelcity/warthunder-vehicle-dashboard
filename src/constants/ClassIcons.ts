import type { VehicleClass } from '@/types/Vehicle'
import lightTank from '@/assets/class/light_tank.svg'
import mediumTank from '@/assets/class/medium_tank.svg'
import heavyTank from '@/assets/class/heavy_tank.svg'
import tankDestroyer from '@/assets/class/tank_destroyer.svg'
import spaa from '@/assets/class/spaa.svg'
import fighter from '@/assets/class/fighter.svg'
import assault from '@/assets/class/assault.svg'
import bomber from '@/assets/class/bomber.svg'

const classIconFile: Record<VehicleClass, string> = {
  light: lightTank,
  medium: mediumTank,
  heavy: heavyTank,
  spg: tankDestroyer,
  spaa: spaa,
  fighter: fighter,
  strike: assault,
  bomber: bomber
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
  const file = classIconFile[class_id];
  const color = classIconColor[class_id];
  return { file, color };
}