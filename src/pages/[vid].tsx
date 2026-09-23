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
  status: string
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
  document.title = `${vehicle.name} - War Thunder Vehicle Dashboard`

  function ensureDecimal(num: number): string {
    return Number.isInteger(num) ? `${num}.0` : num.toString();
  }

  return (
    <>
      <Container className="p-4">
        <Card className="game-unit_header border-0 position-relative overflow-hidden mb-3">
          <Card.Body className="p-0">
            <div className="game-unit_card position-relative">
              <div className="game-unit_template position-absolute w-100 h-100 start-0 top-0">
                <Image className="game-unit_template-flag position-absolute start-0 top-0 h-50 pt-2" src={`https://static.encyclopedia.warthunder.com/unit_tooltip/country_germany.png`} />

                <Image className="game-unit_template-image position-absolute start-0 bottom-0 h-100" src={`https://static.encyclopedia.warthunder.com/images/${vehicle.vehicle_id.toLowerCase()}.png`} />
              </div>

              <div className="game-unit_title position-absolute bottom-0 w-100 px-4 z-1">
                <div className="game-unit_nation d-flex align-items-end gap-2">Ground Vehicles</div>
                <div className="game-unit_name fs-1 fw-bold">{vehicle.name}</div>
              </div>
            </div>

            <div className="game-unit_card-info position-absolute d-flex flex-column row-gap-2">
              <div className="game-unit_card-info_line d-flex gap-2 w-100 mw-100">
                <div className="game-unit_card-info_item game-unit_rank bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                  <div className="game-unit_card-info_value fw-bold fs-3">{getRankStrings(vehicle.rank)}</div>
                  <div className="game-unit_card-info_title text-muted small line-height-1">Rank</div>
                </div>

                <div className="game-unit_card-info_item game-unit_br bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                  <div className="game-unit_card-info_value d-flex justify-content-around">
                    <div className="game-unit_br-item text-center">
                      <div className="mode text-muted">AB</div>

                      <div className="value fw-bold">{ensureDecimal(vehicle.br_ab)}</div>
                    </div>

                    <div className="game-unit_br-item text-center">
                      <div className="mode text-muted">RB</div>

                      <div className="value fw-bold">{ensureDecimal(vehicle.br_rb)}</div>
                    </div>

                    <div className="game-unit_br-item text-center">
                      <div className="mode text-muted">SB</div>

                      <div className="value fw-bold">{ensureDecimal(vehicle.br_sb)}</div>
                    </div>
                  </div>

                  <div className="game-unit_card-info_title text-muted small">Battle rating</div>
                </div>
              </div>

              <div className="game-unit_card-info_line d-flex gap-2 w-100 mw-100">
                <div className="game-unit_card-info_item bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                  <div className="game-unit_card-info_value d-flex align-items-center gap-1">
                    <Image src="https://wiki.warthunder.com/static/country_svg/country_germany.svg" width={20} />

                    <div className="text-truncate">{vehicle.country}</div>
                  </div>

                  <div className="game-unit_card-info_title text-muted small">Research country</div>
                </div>

                <div className="game-unit_card-info_item bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                  <div className="game-unit_card-info_value d-flex gap-1">
                    <div>
                      <svg width="24px" height="24px" viewBox="0 0 10 10" color="#ff6666">
                        <use href="/src/assets/heavy_tank.svg#icon" width="10" height="10" x="0" y="0"></use>
                      </svg>
                    </div>

                    <div className="text-truncate">{vehicle.type}</div>
                  </div>

                  <div className="game-unit_card-info_title text-muted small">Main role</div>
                </div>
              </div>

              {/* <div className="game-unit_card-info_line d-flex gap-2 w-100 mw-100">
                <div className="game-unit_card-info_item bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                  <div className="game-unit_card-info_value d-flex align-items-center gap-1">
                    <div>71,000</div>

                    <img src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_rp.svg" width="18px" alt="RP" title="Research Points" />
                  </div>

                  <div className="game-unit_card-info_title text-muted small">Research</div>
                </div>

                <div className="game-unit_card-info_item bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                  <div className="game-unit_card-info_value d-flex align-items-center gap-1">
                    <div>210,000</div>

                    <img src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_warpoints.svg" width="20px" alt="SL" title="Silver Lions" />
                  </div>

                  <div className="game-unit_card-info_title text-muted small">Purchase</div>
                </div>
              </div> */}

              {(vehicle.status || vehicle.operator) ? (
                <>
                  <div className="game-unit_card-info_line d-flex gap-2 w-100 mw-100">
                    {vehicle.status && (
                      <>
                        <div className="game-unit_card-info_item bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                          <div className="game-unit_card-info_value d-flex align-items-center gap-1">
                            <img src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_talisman.svg" height={18} />

                            <div className="text-truncate">{vehicle.status}</div>
                          </div>
                          <div className="game-unit_card-info_title text-muted small">Status</div>
                        </div>
                      </>
                    )}

                    {vehicle.operator && (
                      <>
                        <div className="game-unit_card-info_item bg-dark-subtle d-flex flex-column py-2 px-3 flex-grow-1 rounded-1">
                          <div className="game-unit_card-info_value d-flex align-items-center gap-1">
                            <img src="https://static.encyclopedia.warthunder.com/gui_skin/country_germany_modern.svg" height={18} />

                            <div className="text-truncate">{vehicle.operator}</div>
                          </div>
                          <div className="game-unit_card-info_title text-muted small">Operator</div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
