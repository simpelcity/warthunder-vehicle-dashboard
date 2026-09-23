import type { Status } from '@/types/Status'

const statusIconFile: Record<Status, string> = {
  techtree: "",
  premium: "",
  squadron: "",
  event: ""
}

export function getStatusIcons(vehicle: { status: Status }) {
  const statusString = statusIconFile[vehicle.status];
  return statusString;
}