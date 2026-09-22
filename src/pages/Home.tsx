import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Container, Row, Col } from 'react-bootstrap'
import { VehicleCard } from '@/components'
import '@/styles/pages/Home.scss'
import type { TechTree, Countries } from '@/types/Countries'

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

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getVehicles();
  }, [])

  async function getVehicles() {
    const { data, error } = await supabase.from('vehicles').select();

    if (error) {
      console.error(error);
      return
    }

    setVehicles(data);
  }

  return (
    <>
      <Container className="p-4">
        <h1>War Thunder Vehicle Dashboard</h1>

        <Row className="">
          {vehicles.map((vehicle) => (
            <Col key={vehicle.id} xs={12} md={6} lg={3}>
              <VehicleCard vehicle={vehicle} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}
