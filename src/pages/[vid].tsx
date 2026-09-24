import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Container, Button } from 'react-bootstrap'
import '@/styles/pages/VehicleDetails.scss'
import { FaArrowLeftLong } from 'react-icons/fa6'
import type { Vehicle } from '@/types/Vehicle'
import { VehicleDetails } from '@/components'

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [isMobile, setIsMobile] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle>();
  
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

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
  document.title = `${vehicle.name} - War Thunder Vehicle Dashboard`

  return (
    <>
      <Container className="px-0 py-4 p-md-4">
        <Button variant="primary" className={`border-0 rounded-1 px-3 fs-5 d-inline-flex column-gap-1 mb-3 fw-semibold${isMobile ? ' rounded-start-0' : ''}`} href="/">
          <span className="d-flex align-items-center"><FaArrowLeftLong className="fs-5" /></span>
          <p className="my-auto">Back to Home</p>
        </Button>

        <div id="general">
          <VehicleDetails vehicle={vehicle} />
        </div>
      </Container>
    </>
  )
}
