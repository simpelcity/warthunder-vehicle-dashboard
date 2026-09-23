import { Card, Image } from 'react-bootstrap'
import { getCountryIcons } from '@/constants/CountryIcons'
import type { TechTree, Countries } from '@/types/Countries'
import { getRankStrings } from '@/constants/RankStrings'

type VehicleDetails = {
  id: number
  vehicle_id: string
  name: string
  country: TechTree
  operator: Countries
  rank: number
  br_ab: number
  br_rb: number
  br_sb: number
  type: string
  status: string
}

type Vehicle = {
  vehicle: VehicleDetails
}

export default function VehicleCard({ vehicle }: Vehicle) {
  function ensureDecimal(num: number): string {
    return Number.isInteger(num) ? `${num}.0` : num.toString();
  }

  return (
    <>
      <a className="wt-tree_item-link text-decoration-none" href={`/vehicle/${vehicle.vehicle_id}`}>
        <Card className="wt-tree_item">
          <Card.Body className="d-flex p-2">
            <Image className="wt-tree_item-icon h-100" src={`https://static.encyclopedia.warthunder.com/slots/${vehicle.vehicle_id.toLowerCase()}.png`} />

            <div className="w-100 d-flex flex-column text-end">
              <span className="name">{vehicle.name}</span>

              <div className="country d-flex align-items-center justify-content-end column-gap-1">
                <Image className="" src={getCountryIcons({ country: vehicle.country })} width={20} />
                <span>{vehicle.country}</span>
              </div>

              <div className="rank">
                <span>Rank</span>{" "}
                <span className="font-sans fw-normal">{getRankStrings(vehicle.rank)}</span>
              </div>

              <span className="br">BR {ensureDecimal(vehicle.br_rb)}</span>
            </div>
          </Card.Body>
        </Card>
      </a>
    </>
  )
}
