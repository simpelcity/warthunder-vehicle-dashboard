import type { VehicleStatus } from '@/types/Vehicle'

const statusColors: Record<VehicleStatus, string> = {
  techtree: "#2c404c",
  premium: "#856800",
  squadron: "#175e05",
  event: "#004060"
}

export function getStatusColors(status: VehicleStatus) {
  const color = statusColors[status];
  return color;
}