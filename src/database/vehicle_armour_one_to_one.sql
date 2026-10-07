-- A vehicle has at most one vehicle_armour row, so Supabase returns
-- vehicle_armour as an object instead of an array.
alter table public.vehicle_armour
add constraint vehicle_armour_vehicle_id_key unique (vehicle_id);