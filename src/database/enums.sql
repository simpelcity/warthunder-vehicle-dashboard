-- ============================================================
-- ENUM TYPES
-- ============================================================

create type public.shell_category as enum(
  'Kinetic',
  'Chemical'
);

create type public.shell_family as enum(
  'Solid-AP',
  'HE-filled-AP',
  'Sub-caliber-AP',
  'High-Explosive',
  'HEAT',
  'Guided-Missiles'
);

create type public.shell_variant as enum(
  'AP',
  'APC',
  'APBC',
  'APCBC',
  'APHE',
  'APHEBC',
  'AC',
  'SAP',
  'SAPCBC',
  'SAPHEI',
  'SAPHECBC',
  'APCR',
  'APDS',
  'APFSDS',
  'HE',
  'HE-TF',
  'HE-VT',
  'HE-OR',
  'HE-Grenade',
  'VOG',
  'Rocket',
  'HESH',
  'Smoke',
  'Shrapnel',
  'AHEAD',
  'HEAT',
  'HEATFS',
  'HEAT MP',
  'HEAT-Grenade',
  'ATGM',
  'ATGM-OTA',
  'ATGM-VT',
  'ATGM-Tandem',
  'ATGM-HE',
  'API-T',
  'HEI-T',
  'HEFI-T',
  'HVAP-T',
  'FI-T',
  'AP-T',
  'HEF-T',
  'HVAP',
  'AP-I',
  'T'
);

create type public.shell_explosive_type as enum(
  'TNT',
  'Pentolite',
  'Smoke composition',
  'Exp. D',
  'Composition B',
  'Comp. A',
  'A-IX-1',
  'A-IX-2',
  'PAX-3',
  'CLX663',
  'LX-14',
  'Octol',
  'Fp.02',
  'H.5',
  'Fp.02 and Np.10',
  'PH-Salz and H.10',
  'OKFOL',
  'RDX/TNT',
  'Amatol',
  'PETN',
  'Np.10',
  'Hexal',
  'H.10',
  'Fp.60/40',
  'Fp.10 and Np.10',
  'Comp.B, mod.',
  'DHL-1',
  'HMX',
  'JH-2',
  'JHL-2',
  'JHL-3',
  'Lyddite',
  'Melinite',
  'Oshiyaku',
  'Picric acid',
  'Picric acid/TNT 34/66',
  'RDX',
  'RDX/PWX',
  'Shimose',
  'Torpex',
  'Type 91'
);

create type public.atgm_guidance as enum(
  'Semi-Automatic (SACLOS)',
  'Beam riding',
  'IR',
  'Manual (MCLOS)'
);

create type public.armor_type as enum(
  'armor_vsmall',
  'armor_small',
  'armor_middle',
  'armor_big'
);

create type public.damage_type as enum(
  'damage_small',
  'damage',
  'explosion_small',
  'explosion_middle',
  'explosion_big'
);

create type public.vehicle_rank as enum(
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8'
);

create type public.vehicle_br as enum(
  '1.0',
  '1.3',
  '1.7',
  '2.0',
  '2.3',
  '2.7',
  '3.0',
  '3.3',
  '3.7',
  '4.0',
  '4.3',
  '4.7',
  '5.0',
  '5.3',
  '5.7',
  '6.0',
  '6.3',
  '6.7',
  '7.0',
  '7.3',
  '7.7',
  '8.0',
  '8.3',
  '8.7',
  '9.0',
  '9.3',
  '9.7',
  '10.0',
  '10.3',
  '10.7',
  '11.0',
  '11.3',
  '11.7',
  '12.0',
  '12.3',
  '12.7',
  '13.0',
  '13.3',
  '13.7',
  '14.0',
  '14.3',
  '14.7'
);

create type public.vehicle_class_id as enum(
  'bomber',
  'fighter',
  'heavy',
  'light',
  'medium',
  'spaa',
  'spg',
  'strike'
);

create type public.vehicle_status_id as enum(
  'event',
  'premium',
  'squadron',
  'techtree'
);

create type public.vehicle_type_id as enum(
  'air',
  'boats',
  'ground',
  'helis',
  'ships'
);
