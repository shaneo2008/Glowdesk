-- GlowDesk multi-tenant schema (M1). RLS policies to be added alongside — every table
-- below MUST have RLS enabled with tenant isolation before M1 gate passes.

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- white-label branding
  brand_logo_path text,
  brand_primary_color text,
  data_retention_months int not null default 24,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users (id),
  tenant_id uuid not null references tenants (id),
  display_name text,
  role text not null default 'owner', -- staff roles post-pilot
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id),
  full_name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

-- Biometric consent: versioned, immutable, required before any scan.
create table consent_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id),
  client_id uuid not null references clients (id),
  consent_text_version text not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table consultations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id),
  client_id uuid not null references clients (id),
  practitioner_id uuid not null references users (id),
  notes text,
  follow_up_suggested_at date,
  created_at timestamptz not null default now()
);

create table scans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id),
  consultation_id uuid not null references consultations (id),
  consent_record_id uuid not null references consent_records (id),
  provider text not null,
  image_path text,                 -- nullable: raw image may be auto-deleted per retention policy
  overall_score numeric,
  skin_type text,
  estimated_skin_age int,
  concerns jsonb not null,         -- normalized ConcernScore[]
  raw_vendor_payload jsonb,        -- audit only
  created_at timestamptz not null default now()
);

create table recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id),
  consultation_id uuid not null references consultations (id),
  product_name text not null,
  reason text,
  price numeric,
  created_at timestamptz not null default now()
);
