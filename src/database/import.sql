-- drop existing table if exists
drop table if exists vehicles;

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