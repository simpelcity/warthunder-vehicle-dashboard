-- ============================================================
-- VEHICLES
-- ============================================================

alter table public.vehicles
add constraint vehicles_vehicle_type_id_fkey
foreign key (vehicle_type_id)
references public.vehicle_types(id)
on delete restrict;


alter table public.vehicles
add constraint vehicles_nation_id_fkey
foreign key (nation_id)
references public.nations(id)
on delete restrict;


alter table public.vehicles
add constraint vehicles_operator_id_fkey
foreign key (operator_id)
references public.operators(id)
on delete restrict;


alter table public.vehicles
add constraint vehicles_status_id_fkey
foreign key (status_id)
references public.vehicle_statuses(id)
on delete restrict;


alter table public.vehicles
add constraint vehicles_class_id_fkey
foreign key (class_id)
references public.vehicle_classes(id)
on delete restrict;


-- ============================================================
-- VEHICLE WEAPONS
-- ============================================================

alter table public.vehicle_weapons
add constraint vehicle_weapons_vehicle_id_fkey
foreign key (vehicle_id)
references public.vehicles(id)
on delete cascade;


alter table public.vehicle_weapons
add constraint vehicle_weapons_weapon_id_fkey
foreign key (weapon_id)
references public.weapons(id)
on delete restrict;


-- ============================================================
-- WEAPON AMMUNITION
-- ============================================================

alter table public.weapon_ammunition
add constraint weapon_ammunition_weapon_id_fkey
foreign key (weapon_id)
references public.weapons(id)
on delete cascade;


alter table public.weapon_ammunition
add constraint weapon_ammunition_ammunition_id_fkey
foreign key (ammunition_id)
references public.ammunition(id)
on delete restrict;


-- ============================================================
-- VEHICLE AMMUNITION
-- ============================================================

alter table public.vehicle_ammunition
add constraint vehicle_ammunition_vehicle_id_fkey
foreign key (vehicle_id)
references public.vehicles(id)
on delete cascade;


alter table public.vehicle_ammunition
add constraint vehicle_ammunition_ammunition_id_fkey
foreign key (ammunition_id)
references public.ammunition(id)
on delete restrict;


-- ============================================================
-- BELT AMMUNITION
-- ============================================================

alter table public.belt_ammunition
add constraint belt_ammunition_belt_id_fkey
foreign key (belt_id)
references public.belts(id)
on delete cascade;


alter table public.belt_ammunition
add constraint belt_ammunition_ammunition_id_fkey
foreign key (ammunition_id)
references public.ammunition(id)
on delete restrict;


-- ============================================================
-- VEHICLE BELTS
-- ============================================================

alter table public.vehicle_belts
add constraint vehicle_belts_vehicle_id_fkey
foreign key (vehicle_id)
references public.vehicles(id)
on delete cascade;


alter table public.vehicle_belts
add constraint vehicle_belts_vehicle_weapon_id_fkey
foreign key (vehicle_weapon_id)
references public.vehicle_weapons(id)
on delete cascade;


alter table public.vehicle_belts
add constraint vehicle_belts_belt_id_fkey
foreign key (belt_id)
references public.belts(id)
on delete cascade;


-- ============================================================
-- UNIQUE CONSTRAINTS
-- ============================================================

-- Don't add the same weapon twice to the same vehicle
alter table public.vehicle_weapons
add constraint vehicle_weapons_unique
unique (vehicle_id, weapon_id, type);


-- Don't add the same generic ammunition to a weapon twice
alter table public.weapon_ammunition
add constraint weapon_ammunition_unique
unique (weapon_id, ammunition_id);


-- Don't add the same vehicle ammunition configuration twice
alter table public.vehicle_ammunition
add constraint vehicle_ammunition_unique
unique (vehicle_id, ammunition_id);


-- Don't add the same ammunition to the same belt at the
-- same position
alter table public.belt_ammunition
add constraint belt_ammunition_unique_position
unique (belt_id, position);


-- Don't assign the same belt to the same weapon twice
alter table public.vehicle_belts
add constraint vehicle_belts_unique
unique (vehicle_id, vehicle_weapon_id, belt_id);