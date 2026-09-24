import { Card, Image } from 'react-bootstrap'
import { getCountryIcons } from '@/constants/CountryIcons'
import { getRankStrings } from '@/constants/RankStrings'
import type { Vehicle } from '@/types/Vehicle'
import { getStatusColors } from '@/constants/StatusColors'

type VehicleDetails = {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleDetails) {
  function ensureDecimal(num: number): string {
    return Number.isInteger(num) ? `${num}.0` : num.toString();
  }

  function getVehicleIcons(vehicleId: string | undefined) {
    if (vehicleId === "germ_leopard_2a5_yt_cup_2019") return "germ_leopard_2a5"
    if (vehicleId === "uk_challenger_ii_yt_cup_2019") return "uk_challenger_ii"
    if (vehicleId === "ussr_t_80u_yt_cup_2019") return "ussr_t_80u"
    return vehicleId
  }

  return (
    <>
      <a className="wt-tree_item-link text-decoration-none" href={`/vehicle/${vehicle.vehicle_id}`}>
        <Card className={`wt-tree_item${(vehicle.status === 'techtree' || vehicle.status === 'event') ? '' : ` wt-tree_item--${vehicle.status}`} border-0`}>
          <Card.Body className="d-flex p-2">
            <Image className="wt-tree_item-icon h-100" src={`https://static.encyclopedia.warthunder.com/slots/${getVehicleIcons(vehicle.vehicle_id.toLowerCase())}.png`} />

            <div className="w-100 d-flex flex-column text-end">
              <span className="name font-wt">{vehicle.name}</span>

              <div className="country d-flex align-items-center justify-content-end column-gap-1">
                <Image className="" src={`https://static.encyclopedia.warthunder.com/gui_skin/${getCountryIcons({ country: vehicle.country })}.svg`} width={20} />
                <span>{vehicle.country}</span>
              </div>

              <span className="rank">Rank {getRankStrings(vehicle.rank)}</span>

              <span className="br">BR {ensureDecimal(vehicle.br_rb)}</span>
            </div>
          </Card.Body>
        </Card>
      </a>
    </>
  )
}
