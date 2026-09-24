import type { Status } from '@/types/Status'

const statusStrings: Record<Status, string> = {
  techtree: "Techtree",
  premium: "Premium",
  squadron: "Squadron",
  event: "Event"
}

export function getStatusStrings(vehicle: { status: Status }) {
  const statusString = statusStrings[vehicle.status];
  return `${statusString} vehicle`;
}