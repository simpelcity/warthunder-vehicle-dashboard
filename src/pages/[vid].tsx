import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Container, Card, Image } from 'react-bootstrap'
import { getCountryIcons } from '@/constants/CountryIcons'
import type { TechTree, Countries } from '@/types/Countries'
import { getRankStrings } from '@/constants/RankStrings'
import '@/styles/pages/VehicleDetails.scss'

type Vehicle = {
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
}

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();

  const [vehicle, setVehicle] = useState<Vehicle>();

  useEffect(() => {
    getVehicle();
  }, [])

  async function getVehicle() {
    const { data, error } = await supabase.from('vehicles').select().eq('vehicle_id', id);
    console.log(data);

    if (error) {
      console.error(error);
      return
    }

    setVehicle(data[0]);
  }

  if (!vehicle) return

  return (
    <>
      <Container className="p-4">
        <Card className="game-unit_header border-0 position-relative overflow-hidden mb-3">
          <Card.Body className="game-unit_card position-relative">
            <div className="game-unit_template position-absolute w-100 h-100 start-0 top-0">
              <Image className="game-unit_template-flag position-absolute start-0 top-0 h-50 pt-2" src="https://static.encyclopedia.warthunder.com/unit_tooltip/country_germany.png" />

              <Image className="game-unit_template-image position-absolute start-0 bottom-0 h-100" src="https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_vi_ausf_b_tiger_iih.png" />
            </div>

            <div className="game-unit_title position-absolute bottom-0 w-100 px-4 z-1">
              <div className="game-unit_nation d-flex align-items-end gap-2">Ground Vehicles</div>
              <div className="game-unit_name fs-3">Tiger II</div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
