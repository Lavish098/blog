create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  username text not null default '',
  email text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  html text not null,
  cover_image_url text not null default '',
  cover_image_path text not null default '',
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'username', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
on public.profiles for select
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Posts are readable by everyone" on public.posts;
create policy "Posts are readable by everyone"
on public.posts for select
using (true);

drop policy if exists "Admins can create posts" on public.posts;
create policy "Admins can create posts"
on public.posts for insert
with check (public.is_admin());

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
on public.posts for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
on public.posts for delete
using (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('post-covers', 'post-covers', true),
  ('post-images', 'post-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public post covers are readable" on storage.objects;
create policy "Public post covers are readable"
on storage.objects for select
using (bucket_id = 'post-covers');

drop policy if exists "Public post images are readable" on storage.objects;
create policy "Public post images are readable"
on storage.objects for select
using (bucket_id = 'post-images');

drop policy if exists "Admins can upload post covers" on storage.objects;
create policy "Admins can upload post covers"
on storage.objects for insert
with check (bucket_id = 'post-covers' and public.is_admin());

drop policy if exists "Admins can upload post images" on storage.objects;
create policy "Admins can upload post images"
on storage.objects for insert
with check (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "Admins can update post files" on storage.objects;
create policy "Admins can update post files"
on storage.objects for update
using (bucket_id in ('post-covers', 'post-images') and public.is_admin())
with check (bucket_id in ('post-covers', 'post-images') and public.is_admin());

drop policy if exists "Admins can delete post files" on storage.objects;
create policy "Admins can delete post files"
on storage.objects for delete
using (bucket_id in ('post-covers', 'post-images') and public.is_admin());
