-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table public.nations enable row level security;
alter table public.operators enable row level security;
alter table public.vehicle_types enable row level security;
alter table public.vehicle_statuses enable row level security;
alter table public.vehicle_classes enable row level security;

alter table public.vehicles enable row level security;

alter table public.weapons enable row level security;
alter table public.ammunition enable row level security;

alter table public.vehicle_weapons enable row level security;
alter table public.weapon_ammunition enable row level security;
alter table public.vehicle_ammunition enable row level security;

alter table public.belts enable row level security;
alter table public.belt_ammunition enable row level security;
alter table public.vehicle_belts enable row level security;

-- ============================================================
-- NATIONS
-- ============================================================

create policy "Public read nations"
on public.nations
for select
to anon, authenticated
using (true);


-- ============================================================
-- OPERATORS
-- ============================================================

create policy "Public read operators"
on public.operators
for select
to anon, authenticated
using (true);


-- ============================================================
-- VEHICLE TYPES
-- ============================================================

create policy "Public read vehicle types"
on public.vehicle_types
for select
to anon, authenticated
using (true);


-- ============================================================
-- VEHICLE STATUSES
-- ============================================================

create policy "Public read vehicle statuses"
on public.vehicle_statuses
for select
to anon, authenticated
using (true);


-- ============================================================
-- VEHICLE CLASSES
-- ============================================================

create policy "Public read vehicle classes"
on public.vehicle_classes
for select
to anon, authenticated
using (true);


-- ============================================================
-- VEHICLES
-- ============================================================

create policy "Public read vehicles"
on public.vehicles
for select
to anon, authenticated
using (true);


-- ============================================================
-- WEAPONS
-- ============================================================

create policy "Public read weapons"
on public.weapons
for select
to anon, authenticated
using (true);


-- ============================================================
-- AMMUNITION
-- ============================================================

create policy "Public read ammunition"
on public.ammunition
for select
to anon, authenticated
using (true);


-- ============================================================
-- VEHICLE WEAPONS
-- ============================================================

create policy "Public read vehicle weapons"
on public.vehicle_weapons
for select
to anon, authenticated
using (true);


-- ============================================================
-- WEAPON AMMUNITION
-- ============================================================

create policy "Public read weapon ammunition"
on public.weapon_ammunition
for select
to anon, authenticated
using (true);


-- ============================================================
-- VEHICLE AMMUNITION
-- ============================================================

create policy "Public read vehicle ammunition"
on public.vehicle_ammunition
for select
to anon, authenticated
using (true);


-- ============================================================
-- BELTS
-- ============================================================

create policy "Public read belts"
on public.belts
for select
to anon, authenticated
using (true);


-- ============================================================
-- BELT AMMUNITION
-- ============================================================

create policy "Public read belt ammunition"
on public.belt_ammunition
for select
to anon, authenticated
using (true);


-- ============================================================
-- VEHICLE BELTS
-- ============================================================

create policy "Public read vehicle belts"
on public.vehicle_belts
for select
to anon, authenticated
using (true);