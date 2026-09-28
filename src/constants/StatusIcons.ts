import type { Status } from '@/src/types/VehicleStatuses'

const statusIconFile: Record<Status, string> = {
  techtree: "item_type_rp",
  premium: "item_type_talisman",
  squadron: "squad_leader",
  event: "event_available_marker"
}

export function getStatusIcons(vehicle: { status: Status }) {
  const filename = statusIconFile[vehicle.status];
  if (vehicle.status === "squadron") return `/src/assets/status/${filename}.avif`
  return `/src/assets/status/${filename}.svg`;
}