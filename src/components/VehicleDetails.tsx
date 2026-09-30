import { Card, Image, Button, OverlayTrigger, Tooltip, Accordion, Table, Popover, Toast } from 'react-bootstrap'
import { getCountryIcons } from '@/constants/CountryIcons'
import { getRankStrings } from '@/constants/RankStrings'
import { getClassIcons } from '@/constants/ClassIcons'
import { FaRegHeart, FaHeart, FaScaleBalanced } from 'react-icons/fa6'
import { getStatusIcons } from '@/constants/StatusIcons'
import { BsQuestion } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { TbDeviceDesktopShare } from "react-icons/tb";
// import type { Vehicle } from '@/types/Vehicle'
import { getTankShellDecorIcons, getTankShellIconPath } from '@/constants/TankShellIcons'
import { useState, useEffect } from 'react'
import { getBulletIconPath } from '@/constants/BeltBulletIcons'
import { getTankShellVariantName } from '@/constants/TankShellVariantNames'
import { getBulletVariantName } from '@/constants/TankBeltBulletVariants'
import { getFeatureIcons } from '@/constants/FeatureIcons'
import { supabase } from '@/lib/supabaseClient'

type VehicleDetails = {
  vehicle: any
  session: any
  error: any
}

export type BeltBulletNames = "API-T" | "HEI-T" | "APDS" | "HEFI-T" | "HVAP-T" | "APHE" | "FI-T" | "AP-T" | "HEF-T" | "HVAP" | "AP-I" | "AP" | "T";

export default function VehicleDetails({ vehicle }: VehicleDetails) {
  const [activeAmmoId, setActiveAmmoId] = useState<number | null>(null);
  const [activeBeltKey, setActiveBeltKey] = useState<string | null>(null);
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    console.log(vehicle)
    let active = true;

    async function loadLikes() {
      const { data: count, error: countError } = await supabase.rpc(
        'get_vehicle_like_count',
        { p_vehicle_id: vehicle.id },
      );

      if (active && !countError) {
        setLikeCount(Number(count ?? 0));
      }

      if (!userId) {
        if (active) setIsLiked(false);
        return;
      }

      const { data, error } = await supabase
        .from('vehicle_likes')
        .select('vehicle_id')
        .eq('user_id', userId)
        .eq('vehicle_id', vehicle.id)
        .maybeSingle();

      if (active && !error) {
        setIsLiked(Boolean(data));
      }
    }

    void loadLikes();

    return () => {
      active = false;
    };
  }, [userId, vehicle.id]);

  function ensureDecimal(num: number): string {
    return Number.isInteger(num) ? `${num}.0` : num.toString();
  }

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  async function toggleLike() {
    if (!userId) setShow(true)
    if (likeCount === null || isLiking) return;

    const wasLiked = isLiked;
    const previousCount = likeCount;

    setIsLiking(true);
    setIsLiked(!wasLiked);
    setLikeCount(previousCount + (wasLiked ? -1 : 1));

    const result = wasLiked
      ? await supabase
        .from('vehicle_likes')
        .delete()
        .eq('user_id', userId)
        .eq('vehicle_id', vehicle.id)
      : await supabase.from('vehicle_likes').insert({
        user_id: userId,
        vehicle_id: vehicle.id,
      });

    if (result.error) {
      setIsLiked(wasLiked);
      setLikeCount(previousCount);
      console.error('Could not update vehicle like:', result.error);
    }

    setIsLiking(false);
  }

  const sortedWeapons = [...(vehicle.vehicle_weapons ?? [])].sort((a, b) => {
    const caliberA = a.weapon?.caliber_mm;
    const caliberB = b.weapon?.caliber_mm;

    if (caliberA == null) return caliberB == null ? 0 : 1;
    if (caliberB == null) return -1;

    return caliberB - caliberA;
  });

  function BeltIcon({ belt }: any) {
    return (
      <div className="game-unit_b-icon_base position-absolute w-100 h-100 start-0 top-0 d-flex mw-100 align-items-center justify-content-center">
        {belt.map((bullet: any, index: any) => (
          <Image
            key={`${bullet.ammunition.designation}-${index}`}
            src={getBulletIconPath({ icon: bullet.ammunition.designation })}
            alt={bullet.ammunition.designation}
            className="h-100 flex-grow-0 flex-shrink-1"
          />
        ))}
      </div>
    )
  }

  const getBulletComposition = (belt: any): [BeltBulletNames, number][] => {
    const counts = new Map<BeltBulletNames, number>();
    for (const bullet of belt) {
      counts.set(bullet.ammunition.designation, (counts.get(bullet.ammunition.designation) ?? 0) + 1);
    }
    return Array.from(counts.entries());
  };

  const ToolTip = ({ children, title }: any) => (
    <OverlayTrigger overlay={<Tooltip>{title}</Tooltip>}>{children}</OverlayTrigger>
  );

  const ShellPopover = (ammo: any) => (
    <Popover id={`shell-popover-${ammo.id}`} className="game-unit_popover">
      <Popover.Body>
        <div className="game-unit_popover-header d-flex align-items-center">
          <div className="icon">
            <div className="game-unit_b-icon position-relative overflow-hidden">
              <div className="game-unit_b-icon_decor position-absolute w-100 h-100 start-0 top-0">
                <Image src={getTankShellDecorIcons(ammo).damage} alt="" className="position-absolute w-100 start-0 top-0" />
                <Image src={getTankShellDecorIcons(ammo).armor} alt="" className="position-absolute w-100 start-0 top-0" />
              </div>
              <div className="game-unit_b-icon_base position-absolute w-100 h-100 start-0 top-0 d-flex mw-100 align-items-center justify-content-center">
                <Image src={getTankShellIconPath(ammo)} alt="" className="h-100 flex-grow-0 flex-shrink-1" />
              </div>
            </div>
          </div>
          <span className="fw-bold fs-6">{ammo.ammunition.designation}</span>
        </div>

        <div className="game-unit_popover-content">
          <div style={{ fontSize: '.9rem' }}>
            <div className="mb-1">{getTankShellVariantName(ammo.ammunition.variant)}</div>

            <div className="d-flex flex-column px-2 py-1 mb-2 border rounded-1 column-gap-2">
              <span className="text-muted">Armor penetration (max.)</span>
              <span className="fw-bold">{ammo.penetration_mm} mm</span>
            </div>

            <div>
              <div className="game-unit_chars-line">
                <div className="game-unit_chars-header">Caliber</div>
                <div className="game-unit_chars-value">{ammo.caliber_mm} mm</div>
              </div>

              <div className="game-unit_chars-line">
                <div className="game-unit_chars-header">Projectile Mass</div>
                <div className="game-unit_chars-value">{ammo.projectile_mass_kg} kg</div>
              </div>

              <div className="game-unit_chars-line">
                <div className="game-unit_chars-header">Muzzle Velocity</div>
                <div className="game-unit_chars-value">{ammo.muzzle_velocity_ms} m/s</div>
              </div>

              {ammo.fuze_delay_m && (
                <div className="game-unit_chars-line">
                  <div className="game-unit_chars-header">Fuze Delay</div>
                  <div className="game-unit_chars-value">{ammo.fuze_delay_m} m</div>
                </div>
              )}

              {ammo.fuze_sensitivity_mm && (
                <div className="game-unit_chars-line">
                  <div className="game-unit_chars-header">Fuze Sensitivity</div>
                  <div className="game-unit_chars-value">{ammo.fuze_sensitivity_mm} mm</div>
                </div>
              )}

              {ammo.explosive_type && (
                <div className="game-unit_chars-line">
                  <div className="game-unit_chars-header">Explosive Type</div>
                  <div className="game-unit_chars-value">{ammo.explosive_type}</div>
                </div>
              )}

              {ammo.explosive_mass_kg && (
                <div className="game-unit_chars-line">
                  <div className="game-unit_chars-header">Explosive Mass</div>
                  <div className="game-unit_chars-value">{ammo.explosive_mass_kg} kg</div>
                </div>
              )}

              {ammo.tnt_equivalent_kg && (
                <div className="game-unit_chars-line">
                  <div className="game-unit_chars-header">TNT equivalent</div>
                  <div className="game-unit_chars-value">{ammo.tnt_equivalent_kg} kg</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  const BeltPopover = (belt: any) => (
    <Popover id={`belt-popover-${belt.belt_id}`} className="game-unit_popover">
      <Popover.Body>
        <div className="game-unit_popover-header d-flex align-items-center">
          <div className="icon">
            <div className="game-unit_b-icon position-relative overflow-hidden">
              <BeltIcon belt={belt.belt.belt_ammunition} />
            </div>
          </div>
          <span className="fw-bold fs-6">{belt.belt.name}</span>
        </div>

        <div className="game-unit_popover-content">
          <div style={{ fontSize: '.9em' }}>
            <div className="d-flex flex-column px-2 py-1 mb-2 border rounded-1 column-gap-2">
              <span className="text-muted">Armor penetration (max.)</span>
              <span className="fw-bold">{belt.belt.max_penetration_mm} mm</span>
            </div>

            <div>
              <span>Belt filling: {belt.belt.belt_filling}</span>
              <ul className="ps-3 m-0">
                {getBulletComposition(belt.belt.belt_ammunition).map(([bullet]) => (
                  <li key={bullet}>
                    <span className="">{bullet}: </span>
                    <span className="">{getBulletVariantName(bullet)} bullet</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  const FeaturePopover = (feature: any) => (
    <Popover id={`feature-popover-${feature.id}`} className="game-unit_popover">
      <Popover.Body>
        <div>
          <div className="game-unit_popover-header d-flex align-items-center">
            <div className="icon">{getFeatureIcons(feature.id)}</div>
            <span className="fw-bold fs-6">{feature.name}</span>
          </div>

          <div className="game-unit_popover-content">{feature.description}</div>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div id="general">
        <Card className="game-unit_header overflow-hidden border-0 position-relative mb-3 text-light">
          <div className="game-unit_card position-relative">
            <div className="game-unit_template position-absolute w-100 h-100 start-0 top-0">
              <Image className="game-unit_template-flag position-absolute start-0 h-50" src={`https://static.encyclopedia.warthunder.com/unit_tooltip/${getCountryIcons({ nation: vehicle.nations.id, operator: vehicle?.operators?.id })}.png`} />

              <Image className="game-unit_template-image position-absolute start-0 bottom-0 h-100" src={`https://static.encyclopedia.warthunder.com/images/${vehicle.id.toLowerCase()}.png`} />
            </div>

            <div className="game-unit_title position-absolute bottom-0 w-100 z-1">
              <div className="game-unit_nation d-flex align-items-end gap-2 overflow-hidden">{vehicle.vehicle_types.name}</div>

              <div className="game-unit_name fw-bold overflow-hidden font-wt">{vehicle.name}</div>
            </div>
          </div>

          <div className="game-unit_card-info d-flex flex-column">
            <div className="game-unit_card-info_line d-flex w-100 mw-100">
              <div className="game-unit_card-info_item game-unit_rank flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-4 fw-bold">{getRankStrings(vehicle.rank)}</div>
                <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Rank</div>
              </div>

              <div className="game-unit_card-info_item game-unit_br flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                <div className="game-unit_card-info_value d-grid align-items-center flex-grow-1 fs-15 gap-1">
                  <div className="game-unit_br-item flex-grow-1 text-center position-relative">
                    <div className="mode text-gray fs-11">AB</div>

                    <div className="value fw-bold fs-17">{ensureDecimal(vehicle.battle_rating_ab)}</div>
                    
                  </div>

                  <div className="game-unit_br-item flex-grow-1 text-center position-relative">
                    <div className="mode text-gray fs-11">RB</div>

                    <div className="value fw-bold fs-17">{ensureDecimal(vehicle.battle_rating_rb)}</div>
                  </div>

                  <div className="game-unit_br-item flex-grow-1 text-center position-relative">
                    <div className="mode text-gray fs-11">SB</div>

                    <div className="value fw-bold fs-17">{ensureDecimal(vehicle.battle_rating_sb)}</div>
                  </div>
                </div>

                <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Battle rating</div>
              </div>
            </div>

            <div className="game-unit_card-info_line d-flex w-100 mw-100">
              <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                  <Image src={`https://static.encyclopedia.warthunder.com/gui_skin/${getCountryIcons({ nation: vehicle.nations.id })}.svg`} width={20} height={18} />

                  <div className="text-truncate">{vehicle.nations.name}</div>
                </div>

                <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Research country</div>
              </div>

              <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                  <svg width="20px" height="20px" viewBox="0 0 10 10" color={getClassIcons(vehicle.vehicle_classes.id).color}>
                    <use href={getClassIcons(vehicle.vehicle_classes.id).file} width="10" height="10" x="0" y="0"></use>
                  </svg>

                  <div className="text-truncate">{vehicle.vehicle_classes.name}</div>
                </div>

                <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Main role</div>
              </div>
            </div>
            
            {(vehicle.status_id === "techtree" || vehicle.status_id === "squadron") && (
              <div className="game-unit_card-info_line d-flex w-100 mw-100">
                <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                    <div>{vehicle.research !== null ? numberWithCommas(vehicle.research) : 'Free'}</div>

                    {vehicle.research !== null && (
                      <div>
                        {vehicle.status_id === "techtree" ? (
                          <Image src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_rp.svg" width="18px" alt="RP" title="Research Points" />
                        ) : vehicle.status_id === "squadron" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 100 100" fill="currentColor">
                            <path className="cls-1" d="M50,94A44,44,0,1,1,94,50,44.019,44.019,0,0,1,50,94Zm0-4.552A39.473,39.473,0,0,0,89.449,50a47.076,47.076,0,0,0-.277-5.015H71.582L58.9,83.918,50.939,36.459l-8.91,35.7L31.949,44.113l-5.719,13.9H11.248C14.7,76.273,30.73,89.449,50,89.449Zm0-78.9A39.447,39.447,0,0,0,10.552,50c0,0.934.044,3.054,0.108,3.973H23.218L32.3,31.634l8.941,24.876,10.57-42.345L60.345,65,68.29,41H88.367A39.615,39.615,0,0,0,50,10.552Z"></path>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Research</div>
                </div>

                <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                    <div>{vehicle.purchase !== null ? numberWithCommas(vehicle.purchase) : 'Free'}</div>

                    {vehicle.purchase !== null && (
                      <div>
                        <Image src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_warpoints.svg" width="20px" alt="SL" title="Silver Lions" />
                      </div>
                    )}
                  </div>

                  <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Purchase</div>
                </div>
              </div>
            )}

            {(vehicle.vehicle_statuses || vehicle.operators) ? (
              <>
                <div className="game-unit_card-info_line d-flex w-100 mw-100">
                  <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                    <div className="game-unit_card-info_value game-unit_status d-flex align-items-center flex-grow-1 fs-15">
                      <Image src={getStatusIcons(vehicle.vehicle_statuses.id)} height={15} />

                      <div className="text-truncate">{vehicle.vehicle_statuses.name} vehicle</div>
                    </div>
                    <div className="game-unit_card-info_title text-muted fs-12 overflow-hidden">Status</div>
                  </div>

                  {vehicle.operators && (
                    <>
                      <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden">
                        <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-15">
                          <Image src={`https://static.encyclopedia.warthunder.com/gui_skin/${getCountryIcons({ nation: vehicle.nations.id, operator: vehicle.operators.id })}.svg`} height={18} />

                          <div className="text-truncate">{vehicle.operators.name}</div>
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
            <ToolTip title={isLiked ? 'Unlike' : 'Like'}>
              <Button
                variant="dark"
                className={`game-unit_control game-unit_favorite-button d-flex align-items-center justify-content-center border-0${isLiked ? ' game-unit_favorite--favorite' : ''}`}
                onClick={toggleLike}
                disabled={likeCount === null || isLiking}
                aria-pressed={isLiked}
                aria-label={isLiked ? 'Unlike vehicle' : 'Like vehicle'}
              >
                {isLiked ? (
                  <FaHeart className="fs-6" />
                ) : (
                  <FaRegHeart className="fs-6" />
                )}
                <span className="value game-unit_favorite-value">{likeCount ?? 0}</span>
              </Button>
            </ToolTip>

            <ToolTip title="Share">
              <Button
                variant="dark"
                id="game-unit_share"
                className="game-unit_control d-flex align-items-center justify-content-center border-0"
              >
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

        <div className="game-unit_content">
          <div className="game-unit_data position-relative">
            <div id="specification">
              <Card id="weapon" className="block mb-3 border-0">
                <Card.Header className="block-header">Armaments</Card.Header>
                <Card.Body className="block-content pb-3">
                  <div className="tab-content">
                    <div id="weapon-preset-0" className="">
                      {sortedWeapons.map((vehicle_weapon: any) => (
                        <div className="game-unit_weapon" key={vehicle_weapon.id}>
                          <div className="game-unit_weapon-title">
                            <span className="text-info text-decoration-underline">{vehicle_weapon.weapon.name} {vehicle_weapon.type}</span>{" "}
                            <span>{vehicle_weapon.weapon.weapon_type && `(${vehicle_weapon.weapon.weapon_type})`}</span>
                          </div>

                          {vehicle_weapon.type === "cannon" ? (
                            <>
                              {vehicle_weapon.features && (
                                <div className="game-unit_features mt-1">
                                  {vehicle_weapon.features.map((feature: any) => (
                                    <OverlayTrigger
                                      key={feature.id}
                                      trigger="click"
                                      placement="auto"
                                      show={activeFeatureId === feature.id}
                                      rootClose
                                      onToggle={(nextShow) => {
                                        if (!nextShow && activeFeatureId === feature.id) {
                                          setActiveFeatureId(null);
                                        }
                                      }}
                                      overlay={FeaturePopover(feature)}
                                    >
                                      <Button
                                        variant="transparent"
                                        className="game-unit_feature"
                                        onClick={() => setActiveFeatureId((current) => current === feature.id ? null : feature.id)}
                                        aria-label={`Show details for ${feature.name}`}
                                      >
                                        <div className="icon">{getFeatureIcons(feature.id)}</div>

                                        <span>{feature.name}</span>
                                      </Button>
                                    </OverlayTrigger>
                                  ))}
                                </div>
                              )}

                              <div className="game-unit_chars mt-2">
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line">
                                    <span className="game-unit_chars-header">Ammunition</span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.ammo_quantity} rounds</span>
                                  </div>

                                  <div className="game-unit_chars-subline">
                                    <span>First-order</span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.first_order_ammo} rounds</span>
                                  </div>
                                </div>
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line">
                                    <span className="game-unit_chars-header">Reload</span>
                                    <span className="game-unit_chars-info">basic crew → aces</span>
                                  </div>

                                  <div className="game-unit_chars-subline">
                                    <span></span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.reload_time_seconds} s</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="game-unit_chars mt-2">
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line">
                                    <span className="game-unit_chars-header">Ammunition</span>
                                    <span className="game-unit_chars-value">{numberWithCommas(vehicle_weapon.ammo_quantity)} rounds</span>
                                  </div>

                                  <div className="game-unit_chars-subline">
                                    <span>Belt capacity</span>
                                    <span className="game-unit_chars-value">{numberWithCommas(vehicle_weapon.belt_capacity)} rounds</span>
                                  </div>
                                </div>
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line">
                                    <span className="game-unit_chars-header">Reload</span>
                                    <span className="game-unit_chars-info">basic crew → aces</span>
                                  </div>

                                  <div className="game-unit_chars-subline">
                                    <span></span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.reload_time_seconds} s</span>
                                  </div>

                                  <div className="game-unit_chars-line">
                                    <span>Fire rate</span>
                                    <span className="game-unit_chars-value">{numberWithCommas(vehicle_weapon.fire_rate_rpm)} shots/min</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          <div className="game-unit_belts mt-2">
                            <Accordion>
                              <Accordion.Item eventKey="0">
                                <Accordion.Header>{vehicle_weapon.type === "cannon" ? "Available ammunition" : "Available belts"}</Accordion.Header>
                                <Accordion.Body className="p-0">
                                  <Table className="game-unit_belt-list">
                                    <thead>
                                      <tr>
                                        {vehicle_weapon.type === "cannon" ? (
                                          <>
                                            <th scope="col">Ammunition</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Armor penetration (mm)</th>
                                          </>
                                        ) : (
                                          <>
                                            <th scope="col">Belt</th>
                                            <th scope="col">Belt filling</th>
                                            <th scope="col">Armor penetration (mm)</th>
                                          </>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {vehicle_weapon.type === "cannon" ? (
                                        <>
                                          {vehicle_weapon.vehicle_ammunition.map((ammo: any) => (
                                            <tr key={ammo.id}>
                                              <td>
                                                <OverlayTrigger
                                                  trigger="click"
                                                  placement="auto"
                                                  show={activeAmmoId === ammo.id}
                                                  rootClose
                                                  onToggle={(nextShow) => {
                                                    if (!nextShow && activeAmmoId === ammo.id) {
                                                      setActiveAmmoId(null);
                                                    }
                                                  }}
                                                  overlay={ShellPopover(ammo)}
                                                >
                                                  <Button
                                                    variant="transparent"
                                                    className="border-0 text-light d-inline-flex align-items-center column-gap-2 py-0 ps-2 ms-1 pe-1"
                                                    onClick={() => setActiveAmmoId((current) => current === ammo.id ? null : ammo.id)}
                                                    aria-label={`Show details for ${ammo.ammunition.designation}`}
                                                  >
                                                    <div className="game-unit_b-icon position-relative overflow-hidden">
                                                      <div className="game-unit_b-icon_decor position-absolute w-100 h-100 start-0 top-0">
                                                        <Image src={getTankShellDecorIcons(ammo).damage} alt="Damage" className="position-absolute w-100 start-0 top-0" />
                                                        <Image src={getTankShellDecorIcons(ammo).armor} alt="Armor" className="position-absolute w-100 start-0 top-0" />
                                                      </div>
                                                      <div className="game-unit_b-icon_base position-absolute w-100 h-100 start-0 top-0 d-flex mw-100 align-items-center justify-content-center">
                                                        <Image src={getTankShellIconPath(ammo)} alt={`${ammo.ammunition.variant} shell icon`} className="h-100 flex-grow-0 flex-shrink-1" />
                                                      </div>
                                                    </div>
                                                    <span className="shell-designation">{ammo.ammunition.designation}</span>
                                                  </Button>
                                                </OverlayTrigger>
                                              </td>
                                              <td className="shell-variant">{ammo.ammunition.variant}</td>
                                              <td className="shell-pen">{ammo.penetration_mm}</td>
                                            </tr>
                                          ))}
                                        </>
                                      ) : (
                                        <>
                                          {vehicle_weapon.vehicle_belts.map((belt: any) => {
                                            const beltKey = `${vehicle_weapon.id}-${belt.belt_id}`;

                                            return (
                                              <tr key={beltKey} className={belt.belt_id}>
                                                <td>
                                                  <OverlayTrigger
                                                    trigger="click"
                                                    placement="auto"
                                                    show={activeBeltKey === beltKey}
                                                    rootClose
                                                    onToggle={(nextShow) => {
                                                      if (!nextShow && activeBeltKey === beltKey) {
                                                        setActiveBeltKey(null);
                                                      }
                                                    }}
                                                    overlay={BeltPopover(belt)}
                                                  >
                                                    <Button
                                                      variant="transparent"
                                                      className="border-0 text-light d-inline-flex align-items-center column-gap-2 py-0 ps-2 ms-1 pe-1"
                                                      onClick={() => setActiveBeltKey((current) => current === beltKey ? null : beltKey)}
                                                      aria-label={`Show details for ${belt.belt.name}`}
                                                    >
                                                      <div className="game-unit_b-icon position-relative overflow-hidden">
                                                        <BeltIcon belt={belt.belt.belt_ammunition} />
                                                      </div>
                                                      <span className="belt-name">{belt.belt.name}</span>
                                                    </Button>
                                                  </OverlayTrigger>
                                                </td>
                                                <td className="belt-filling">{belt.belt.belt_filling}</td>
                                                <td className="belt-pen">{belt.belt.max_penetration_mm}</td>
                                              </tr>
                                            );
                                          })}
                                        </>
                                      )}
                                    </tbody>
                                  </Table>
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide className="bg-dark">
        <Toast.Header>
          <span className="fw-bold me-auto">War Thunder Vehicle Dashboard</span>
        </Toast.Header>
        <Toast.Body className="fs-6">You need to be logged-in to be able to like vehicles.</Toast.Body>
      </Toast>
    </>
  )
}
