-- ============================================================
-- VEHICLES
-- ============================================================

create index idx_vehicles_nation_id
on public.vehicles(nation_id);

create index idx_vehicles_operator_id
on public.vehicles(operator_id);

create index idx_vehicles_vehicle_type_id
on public.vehicles(vehicle_type_id);

create index idx_vehicles_status_id
on public.vehicles(status_id);

create index idx_vehicles_class_id
on public.vehicles(class_id);


-- ============================================================
-- VEHICLE WEAPONS
-- ============================================================

create index idx_vehicle_weapons_vehicle_id
on public.vehicle_weapons(vehicle_id);

create index idx_vehicle_weapons_weapon_id
on public.vehicle_weapons(weapon_id);


-- ============================================================
-- WEAPON AMMUNITION
-- ============================================================

create index idx_weapon_ammunition_weapon_id
on public.weapon_ammunition(weapon_id);

create index idx_weapon_ammunition_ammunition_id
on public.weapon_ammunition(ammunition_id);


-- ============================================================
-- VEHICLE AMMUNITION
-- ============================================================

create index idx_vehicle_ammunition_vehicle_id
on public.vehicle_ammunition(vehicle_id);

create index idx_vehicle_ammunition_ammunition_id
on public.vehicle_ammunition(ammunition_id);


-- ============================================================
-- BELT AMMUNITION
-- ============================================================

create index idx_belt_ammunition_belt_id
on public.belt_ammunition(belt_id);

create index idx_belt_ammunition_ammunition_id
on public.belt_ammunition(ammunition_id);


-- ============================================================
-- VEHICLE BELTS
-- ============================================================

create index idx_vehicle_belts_vehicle_id
on public.vehicle_belts(vehicle_id);

create index idx_vehicle_belts_vehicle_weapon_id
on public.vehicle_belts(vehicle_weapon_id);

create index idx_vehicle_belts_belt_id
on public.vehicle_belts(belt_id);