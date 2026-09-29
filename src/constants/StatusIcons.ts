import type { VehicleStatus } from '@/types/Vehicle'

const statusIconFile: Record<VehicleStatus, string> = {
  techtree: "item_type_rp",
  premium: "item_type_talisman",
  squadron: "squad_leader",
  event: "event_available_marker"
}

export function getStatusIcons(status: VehicleStatus) {
  const filename = statusIconFile[status];
  if (status === "squadron") return `/src/assets/status/${filename}.avif`
  return `/src/assets/status/${filename}.svg`;
}