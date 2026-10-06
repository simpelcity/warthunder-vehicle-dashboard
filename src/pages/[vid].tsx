import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Container, Button } from 'react-bootstrap'
import '@/styles/pages/VehicleDetails.scss'
import { FaArrowLeftLong } from 'react-icons/fa6'
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
          id,
          vehicle_id,
          weapon_id,
          type,
          quantity,
          slot,
          ammo_quantity,
          first_order_ammo,
          reload_time_seconds,
          belt_capacity,
          fire_rate_rpm,
          features,

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

  function getDocumentTitle() {
    if (vehicle.id === "germ_leopard_2a5_yt_cup_2019") return "Leopard 2A5 (Germany)"
    if (vehicle.id === "uk_challenger_ii_yt_cup_2019") return "Challenger 2 (Great Britain)"
    if (vehicle.id === "ussr_t_80u_yt_cup_2019") return "T-80U (USSR)"
    return vehicle.name
  }
  
  if (!vehicle) return null
  document.title = `${getDocumentTitle()} - War Thunder Vehicle Dashboard`

  return (
    <>
      {/* <meta name="og:image" content={`https://wiki.warthunder.com/assets/gunit_social/${vehicle.id}.jpg`} /> */}
      <meta name="og:image" content="https://warthunder-vehicle-dashboard.vercel.app/assets/germ_leopard_2pl.jpg" />
      {/* <meta name="og:image:width" content="1200" />
      <meta name="og:image:height" content="630" />
      <meta name="twitter:image" content={`https://wiki.warthunder.com/assets/gunit_social/${vehicle.id}.jpg`} />
      <meta name="vk:image" content={`https://wiki.warthunder.com/assets/gunit_social/${vehicle.id}.jpg`} /> */}

      <Container className="px-0 py-4 p-md-4 d-flex flex-column align-items-center">
        <div className="mb-3 d-flex justify-content-between w-100">
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
