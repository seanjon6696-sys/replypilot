-- Run this once in Supabase > SQL Editor > New query > Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text unique,
  usage_count integer not null default 0,
  usage_period text not null default to_char(now(), 'YYYY-MM'),
  business_name text,
  business_type text,
  signoff text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Signed-in users can read their own row.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Signed-in users can edit only their business details (plan/usage are changed by the server).
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id);

revoke update on public.profiles from authenticated;
grant update (business_name, business_type, signoff) on public.profiles to authenticated;

-- Create a profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
