-- ==========================================
-- AGI HOST PORTAL SUPABASE SCHEMA
-- ==========================================

-- 1. Create Profiles Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('admin', 'host')) default 'host',
  family_name text,
  phone_number text,
  carrier text,
  sms_consent boolean default false
);

-- Disable Row Level Security (RLS) for initial MVP testing
alter table public.profiles disable row level security;

-- 2. Auth Trigger Handle (Automatically creates a profile upon sign-up)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, family_name)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'role', 'host'), 
    coalesce(new.raw_user_meta_data->>'family_name', 'Unnamed Family')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. Create Students Table
create table public.students (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  age integer,
  assigned_host_id uuid references public.profiles(id),
  status text check (status in ('pending', 'checked_in', 'checked_out')) default 'pending',
  last_action_time timestamp with time zone default timezone('utc'::text, now())
);
alter table public.students disable row level security;


-- 4. Create Announcements Table
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.announcements disable row level security;


-- 5. Create Messages Table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id),
  receiver_id uuid references public.profiles(id), -- If null, broadcasts
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.messages disable row level security;


-- ==========================================
-- ACTIVATE LIVE WEBSOCKET SUBSCRIPTIONS
-- ==========================================
-- This allows the front-end to listen to Check-In events and Chat Messages instantly!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.students;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.announcements;
