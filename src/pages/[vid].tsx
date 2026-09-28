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
  const [vehicle, setVehicle] = useState<any>();
  
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    getVehicle();
  }, [])
  
  async function getVehicle() {
    // const { data, error } = await supabase.from('vehicles').select(`
    //   *,
    //   nations (*),
    //   operators(*),
    //   vehicle_types (*),
    //   vehicle_statuses (*),
    //   vehicle_classes (*),
    //   vehicle_weapons (*)
    // `).eq('id', id);

    const { data, error } = await supabase
      .from("vehicles")
      .select(`
        *,

        nations (*),

        operators (*),

        vehicle_types (*),

        vehicle_statuses (*),

        vehicle_classes (*),

        vehicle_weapons (
          id,
          type,
          quantity,
          slot,
          ammo_quantity,
          first_order_ammo,
          reload_time_seconds,
          belt_capacity,
          fire_rate_rpm,

          weapon:weapons (
            id,
            name,
            weapon_type,
            caliber_mm,

            weapon_ammunition (
              id,
              position,
              is_default,
              max_quantity,

              ammunition:ammunition (
                id,
                designation,
                category,
                family,
                variant,
                damage_type
              )
            )
          ),

          vehicle_ammunition (
            *,

            ammunition:ammunition (
              id,
              designation,
              category,
              family,
              variant,
              damage_type
            )
          ),

          vehicle_belts (
            vehicle_id,
            belt_id,
            vehicle_weapon_id,

            belt:belts (
              id,
              name,
              belt_filling,
              max_penetration_mm,

              belt_ammunition (
                position,
                quantity,

                ammunition:ammunition (
                  id,
                  designation,
                  category,
                  family,
                  variant,
                  damage_type
                )
              )
            )
          )
        )
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error(error);
      return
    }
    console.log(data);
    
    setVehicle(data);
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

        <VehicleDetails vehicle={vehicle} />
      </Container>
    </>
  )
}
