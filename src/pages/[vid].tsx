import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Container, Button } from 'react-bootstrap'
import '@/styles/pages/VehicleDetails.scss'
import { FaArrowLeftLong } from 'react-icons/fa6'
// import type { Vehicle } from '@/types/Vehicle'
import { VehicleDetails } from '@/components'
import { useNavigate, useLocation } from 'react-router-dom'

export default function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  const [vehicle, setVehicle] = useState<any>();
  const [session, setSession] = useState<any>();
  const [error, setError] = useState<any>();
  
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    getVehicle();
    getSession();
  }, []);

  async function getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) setError(error);

      setSession(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'something went wrong');
    }
  }

  if (error) console.error(error)

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  function login() {
    const from = `${location.pathname}${location.search}${location.hash}`;
    navigate('/login', { state: { from } });
  }
  
  async function getVehicle() {
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
          *,

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
    
    setVehicle(data);
  }
  
  if (!vehicle) return
  document.title = `${vehicle.name} - War Thunder Vehicle Dashboard`

  return (
    <>
      <Container className="px-0 py-4 p-md-4">
        <div className="mb-3 d-flex justify-content-between">
          <Button variant="primary" className={`border-0 rounded-1 px-3 fs-5 d-inline-flex column-gap-1 fw-semibold${isMobile ? ' rounded-start-0' : ''}`} href="/">
            <span className="d-flex align-items-center"><FaArrowLeftLong className="fs-5" /></span>
            <p className="my-auto">Back to Home</p>
          </Button>

          <Button variant="transparent" className="border-0" onClick={session.session ? logout : login}>{session.session  ? 'Logout' : 'Login'}</Button>
        </div>

        <VehicleDetails vehicle={vehicle} />
      </Container>
    </>
  )
}
