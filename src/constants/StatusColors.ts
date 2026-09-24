import type { Status } from '@/types/Status'

const statusColors: Record<Status, string> = {
  techtree: "#2c404c",
  premium: "#856800",
  squadron: "#175e05",
  event: "#004060"
}

export function getStatusColors(vehicle: { status: Status }) {
  const color = statusColors[vehicle.status];
  return color;
}