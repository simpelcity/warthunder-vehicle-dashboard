import type { VehicleStatus } from '@/types/Vehicle'
import itemTypeRp from '@/assets/status/item_type_rp.svg'
import itemTypeTalisman from '@/assets/status/item_type_talisman.svg'
import squadLeader from '@/assets/status/squad_leader.avif'
import eventAvailableMarker from '@/assets/status/event_available_marker.svg'

const statusIcon: Record<VehicleStatus, string> = {
  techtree: itemTypeRp,
  premium: itemTypeTalisman,
  squadron: squadLeader,
  event: eventAvailableMarker
}

export function getStatusIcons(status: VehicleStatus) {
  return statusIcon[status];
}