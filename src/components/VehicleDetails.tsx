import { Card, Image, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { getCountryIcons } from '@/constants/CountryIcons'
import { getRankStrings } from '@/constants/RankStrings'
import { getClassIcons } from '@/constants/ClassIcons'
import { getClassStrings } from '@/constants/ClassStrings'
import { FaRegHeart, FaHeart, FaScaleBalanced } from 'react-icons/fa6'
import { getNationStrings } from '@/constants/NationStrings'
import { getStatusStrings } from '@/constants/StatusStrings'
import { getStatusIcons } from '@/constants/StatusIcons'
import { BsQuestion } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { TbDeviceDesktopShare } from "react-icons/tb";
import type { Vehicle } from '@/types/Vehicle'

type VehicleDetails = {
  vehicle: Vehicle
}

export default function VehicleDetails({ vehicle }: VehicleDetails) {
  function ensureDecimal(num: number): string {
    return Number.isInteger(num) ? `${num}.0` : num.toString();
  }

  const ToolTip = ({ children, title }: any) => (
    <OverlayTrigger overlay={<Tooltip>{title}</Tooltip>}>{children}</OverlayTrigger>
  );

  return (
    <>
      <Card className="game-unit_header overflow-hidden border-0 position-relative mb-3 text-light">
        <div className="game-unit_card position-relative">
          <div className="game-unit_template position-absolute w-100 h-100 start-0 top-0">
            <Image className="game-unit_template-flag position-absolute start-0 h-50" src={`https://static.encyclopedia.warthunder.com/unit_tooltip/${getCountryIcons({ country: vehicle.country, operator: vehicle.operator })}.png`} />

            <Image className="game-unit_template-image position-absolute start-0 bottom-0 h-100" src={`https://static.encyclopedia.warthunder.com/images/${vehicle.vehicle_id.toLowerCase()}.png`} />
          </div>

          <div className="game-unit_title position-absolute bottom-0 w-100 z-1">
            <div className="game-unit_nation d-flex align-items-end gap-2 fs-6 overflow-hidden">{getNationStrings({ nation: vehicle.nation })}</div>

            <div className="game-unit_name fs-1 fw-bold overflow-hidden font-wt">{vehicle.name}</div>
          </div>
        </div>

        <div className="game-unit_card-info position-absolute d-flex flex-column">
          <div className="game-unit_card-info_line d-flex w-100 mw-100">
            <div className="game-unit_card-info_item game-unit_rank flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
              <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-4 fw-bold">{getRankStrings(vehicle.rank)}</div>
              <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Rank</div>
            </div>

            <div className="game-unit_card-info_item game-unit_br flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
              <div className="game-unit_card-info_value d-grid align-items-center flex-grow-1 fs-15 gap-1">
                <div className="game-unit_br-item flex-grow-1 text-center position-relative">
                  <div className="mode text-gray fs-11">AB</div>

                  <div className="value fw-bold fs-17">{ensureDecimal(vehicle.br_ab)}</div>
                </div>

                <div className="game-unit_br-item flex-grow-1 text-center position-relative">
                  <div className="mode text-gray fs-11">RB</div>

                  <div className="value fw-bold fs-17">{ensureDecimal(vehicle.br_rb)}</div>
                </div>

                <div className="game-unit_br-item flex-grow-1 text-center position-relative">
                  <div className="mode text-gray fs-11">SB</div>

                  <div className="value fw-bold fs-17">{ensureDecimal(vehicle.br_sb)}</div>
                </div>
              </div>

              <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Battle rating</div>
            </div>
          </div>

          <div className="game-unit_card-info_line d-flex w-100 mw-100">
            <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
              <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                <Image src={`https://static.encyclopedia.warthunder.com/gui_skin/${getCountryIcons({ country: vehicle.country })}.svg`} width={20} height={18} />

                <div className="text-truncate">{vehicle.country}</div>
              </div>

              <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Research country</div>
            </div>

            <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
              <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                <svg width="20px" height="20px" viewBox="0 0 10 10" color={getClassIcons({ class: vehicle.class }).color}>
                  <use href={getClassIcons({ class: vehicle.class }).file} width="10" height="10" x="0" y="0"></use>
                </svg>

                <div className="text-truncate">{getClassStrings({ class: vehicle.class })}</div>
              </div>

              <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Main role</div>
            </div>
          </div>

          {/* <div className="game-unit_card-info_line d-flex w-100 mw-100">
                <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                    <div>71,000</div>

                    <img src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_rp.svg" width="18px" alt="RP" title="Research Points" />
                  </div>

                  <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Research</div>
                </div>

                <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                    <div>210,000</div>

                    <img src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_warpoints.svg" width="20px" alt="SL" title="Silver Lions" />
                  </div>

                  <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Purchase</div>
                </div>
              </div> */}

          {(vehicle.status || vehicle.operator) ? (
            <>
              <div className="game-unit_card-info_line d-flex w-100 mw-100">
                <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                  <div className="game-unit_card-info_value game-unit_status d-flex align-items-center flex-grow-1 fs-15">
                    <Image src={getStatusIcons({ status: vehicle.status })} height={15} />

                    <div className="text-truncate">{getStatusStrings({ status: vehicle.status })}</div>
                  </div>
                  <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Status</div>
                </div>

                {vehicle.operator && (
                  <>
                    <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                      <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                        <Image src={`https://static.encyclopedia.warthunder.com/gui_skin/${getCountryIcons({ country: vehicle.country, operator: vehicle.operator })}.svg`} height={18} />

                        <div className="text-truncate">{vehicle.operator}</div>
                      </div>
                      <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Operator</div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="game-unit_controls">
          <ToolTip title="Like">
            <Button variant="dark" className="game-unit_control game-unit_favorite-button d-flex align-items-center justify-content-center border-0">
              <FaRegHeart className="fs-6" />
              <span className="value game-unit_favorite-value">291</span>
            </Button>
          </ToolTip>

          <ToolTip title="Share">
            <Button variant="dark" id="game-unit_share" className="game-unit_control d-flex align-items-center justify-content-center border-0">
              <IoShareSocialOutline className="fs-6" />
            </Button>
          </ToolTip>

          <div className="game-unit_compare-wrapper">
            <Button variant="dark" id="game-unit_compare" className="game-unit_control d-flex align-items-center justify-content-center border-0">
              <FaScaleBalanced className="fs-6" />
              <span>Compare</span>
            </Button>
            <Button variant="dark" id="game-unit_compare-remove" className="game-unit_control p-0 d-none" style={{ width: "30px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M291-253.847 253.847-291l189-189-189-189L291-706.153l189 189 189-189L706.153-669l-189 189 189 189L669-253.847l-189-189-189 189Z"></path>
              </svg>
            </Button>
          </div>

          <div className="position-relative">
            <Button variant="dark" id="game-unit_game-view" className="game-unit_control d-flex align-items-center justify-content-center border-0">
              <TbDeviceDesktopShare className="fs-6" />
              <span>Show on wiki</span>
            </Button>
            <Button variant="dark" id="game-unit_game-view-help" className="game-unit_control-help p-0 d-flex align-items-center justify-content-center rounded-circle">
              <BsQuestion className="fs-6" />
            </Button>
          </div>

        </div>
      </Card>
    </>
  )
}
