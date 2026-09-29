-- drop constraints
alter table public.vehicles
drop constraint if exists vehicles_class_id_fkey;

alter table public.vehicles
drop constraint if exists vehicles_vehicle_type_id_fkey;

-- links public.vehicles.vehicle_type_id to public.vehicle_types.id
alter table public.vehicles
add constraint vehicles_vehicle_type_id_fkey
foreign key (vehicle_type_id)
references public.vehicle_types(id);

-- links public.vehicles.nation_id to public.nations.id
alter table public.vehicles
add constraint vehicles_nations_id_fkey
foreign key (nation_id)
references public.nations(id);

-- links public.vehicles.operator_id to public.operators.id
alter table public.vehicles
add constraint vehicles_operator_id_fkey
foreign key (operator_id)
references public.operators(id);

-- links public.vehicles.status_id to public.vehicle_statuses.id
alter table public.vehicles
add constraint vehicles_status_id_fkey
foreign key (status_id)
references public.vehicle_statuses(id);

-- links public.vehicles.class_id to public.vehicle_classes.id
alter table public.vehicles
add constraint vehicles_class_id_fkey
foreign key (class_id)
references public.vehicle_classes(id);

-- links public.belt_ammunition.belt_id to public.belts.id
alter table public.belt_ammunition
add constraint belt_ammunition_belt_id_fkey
foreign key (belt_id)
references public.belts(id);

-- links public.belt_ammunition.ammunition_id to public.ammunition.id
alter table public.belt_ammunition
add constraint belt_ammunition_ammunition_id_fkey
foreign key (ammunition_id)
references public.ammunition(id);
