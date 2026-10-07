import { useState, useEffect } from 'react'
import { Card, Image, Button, OverlayTrigger, Tooltip, Accordion, Table, Popover, Toast } from 'react-bootstrap'
import {
  getCountryIcons,
  getRankStrings,
  getClassIcons,
  getStatusIcons,
  getTankShellDecorIcons,
  getTankShellIconPath,
  getBulletIconPath,
  getTankShellVariantName,
  getBulletVariantName,
  getFeatureIcons
} from '@/constants'
import { FaRegHeart, FaHeart, FaScaleBalanced } from 'react-icons/fa6'
import { TbDeviceDesktopShare } from 'react-icons/tb'
import { supabase } from '@/lib/supabaseClient'
import { WebShare, AnimatedProgress } from '@/components'
import type { BeltBulletNames } from '@/types/Ammunition'

type VehicleDetails = {
  vehicle: any
}

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
    if (!userId) {
      setShow(true)
      return
    }
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
      // console.error('Could not update vehicle like:', result.error);
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
      <Popover.Header className="game-unit_popover-header d-inline-flex w-100 align-items-center border-0 px-3 pb-0 column-gap-2">
        <div className="game-unit_b-icon position-relative overflow-hidden">
          <div className="game-unit_b-icon_decor position-absolute w-100 h-100 start-0 top-0">
            <Image src={getTankShellDecorIcons(ammo).damage} alt="Damage" className="position-absolute w-100 start-0 top-0" />

            <Image src={getTankShellDecorIcons(ammo).armor} alt="Armor" className="position-absolute w-100 start-0 top-0" />
          </div>

          <div className="game-unit_b-icon_base position-absolute w-100 h-100 start-0 top-0 d-flex mw-100 align-items-center justify-content-center">
            <Image src={getTankShellIconPath(ammo)} alt={`${ammo.ammunition.variant} shell icon`} className="h-100 flex-grow-0 flex-shrink-1" />
          </div>
        </div>

        <span className="fw-bold fs-5">{ammo.ammunition.designation}</span>
      </Popover.Header>

      <Popover.Body className="px-3 pb-2 pt-1 fs-6">
        <div className="mb-1 shell-variant">
          <span className="text-muted small">{ammo.ammunition.variant}</span>
          <span className="text-muted small"> - </span>
          <span className="text-muted small">{getTankShellVariantName(ammo.ammunition.variant)}</span>
        </div>

        <ul className="list-unstyled shells-performance-list mb-0">
          <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
            <span className="text-muted">Armor penetration (max.)</span>
            <span className="fw-bold">{ammo.penetration_mm} mm</span>
          </li>

          <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
            <span className="fw-bold">Caliber</span>
            <span className="text-muted">{ammo.caliber_mm} mm</span>
          </li>

          <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
            <span className="fw-bold">Projectile Mass</span>
            <span className="text-muted">{ammo.projectile_mass_kg} kg</span>
          </li>

          <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
            <div className="fw-bold">Muzzle Velocity</div>
            <div className="text-muted">{ammo.muzzle_velocity_ms} m/s</div>
          </li>

          {ammo.fuze_delay_m && (
            <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
              <div className="fw-bold">Fuze Delay</div>
              <div className="text-muted">{ammo.fuze_delay_m} m</div>
            </li>
          )}

          {ammo.fuze_sensitivity_mm && (
            <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
              <div className="fw-bold">Fuze Sensitivity</div>
              <div className="text-muted">{ammo.fuze_sensitivity_mm} mm</div>
            </li>
          )}

          {ammo.explosive_type && (
            <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
              <div className="fw-bold">Explosive Type</div>
              <div className="text-muted">{ammo.explosive_type}</div>
            </li>
          )}

          {ammo.explosive_mass_kg && (
            <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
              <div className="fw-bold">Explosive Mass</div>
              <div className="text-muted">{ammo.explosive_mass_kg} kg</div>
            </li>
          )}

          {ammo.tnt_equivalent_kg && (
            <li className="d-flex align-items-center justify-content-between flex-wrap pb-1 mb-1 border-bottom column-gap-2">
              <div className="fw-bold">TNT equivalent</div>
              <div className="text-muted">{ammo.tnt_equivalent_kg} kg</div>
            </li>
          )}
        </ul>
      </Popover.Body>
    </Popover>
  );

  const BeltPopover = (belt: any) => (
    <Popover id={`belt-popover-${belt.belt_id}`} className="game-unit_popover">
      <Popover.Header className="game-unit_popover-header d-inline-flex w-100 align-items-center border-0 px-3 pb-0 column-gap-2">
        <div className="game-unit_b-icon position-relative overflow-hidden">
          <BeltIcon belt={belt.belt.belt_ammunition} />
        </div>

        <span className="fw-bold fs-5">{belt.belt.name}</span>
      </Popover.Header>

      <Popover.Body className="px-3 pb-2 pt-1 fs-6">
        <div className="d-flex flex-column pb-1 mb-1 border-bottom column-gap-2">
          <span className="text-muted">Armor penetration (max.)</span>
          <span className="fw-bold">{belt.belt.max_penetration_mm} mm</span>
        </div>

        <div className="mb-2">
          <span>Belt filling: {belt.belt.belt_filling}</span>
        </div>

        <ul className="belts-performance-list ps-3 m-0">
          {getBulletComposition(belt.belt.belt_ammunition).map(([bullet]) => (
            <li key={bullet}>
              <span className="fw-bold">{bullet}: </span>
              <span className="text-muted">{getBulletVariantName(bullet)} bullet</span>
            </li>
          ))}
        </ul>
      </Popover.Body>
    </Popover>
  );

  const FeaturePopover = (feature: any) => feature.support_systems ? (
    <Popover id={`support_system-popover-${feature.support_systems.id}`} className="game-unit_popover">
      <Popover.Body>
        <div>
          <div className="game-unit_popover-header d-flex align-items-center gap-2 mb-2">
            <div className="icon">{getFeatureIcons(feature.support_systems.id)}</div>
            <span className="fw-bold fs-6">{feature.support_systems.name}</span>
          </div>

          <div className="game-unit_popover-content">
            {feature.support_systems.description}
            {feature.can_fire && (
              <ul className="m-0 mt-2 mb-1 ps-4">
                {feature.can_fire.map((name: string) => (
                  <li key={name}>{name} can fire</li>
                ))}
              </ul>
            )}
            {feature.can_drive && (
              <ul className="m-0 mt-2 mb-1 ps-4">
                {feature.can_drive.map((name: string) => (
                  <li key={name}>{name} can drive</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Popover.Body>
    </Popover>
  ) : feature.weapon_features ? (
    <Popover id={`weapon_feature-popover-${feature.weapon_features.id}-${ feature.id }`} className="game-unit_popover">
      <Popover.Body>
        <div>
          <div className="game-unit_popover-header d-flex align-items-center gap-2 mb-2">
            <div className="icon">{getFeatureIcons(feature.weapon_features.id)}</div>
            <span className="fw-bold fs-6">{feature.weapon_features.name}</span>
          </div>

          <div className="game-unit_popover-content">
            {feature.weapon_features.description}
          </div>
        </div>
      </Popover.Body>
    </Popover>
  ) : (
    <Popover id={`feature-popover-${feature.id}`} className="game-unit_popover">
      <Popover.Body>
        <div>
          <div className="game-unit_popover-header d-flex align-items-center gap-2 mb-2">
            <div className="icon">{getFeatureIcons(feature.id)}</div>
            <span className="fw-bold fs-6">{feature.name}</span>
          </div>

          <div className="game-unit_popover-content">
            {feature.description}
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  const OpticalDevicePopover = (optic: any) => (
    <Popover id={`optical_device-popover-${optic.optical_device.id}-${optic.id}`} className="game-unit_popover">
      <Popover.Body>
        <div>
          <div className="game-unit_popover-header d-flex align-items-center gap-2 mb-2">
            <div className="icon">{getFeatureIcons(optic.optical_device.id)}</div>
            <span className="fw-bold fs-6">{optic.optical_device.name}</span>
          </div>

          <div className="game-unit_popover-content">
            {optic.optical_device.description}
            {optic.optical_device_id === "thermal_imager" && (
              <div className="mt-1">
                <div className="my-1 text-muted small text-center">Optics resolution</div>

                <div className="gunit_specs-table_row fw-bold d-flex gap-1 text-center pb-1">
                  {vehicle.vehicle_optics.map((optic: any) => (
                    <div key={optic.id} className="flex-grow-1 flex-shrink-1">{optic.crew_member}</div>
                  ))}
                </div>

                <div className="gunit_specs-table_row d-flex gap-1 text-center pb-1 mt-1">
                  {vehicle.vehicle_optics.map((optic: any) => (
                    <div key={optic.id} className="flex-grow-1 flex-shrink-1 small">{optic.optics_zoom ? optic.optics_zoom : '-'}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div className={`game-unit game-unit--${vehicle.vehicle_statuses.id} w-100`}>
        <div id="general">
          <div className="game-unit_header overflow-hidden border-0 position-relative mb-3 rounded">
            <div className="game-unit_card position-relative">
              <div className="game-unit_template position-absolute w-100 h-100 start-0 top-0">
                <Image className="game-unit_template-flag position-absolute start-0 h-50" src={`https://static.encyclopedia.warthunder.com/unit_tooltip/${getCountryIcons({ nation: vehicle.nations.id, operator: vehicle?.operators?.id })}.png`} />

                <Image className="game-unit_template-image position-absolute start-0 bottom-0 h-100" src={`https://static.encyclopedia.warthunder.com/images/${vehicle.id.toLowerCase()}.png`} />
              </div>

              <div className="game-unit_title position-absolute bottom-0 w-100 z-1 px-3 px-lg-4">
                <div className="game-unit_nation d-flex align-items-end gap-2 overflow-hidden fs-6">{vehicle.vehicle_types.name}</div>

                <div className="game-unit_name fw-bold fs-1 overflow-hidden font-wt">{vehicle.name}</div>
              </div>
            </div>

            <div className="game-unit_card-info d-flex flex-column position-absolute gap-1">
              <div className="game-unit_card-info_line d-flex w-100 mw-100 gap-1">
                <div className="game-unit_card-info_item game-unit_rank flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-4 fw-bold">{getRankStrings(vehicle.rank)}</div>
                  <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Rank</div>
                </div>

                <div className="game-unit_card-info_item game-unit_br flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-6 gap-1">
                    <div className="game-unit_br-item flex-grow-1 text-center position-relative d-flex flex-column">
                      <span className="mode text-muted small">AB</span>

                      <span className="value fw-bold fs-6">{ensureDecimal(vehicle.battle_rating_ab)}</span>
                    </div>

                    <div className="game-unit_br-item flex-grow-1 text-center position-relative d-flex flex-column">
                      <span className="mode text-muted small">RB</span>

                      <span className="value fw-bold fs-6">{ensureDecimal(vehicle.battle_rating_rb)}</span>
                    </div>

                    <div className="game-unit_br-item flex-grow-1 text-center position-relative d-flex flex-column">
                      <span className="mode text-muted small">SB</span>

                      <span className="value fw-bold fs-6">{ensureDecimal(vehicle.battle_rating_sb)}</span>
                    </div>
                  </div>

                  <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Battle rating</div>
                </div>
              </div>

              <div className="game-unit_card-info_line d-flex w-100 mw-100 gap-1">
                <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-6">
                    <Image src={`https://static.encyclopedia.warthunder.com/gui_skin/${getCountryIcons({ nation: vehicle.nations.id })}.svg`} width={22} height={18} />

                    <div className="text-truncate">{vehicle.nations.name}</div>
                  </div>

                  <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Research country</div>
                </div>

                <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                  <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-6">
                    <svg width="20px" height="20px" viewBox="0 0 10 10" color={getClassIcons(vehicle.vehicle_classes.id).color}>
                      <use href={getClassIcons(vehicle.vehicle_classes.id).file} width="10" height="10" x="0" y="0"></use>
                    </svg>

                    <div className="text-truncate">{vehicle.vehicle_classes.name}</div>
                  </div>

                  <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Main role</div>
                </div>
              </div>
              
              {(vehicle.status_id === "techtree" || vehicle.status_id === "squadron") && (
                <div className="game-unit_card-info_line d-flex w-100 mw-100 gap-1">
                  <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                    <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-6">
                      <div>{vehicle.research !== null ? numberWithCommas(vehicle.research) : 'Free'}</div>

                      {vehicle.research !== null && (
                        <div>
                          {vehicle.status_id === "techtree" ? (
                            <Image src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_rp.svg" width="18px" alt="RP" title="Research Points" />
                          ) : vehicle.status_id === "squadron" && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 100 100" fill="#93BE64">
                              <path className="cls-1" d="M50,94A44,44,0,1,1,94,50,44.019,44.019,0,0,1,50,94Zm0-4.552A39.473,39.473,0,0,0,89.449,50a47.076,47.076,0,0,0-.277-5.015H71.582L58.9,83.918,50.939,36.459l-8.91,35.7L31.949,44.113l-5.719,13.9H11.248C14.7,76.273,30.73,89.449,50,89.449Zm0-78.9A39.447,39.447,0,0,0,10.552,50c0,0.934.044,3.054,0.108,3.973H23.218L32.3,31.634l8.941,24.876,10.57-42.345L60.345,65,68.29,41H88.367A39.615,39.615,0,0,0,50,10.552Z"></path>
                            </svg>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Research</div>
                  </div>

                  <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                    <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-6">
                      <div>{vehicle.purchase !== null ? numberWithCommas(vehicle.purchase) : 'Free'}</div>

                      {vehicle.purchase !== null && (
                        <div>
                          <Image src="https://static.encyclopedia.warthunder.com/gui_skin/item_type_warpoints.svg" width="20px" alt="SL" title="Silver Lions" />
                        </div>
                      )}
                    </div>

                    <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Purchase</div>
                  </div>
                </div>
              )}

              {(vehicle.vehicle_statuses || vehicle.operators) ? (
                <>
                  <div className="game-unit_card-info_line d-flex w-100 mw-100 gap-1">
                    <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                      <div className="game-unit_card-info_value game-unit_status d-flex align-items-center flex-grow-1 fs-6">
                        <Image src={getStatusIcons(vehicle.vehicle_statuses.id)} height={20} />

                        <div className="text-truncate">{vehicle.vehicle_statuses.name} vehicle</div>
                      </div>
                      <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Status</div>
                    </div>

                    {vehicle.operators && (
                      <>
                        <div className="game-unit_card-info_item flex-grow-1 bg-dark-subtle d-flex flex-column position-relative rounded-1 overflow-hidden gap-1 py-2 px-3">
                          <div className="game-unit_card-info_value d-flex align-items-center flex-grow-1 fs-6">
                            <Image src={`https://static.encyclopedia.warthunder.com/gui_skin/${getCountryIcons({ nation: vehicle.nations.id, operator: vehicle.operators.id })}.svg`} height={18} />

                            <div className="text-truncate">{vehicle.operators.name}</div>
                          </div>
                          <div className="game-unit_card-info_title text-muted fs-6 overflow-hidden">Operator</div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            <div className="game-unit_controls d-flex align-items-center gap-2 overflow-hidden overflow-x-auto px-4 py-2">
              <ToolTip title={isLiked ? 'Unlike' : 'Like'}>
                <Button
                  variant="dark"
                  className={`game-unit_control position-relative py-1 gap-1 game-unit_favorite-button d-flex align-items-center justify-content-center border-0${isLiked ? ' game-unit_favorite--favorite' : ''}`}
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

              {navigator.share !== null && (
                <WebShare />
              )}

              <div className="game-unit_compare-wrapper">
                <Button variant="dark" id="game-unit_compare" className="game-unit_control position-relative py-1 gap-1 d-flex align-items-center justify-content-center border-0">
                  <FaScaleBalanced className="fs-6" />
                  <span>Compare</span>
                </Button>
                <Button variant="dark" id="game-unit_compare-remove" className="game-unit_control position-relative py-1 gap-1 p-0 d-none" style={{ width: "30px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M291-253.847 253.847-291l189-189-189-189L291-706.153l189 189 189-189L706.153-669l-189 189 189 189L669-253.847l-189-189-189 189Z"></path>
                  </svg>
                </Button>
              </div>

              <div className="position-relative">
                <Button variant="dark" href={`https://wiki.warthunder.com/unit/${vehicle.id}`} target="_blank" id="game-unit_game-view" className="game-unit_control position-relative py-1 gap-1 d-flex align-items-center justify-content-center border-0">
                  <TbDeviceDesktopShare className="fs-6" />
                  <span>Show on wiki</span>
                </Button>
              </div>

            </div>
          </div>
        </div>

        <div className="game-unit_content d-flex flex-column flex-lg-row column-gap-3">
          <div className="game-unit_data position-relative w-100">
            {vehicle.vehicle_weapons.length !== 0 && (
              <>
                <Card id="weapon" className="mb-3 border-0 w-100">
                  <Card.Header className="fs-6 fw-semibold">Armaments</Card.Header>

                  <Card.Body className="pt-2">
                    <div className="tab-content">
                      <div id="weapon-preset-0">
                        {sortedWeapons.map((vehicle_weapon: any) => (
                          <div className="game-unit_weapon border border-secondary p-2 rounded mb-3 position-relative" key={vehicle_weapon.id}>
                            <div className="game-unit_weapon-title position-absolute fs-6 bg-dark-lighter overflow-hidden">
                              <span className="text-info text-decoration-underline">{vehicle_weapon.weapon.name} {vehicle_weapon.type}</span>{" "}
                              <span>{vehicle_weapon.weapon.weapon_type && `(${vehicle_weapon.weapon.weapon_type})`}</span>
                            </div>

                            {vehicle_weapon.vehicle_weapon_features.length > 0 && (
                              <div className="game-unit_features d-grid gap-1 mt-2">
                                {vehicle_weapon.vehicle_weapon_features.map((feature: any) => (
                                  <OverlayTrigger
                                    key={`${feature.weapon_features.id}-${feature.id}`}
                                    trigger="click"
                                    placement="auto"
                                    show={activeFeatureId === `${feature.weapon_features.id}-${feature.id}`}
                                    rootClose
                                    onToggle={(nextShow) => {
                                      if (!nextShow && activeFeatureId === `${feature.weapon_features.id}-${feature.id}`) {
                                        setActiveFeatureId(null);
                                      }
                                    }}
                                    overlay={FeaturePopover(feature)}
                                  >
                                    <Button
                                      variant="transparent"
                                      className="game-unit_feature d-flex align-items-center border-secondary gap-2 overflow-hidden"
                                      onClick={() => setActiveFeatureId((current) => current === `${feature.weapon_features.id}-${feature.id}` ? null : `${feature.weapon_features.id}-${feature.id}`)}
                                      aria-label={`Show details for ${feature.weapon_features.name}`}
                                    >
                                      <div className="icon">{getFeatureIcons(feature.weapon_features.id)}</div>

                                      <span className="small overflow-hidden">{feature.weapon_features.name}</span>
                                    </Button>
                                  </OverlayTrigger>
                                ))}
                              </div>
                            )}

                            {vehicle_weapon.type === "cannon" ? (
                              <div className="game-unit_chars fs-6 mt-2">
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                                    <span className="fw-bold">Ammunition</span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.ammo_quantity} rounds</span>
                                  </div>

                                  <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                                    <span>First-order</span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.first_order_ammo} rounds</span>
                                  </div>
                                </div>
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                                    <span className="fw-bold">Reload</span>
                                    <span className="game-unit_chars-info small">basic crew → aces</span>
                                  </div>

                                  <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                                    <span></span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.reload_time_seconds} s</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="game-unit_chars mt-2 fs-6">
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                                    <span className="fw-bold">Ammunition</span>
                                    <span className="game-unit_chars-value">{numberWithCommas(vehicle_weapon.ammo_quantity)} rounds</span>
                                  </div>

                                  <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                                    <span>Belt capacity</span>
                                    <span className="game-unit_chars-value">{numberWithCommas(vehicle_weapon.belt_capacity)} rounds</span>
                                  </div>
                                </div>
                                <div className="game-unit_chars-block">
                                  <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                                    <span className="fw-bold">Reload</span>
                                    <span className="game-unit_chars-info small">basic crew → aces</span>
                                  </div>

                                  <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                                    <span></span>
                                    <span className="game-unit_chars-value">{vehicle_weapon.reload_time_seconds} s</span>
                                  </div>

                                  <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                                    <span>Fire rate</span>
                                    <span className="game-unit_chars-value">{numberWithCommas(vehicle_weapon.fire_rate_rpm)} shots/min</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="game-unit_belts mt-2">
                              <Accordion className="fs-6">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header>{vehicle_weapon.type === "cannon" ? "Available ammunition" : "Available belts"}</Accordion.Header>
                                  <Accordion.Body className="p-0">
                                    <Table className="game-unit_belt-list w-100 text-center m-0">
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
                                            {vehicle_weapon.vehicle_ammunition.length > 0 ? (
                                              <>
                                                {vehicle_weapon.vehicle_ammunition.map((ammo: any) => (
                                                  <tr key={ammo.id}>
                                                    <td className="p-0 align-content-center d-flex border-0">
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
                                                          className="border-0 text-light d-inline-flex align-items-center column-gap-2"
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
                                                          <span className="shell-designation underline-dotted">{ammo.ammunition.designation}</span>
                                                        </Button>
                                                      </OverlayTrigger>
                                                    </td>
                                                    <td className="shell-variant py-1 px-0 align-content-center">{ammo.ammunition.variant}</td>
                                                    <td className="shell-pen py-1 px-0 align-content-center">{ammo.penetration_mm}</td>
                                                  </tr>
                                                ))}
                                              </>
                                            ) : (
                                              <span className="">No ammunition</span>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {vehicle_weapon.vehicle_belts.map((belt: any) => {
                                              const beltKey = `${vehicle_weapon.id}-${belt.belt_id}`;

                                              return (
                                                <tr key={beltKey} className={belt.belt_id}>
                                                  <td className="py-1 px-0 align-content-center d-flex border-0">
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
                                                        <span className="belt-name underline-dotted">{belt.belt.name}</span>
                                                      </Button>
                                                    </OverlayTrigger>
                                                  </td>
                                                  <td className="belt-filling py-1 px-0 align-content-center">{belt.belt.belt_filling}</td>
                                                  <td className="belt-pen py-1 px-0 align-content-center">{belt.belt.max_penetration_mm}</td>
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
              </>
            )}
          </div>

          <div className="game-unit_data-specification position-relative w-100">
            <div id="specification">
              {vehicle.vehicle_armour && (
                <>
                  <Card className="mb-3 border-0 w-100">
                    <Card.Header className="fs-6 fw-semibold">Survivability and armour</Card.Header>

                    <Card.Body className="pt-2 fs-6">
                      {vehicle.vehicle_armour.vehicle_armour_features.length > 0 && (
                        <div className="game-unit_features d-grid gap-1 mt-1 mb-2">
                          {vehicle.vehicle_armour.vehicle_armour_features.map((feature: any) => (
                            <OverlayTrigger
                              key={feature.armour_features.id}
                              trigger="click"
                              placement="auto"
                              show={activeFeatureId === feature.armour_features.id}
                              rootClose
                              onToggle={(nextShow) => {
                                if (!nextShow && activeFeatureId === feature.armour_features.id) {
                                  setActiveFeatureId(null);
                                }
                              }}
                              overlay={FeaturePopover(feature.armour_features)}
                            >
                              <Button
                                variant="transparent"
                                className="game-unit_feature d-flex align-items-center border-secondary gap-2 overflow-hidden"
                                onClick={() => setActiveFeatureId((current) => current === feature.armour_features.id ? null : feature.armour_features.id)}
                                aria-label={`Show details for ${feature.armour_features.name}`}
                              >
                                <div className="icon">{getFeatureIcons(feature.armour_features.id)}</div>

                                <span className="small overflow-hidden">{feature.armour_features.name}</span>
                              </Button>
                            </OverlayTrigger>
                          ))}
                        </div>
                      )}

                      <div className="game-unit_chars fs-6">
                        <div className="game-unit_chars-block">
                          <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                            <span className="game-unit_chars-header fw-bold">Armour</span>
                            <span className="game-unit_chars-value small">front / side / back</span>
                          </div>

                          <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                            <span>Hull</span>
                            <span className="game-unit_chars-value">{vehicle.vehicle_armour.hull_armour_mm.join(' / ')} mm</span>
                          </div>

                          <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                            <span>Turret</span>
                            <span className="game-unit_chars-value">{vehicle.vehicle_armour.turret_armour_mm.join(' / ')} mm</span>
                          </div>
                        </div>
                        <div className="game-unit_chars-block">
                          <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                            <span className="game-unit_chars-header fw-bold">Crew</span>
                            <span className="game-unit_chars-value">{vehicle.crew} persons</span>
                          </div>
                        </div>
                      </div>

                      {vehicle.vehicle_armour.vehicle_support_systems.length > 0 && (
                        <>
                          <div className="mt-3 text-muted small">Support systems</div>
                          <div className="game-unit_features d-grid gap-1">
                            {vehicle.vehicle_armour.vehicle_support_systems.map((feature: any) => (
                              <OverlayTrigger
                                key={feature.support_systems.id}
                                trigger="click"
                                placement="auto"
                                show={activeFeatureId === feature.support_systems.id}
                                rootClose
                                onToggle={(nextShow) => {
                                  if (!nextShow && activeFeatureId === feature.support_systems.id) {
                                    setActiveFeatureId(null);
                                  }
                                }}
                                overlay={FeaturePopover(feature)}
                              >
                                <Button
                                  variant="transparent"
                                  className="game-unit_feature d-flex align-items-center border-secondary gap-2 overflow-hidden"
                                  onClick={() => setActiveFeatureId((current) => current === feature.support_systems.id ? null : feature.support_systems.id)}
                                  aria-label={`Show details for ${feature.support_systems.name}`}
                                >
                                  <div className="icon">{getFeatureIcons(feature.support_systems.id)}</div>

                                  <span className="small overflow-hidden">{feature.support_systems.name}</span>
                                </Button>
                              </OverlayTrigger>
                            ))}
                          </div>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </>
              )}

              {vehicle.vehicle_mobility && (
                <>
                  <Card className="mb-3 border-0 w-100">
                    <Card.Header className="fs-6 fw-semibold">Mobility</Card.Header>

                    <Card.Body className="pt-2 fs-6">
                      {vehicle.vehicle_mobility.features && (
                        <div className="game-unit_features d-grid gap-1 mt-1 mb-2">
                          {vehicle.vehicle_mobility.features.map((feature: any) => (
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
                                className="game-unit_feature d-flex align-items-center border-secondary gap-2 overflow-hidden"
                                onClick={() => setActiveFeatureId((current) => current === feature.id ? null : feature.id)}
                                aria-label={`Show details for ${feature.name}`}
                              >
                                <div className="icon">{getFeatureIcons(feature.id)}</div>

                                <span className="small overflow-hidden">{feature.name}</span>
                              </Button>
                            </OverlayTrigger>
                          ))}
                        </div>
                      )}

                      <div className="game-unit_chars fs-6">
                        <div className="game-unit_chars-block">
                          <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                            <span className="game-unit_chars-header fw-bold">Max speed</span>
                          </div>

                          <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                            <span>Forward</span>
                            <span className="game-unit_chars-value">{vehicle.vehicle_mobility.max_speed_fwd} km/h</span>
                          </div>

                          <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                            <span>Backward</span>
                            <span className="game-unit_chars-value">{vehicle.vehicle_mobility.max_speed_bwd} km/h</span>
                          </div>
                        </div>

                        <div className="game-unit_chars-block">
                          <div className="game-unit_chars-line d-flex align-items-center justify-content-between gap-1 mb-1 pb-1">
                            <span className="game-unit_chars-header fw-bold">Power-to-weight ratio</span>
                            <span className="game-unit_chars-value">{vehicle.vehicle_mobility.ptw_ratio_hp_t} hp/t</span>
                          </div>

                          <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                            <span>Engine power</span>
                            <span className="game-unit_chars-value">{vehicle.vehicle_mobility.engine_power_hp} hp</span>
                          </div>

                          <div className="game-unit_chars-subline d-flex align-items-center justify-content-between gap-1 mb-1 pb-1 ps-3">
                            <span>Weight</span>
                            <span className="game-unit_chars-value">{vehicle.vehicle_mobility.weight_t} t</span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </>
              )}

              {vehicle.vehicle_optics.length > 0 && (
                <>
                  <Card className="mb-3 border-0 w-100">
                    <Card.Header className="fs-6 fw-semibold">Optics</Card.Header>

                    <Card.Body className="pt-2 fs-6">
                      {vehicle.vehicle_optics_features && (
                        <div className="game-unit_features d-grid gap-1 mt-1 mb-2">
                          {vehicle.vehicle_optics_features.map((feature: any) => (
                            <OverlayTrigger
                              key={`${feature.optics_features.id}-${feature.id}`}
                              trigger="click"
                              placement="auto"
                              show={activeFeatureId === `${feature.optics_features.id}-${feature.id}`}
                              rootClose
                              onToggle={(nextShow) => {
                                if (!nextShow && activeFeatureId === `${feature.optics_features.id}-${feature.id}`) {
                                  setActiveFeatureId(null);
                                }
                              }}
                              overlay={FeaturePopover(feature.optics_features)}
                            >
                              <Button
                                variant="transparent"
                                className="game-unit_feature d-flex align-items-center border-secondary gap-2 overflow-hidden"
                                onClick={() => setActiveFeatureId((current) => current === `${feature.optics_features.id}-${feature.id}` ? null : `${feature.optics_features.id}-${feature.id}`)}
                                aria-label={`Show details for ${feature.optics_features.name}`}
                              >
                                <div className="icon">{getFeatureIcons(feature.optics_features.id)}</div>

                                <span className="small overflow-hidden">{feature.optics_features.name}</span>
                              </Button>
                            </OverlayTrigger>
                          ))}
                        </div>
                      )}

                      <div className="gunit_specs-table d-grid overflow-x-auto">
                        <div className="gunit_specs-table_row d-flex gap-1 text-center pb-1">
                          {vehicle.vehicle_optics.map((optic: any) => (
                            <div key={optic.id} className="flex-grow-1 flex-shrink-1">{optic.crew_member}</div>
                          ))}
                        </div>

                        <div className="my-1 text-muted small">Optics zoom</div>

                        <div className="gunit_specs-table_row d-flex gap-1 text-center pb-1">
                          {vehicle.vehicle_optics.map((optic: any) => (
                            <div key={optic.id} className="flex-grow-1 flex-shrink-1">{optic.optics_zoom ? optic.optics_zoom : '-'}</div>
                          ))}
                        </div>

                        <div className="my-1 text-muted small">Optical device</div>

                        <div className="gunit_specs-table_row d-flex gap-1 text-center pb-1">
                          {vehicle.vehicle_optics.map((optic: any) => (
                            <div key={`${optic.optical_device.id}_${optic.id}`} className="flex-grow-1 flex-shrink-1 d-flex justify-content-center">
                              <OverlayTrigger
                                trigger="click"
                                placement="auto"
                                show={activeFeatureId === `${optic.optical_device_id}-${optic.id}`}
                                rootClose
                                onToggle={(nextShow) => {
                                  if (!nextShow && activeFeatureId === `${optic.optical_device_id}-${optic.id}`) {
                                    setActiveFeatureId(null);
                                  }
                                }}
                                overlay={OpticalDevicePopover(optic)}
                              >
                                <Button
                                  variant="transparent"
                                  className="gunit_specs-table_btn d-flex align-items-center border-0 overflow-hidden"
                                  onClick={() => setActiveFeatureId((current) => current === `${optic.optical_device_id}-${optic.id}` ? null : `${optic.optical_device_id}-${optic.id}`)}
                                  aria-label={`Show details for ${optic.optical_device.name}`}
                                >
                                  <span className="small overflow-hidden">{optic.optical_device.name}</span>
                                </Button>
                              </OverlayTrigger>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide className="border">
        <Toast.Header className="border-0 rounded-top">
          <span className="fw-bold me-auto text-danger-emphasis">You must be logged-in to like vehicles.</span>
        </Toast.Header>
        <AnimatedProgress duration={5000} />
      </Toast>
    </>
  )
}
