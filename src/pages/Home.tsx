import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Container, Row, Col } from 'react-bootstrap'
import { VehicleCard } from '@/components'
import '@/styles/pages/Home.scss'
import type { Vehicle } from '@/types/Vehicle'

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

        <Row className="row-gap-3">
          {vehicles.map((vehicle) => (
            <Col key={vehicle.id} xs={12} md={6} lg={3} className="px-2">
              <VehicleCard vehicle={vehicle} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}
