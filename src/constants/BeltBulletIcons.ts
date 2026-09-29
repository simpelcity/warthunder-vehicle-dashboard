// import type { BeltBulletNames } from '@/types/TankBelts'

export type BeltBulletNames = "API-T" | "HEI-T" | "APDS" | "HEFI-T" | "HVAP-T" | "APHE" | "FI-T" | "AP-T" | "HEF-T" | "HVAP" | "AP-I" | "AP" | "T";

const WT_SKIN_BASE = "https://static.encyclopedia.warthunder.com/gui_skin";

const variantIconFile: Record<BeltBulletNames, string> = {
  "APDS": "apds_belt.png",
  "API-T": "bullet_cannon_red_blue_green.png",
  "HEI-T": "bullet_cannon_blue_yellow_green.png",
  "HEFI-T": "bullet_cannon_blue_yellow_green.png",
  "HVAP-T": "bullet_cannon_black_green.png",
  "APHE": "bullet_cannon_red_blue.png",
  "FI-T": "bullet_cannon_blue_yellow_green.png",
  "AP-I": "bullet_cannon_red_blue.png",
  "AP-T": "bullet_gun_red_green.png",
  "HEF-T": "bullet_gun_yellow_green.png",
  "HVAP": "bullet_cannon_black.png",
  "AP": "bullet_gun_red.png",
  "T": "bullet_gun_green.png"
} as const satisfies Record<BeltBulletNames, string>;

export function getBulletIconPath(aam: { icon: BeltBulletNames | undefined }) {
  const fileName = aam.icon ? variantIconFile[aam.icon] : "missile_air_to_air.png";
  return `${WT_SKIN_BASE}/${fileName}`;
}