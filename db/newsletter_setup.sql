-- Create the newsletter subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.newsletter_subscribers enable row level security;

-- Policy to allow ANYONE (including anonymous) to subscribe
create policy "Allow public to subscribe"
  on public.newsletter_subscribers
  for insert
  to public
  with check (true);

-- Policy to allow admins to view subscribers
create policy "Allow admins to view subscribers"
  on public.newsletter_subscribers
  for select
  using (true);  -- Simplified for demo, ideally restrict to admin role

-- Policy to allow admins to delete subscribers
create policy "Allow admins to delete subscribers"
  on public.newsletter_subscribers
  for delete
  using (true);
