-- drop existing table if exists
drop table if exists vehicles;
drop table if exists armament;
drop table if exists shells;

-- Create the table
create table vehicles (
  id bigint primary key generated always as identity,
  vehicle_id text not null,
  name text not null,
  country text not null,
  operator text null,
  rank smallint not null,
  br_ab decimal(8, 1) not null,
  br_rb decimal(8, 1) not null,
  br_sb decimal(8,1) not null,
  class text not null,
  status text not null,
  nation text not null
);

-- Insert sample data into the table
insert into vehicles (vehicle_id, name, country, operator, rank, br_ab, br_rb, br_sb, class, status, nation)
values
  ('germ_pzkpfw_VI_ausf_b_tiger_IIh', 'Tiger II', 'Germany', null, 4, 7.0, 6.7, 6.7, 'heavy', 'techtree', 'ground'),
  ('germ_leopard_2pl', 'Leopard 2PL', 'Germany', 'Poland', 8, 12.3, 12.3, 12.3, 'medium', 'squadron', 'ground'),
  ('germ_leopard_2a4m_can', 'Leopard 2A4M', 'Germany', 'Canada (modern)', 7, 12.0, 12.0, 12.0, 'medium', 'premium', 'ground'),
  ('germ_leopard_2a5_yt_cup_2019', '␙Leopard 2A5', 'Germany', 'FRG', 8, 12.3, 12.3, 12.3, 'medium', 'event', 'ground'),
  ('f_16am_block_20_mlu_netherlands', '◘F-16AM', 'France', 'Netherlands', 8, 13.7, 13.7, 13.7, 'fighter', 'premium', 'aviation');
-- Grant the privileges the role needs, which is read access
grant select on public.vehicles to anon;
-- Enable row level security for the table
alter table vehicles enable row level security;
-- Create a policy to allow the anon role to read from the vehicles table
create policy "public can read vehicles"
on public.vehicles
for select to anon
using (true);


-- ============================================================
-- WAR THUNDER STYLE VEHICLE DATABASE
-- PostgreSQL / Supabase
--
-- Designed around the separation used by the datamine:
--
--   Vehicle .blkx
--       ↓
--   Weapon .blkx
--       ↓
--   Ammunition
--
-- while still allowing vehicle/weapon-specific ammo stats.
-- ============================================================


-- ============================================================
-- 0. CLEAN OLD SCHEMA
-- ============================================================

drop table if exists public.vehicle_ammunition cascade;
drop table if exists public.weapon_ammunition cascade;
drop table if exists public.vehicle_weapons cascade;
drop table if exists public.ammunition cascade;
drop table if exists public.weapons cascade;
drop table if exists public.vehicles cascade;
drop table if exists public.operators cascade;
drop table if exists public.nations cascade;
drop table if exists public.vehicle_types cascade;


-- ============================================================
-- 1. VEHICLE TYPES
-- ============================================================

create table public.vehicle_types (
    id text primary key,
    name text not null unique
);

insert into public.vehicle_types (id, name)
values
    ('ground', 'Ground vehicles'),
    ('air', 'Aviation'),
    ('helis', 'Helicopters'),
    ('ships', 'Bluewater Fleet'),
    ('boats', 'Coastal Fleet');


-- ============================================================
-- 2. NATIONS / TECH TREES
-- ============================================================

create table public.nations (
    id text primary key,
    name text not null unique
);


-- ============================================================
-- 3. OPERATORS
-- ============================================================

create table public.operators (
    id text primary key,
    name text not null unique
);


-- ============================================================
-- 4. VEHICLES
--
-- Represents the vehicle .blkx file.
--
-- Example:
--
-- germ_leopard_2a5
--
-- corresponds to:
--
-- germ_leopard_2a5.blkx
-- ============================================================

create table public.vehicles (
    id text primary key,

    name text not null,

    vehicle_type_id text
        references public.vehicle_types(id)
        on delete set null,

    nation_id text
        references public.nations(id)
        on delete set null,

    operator_id text
        references public.operators(id)
        on delete set null,

    rank integer,

    battle_rating_ab numeric(4,2),
    battle_rating_rb numeric(4,2),
    battle_rating_sb numeric(4,2),

    -- Original datamine file name/path
    datamine_file text,

    -- Optional version/commit information
    datamine_version text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- ============================================================
-- 5. WEAPONS
--
-- Represents a weapon .blkx file.
--
-- Example:
--
-- 120mm_rheinmetall_l44_2a5_user_cannon
-- ============================================================

create table public.weapons (
    id text primary key,

    name text not null,

    weapon_type text,

    caliber_mm numeric,

    -- Original datamine file
    datamine_file text,

    datamine_version text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- ============================================================
-- 6. VEHICLE ↔ WEAPON
--
-- This is the link found from the vehicle definition.
--
-- A vehicle can have multiple weapons.
--
-- Example:
--
-- Leopard 2A5
--   ├── main cannon
--   ├── coaxial MG
--   └── roof MG
--
-- vehicle_weapon_id is the specific installation/configuration
-- of a weapon on a vehicle.
-- ============================================================

create table public.vehicle_weapons (
    id bigint generated by default as identity primary key,

    vehicle_id text not null
        references public.vehicles(id)
        on delete cascade,

    weapon_id text not null
        references public.weapons(id)
        on delete cascade,

    role text,

    quantity integer not null default 1,

    -- Optional ordering
    slot integer,

    created_at timestamptz not null default now(),

    constraint vehicle_weapons_quantity_check
        check (quantity > 0),

    unique (
        vehicle_id,
        weapon_id,
        role,
        slot
    )
);


-- ============================================================
-- 7. AMMUNITION
--
-- Generic identity of the shell.
--
-- Example:
--
-- 120mm_dm53
--
-- Do NOT put vehicle-specific penetration here.
-- ============================================================

create table public.ammunition (
    id text primary key,

    designation text not null,

    category text,

    family text,

    variant text,

    damage_type text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- ============================================================
-- 8. WEAPON ↔ AMMUNITION
--
-- Represents ammunition available to a weapon definition.
--
-- Example:
--
-- 120mm_rheinmetall_l44_2a5
--      ├── DM33
--      ├── DM53
--      └── DM12
--
-- This is the generic weapon/ammunition relationship.
-- ============================================================

create table public.weapon_ammunition (
    id bigint generated by default as identity primary key,

    weapon_id text not null
        references public.weapons(id)
        on delete cascade,

    ammunition_id text not null
        references public.ammunition(id)
        on delete cascade,

    -- Optional ordering used by the game/data
    position integer,

    -- Whether this ammunition is available by default
    is_default boolean not null default false,

    -- Optional amount/capacity
    max_quantity integer,

    created_at timestamptz not null default now(),

    unique (
        weapon_id,
        ammunition_id
    )
);


-- ============================================================
-- 9. VEHICLE ↔ AMMUNITION
--
-- THIS TABLE IS FOR VEHICLE-SPECIFIC OVERRIDES.
--
-- Normally you get:
--
-- Vehicle
--   ↓
-- Weapon
--   ↓
-- Ammunition
--
-- But if the same ammunition behaves differently on different
-- vehicles/configurations, store the override here.
--
-- Example:
--
-- Leopard 2A5 + DM53
--     penetration = 623
--
-- Leopard 2A6 + DM53
--     penetration = 653
--
-- The ammunition remains the SAME ammunition.
-- ============================================================

create table public.vehicle_ammunition (
    id bigint generated by default as identity primary key,

    vehicle_weapon_id bigint not null
        references public.vehicle_weapons(id)
        on delete cascade,

    ammunition_id text not null
        references public.ammunition(id)
        on delete cascade,

    -- ========================================================
    -- Vehicle/configuration-specific values
    -- ========================================================

    armor_type text,

    damage_type text,

    caliber_mm numeric,

    projectile_mass_kg numeric,

    penetration_mm numeric,

    muzzle_velocity_ms numeric,

    -- Optional reload-related information
    reload_time_seconds numeric,

    -- Optional extra information
    notes text,

    created_at timestamptz not null default now(),

    unique (
        vehicle_weapon_id,
        ammunition_id
    )
);


-- ============================================================
-- 10. OPTIONAL BELTS
--
-- Useful for machine guns / autocannons.
-- ============================================================

create table public.belts (
    id text primary key,

    name text not null,

    description text,

    created_at timestamptz not null default now()
);


-- ============================================================
-- 11. BELT ↔ AMMUNITION
-- ============================================================

create table public.belt_ammunition (
    belt_id text not null
        references public.belts(id)
        on delete cascade,

    ammunition_id text not null
        references public.ammunition(id)
        on delete cascade,

    position integer not null,

    quantity integer not null default 1,

    primary key (
        belt_id,
        position
    ),

    constraint belt_position_check
        check (position > 0),

    constraint belt_quantity_check
        check (quantity > 0)
);


-- ============================================================
-- 12. WEAPON ↔ BELT
-- ============================================================

create table public.weapon_belts (
    weapon_id text not null
        references public.weapons(id)
        on delete cascade,

    belt_id text not null
        references public.belts(id)
        on delete cascade,

    primary key (
        weapon_id,
        belt_id
    )
);


-- ============================================================
-- 13. VEHICLE ↔ BELT
--
-- Allows a belt to be restricted to a particular vehicle.
-- ============================================================

create table public.vehicle_belts (
    vehicle_id text not null
        references public.vehicles(id)
        on delete cascade,

    belt_id text not null
        references public.belts(id)
        on delete cascade,

    primary key (
        vehicle_id,
        belt_id
    )
);


-- ============================================================
-- 14. INDEXES
-- ============================================================

create index idx_vehicles_type
    on public.vehicles(vehicle_type_id);

create index idx_vehicles_nation
    on public.vehicles(nation_id);

create index idx_vehicles_operator
    on public.vehicles(operator_id);


create index idx_vehicle_weapons_vehicle
    on public.vehicle_weapons(vehicle_id);

create index idx_vehicle_weapons_weapon
    on public.vehicle_weapons(weapon_id);


create index idx_weapon_ammunition_weapon
    on public.weapon_ammunition(weapon_id);

create index idx_weapon_ammunition_ammunition
    on public.weapon_ammunition(ammunition_id);


create index idx_vehicle_ammunition_vehicle_weapon
    on public.vehicle_ammunition(vehicle_weapon_id);

create index idx_vehicle_ammunition_ammunition
    on public.vehicle_ammunition(ammunition_id);


create index idx_belt_ammunition_ammunition
    on public.belt_ammunition(ammunition_id);

create index idx_weapon_belts_weapon
    on public.weapon_belts(weapon_id);

create index idx_vehicle_belts_vehicle
    on public.vehicle_belts(vehicle_id);


-- ============================================================
-- 15. UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;


create trigger vehicles_updated_at
before update on public.vehicles
for each row
execute function public.update_updated_at();


create trigger weapons_updated_at
before update on public.weapons
for each row
execute function public.update_updated_at();


create trigger ammunition_updated_at
before update on public.ammunition
for each row
execute function public.update_updated_at();


-- ============================================================
-- 16. ROW LEVEL SECURITY
--
-- Enabled but no policies are created.
-- Add policies when you expose the database to your frontend.
-- ============================================================

alter table public.vehicle_types enable row level security;

alter table public.nations enable row level security;

alter table public.operators enable row level security;

alter table public.vehicles enable row level security;

alter table public.weapons enable row level security;

alter table public.vehicle_weapons enable row level security;

alter table public.ammunition enable row level security;

alter table public.weapon_ammunition enable row level security;

alter table public.vehicle_ammunition enable row level security;

alter table public.belts enable row level security;

alter table public.belt_ammunition enable row level security;

alter table public.weapon_belts enable row level security;

alter table public.vehicle_belts enable row level security;