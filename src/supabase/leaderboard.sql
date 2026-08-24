create table public.ten_rooms_records (
  id bigint generated always as identity primary key,
  nickname text not null,
  nickname_key text generated always as (lower(btrim(nickname))) stored,
  game_version integer not null check (game_version between 1 and 3999),
  achieved_at timestamptz not null default timezone('utc', now()),
  floor integer not null check (floor between 1 and 9999),
  constraint ten_rooms_records_nickname_length
    check (char_length(btrim(nickname)) between 1 and 20),
  constraint ten_rooms_records_nickname_key_unique unique (nickname_key)
);

create index ten_rooms_records_ranking_idx
  on public.ten_rooms_records (floor desc, achieved_at asc);

alter table public.ten_rooms_records enable row level security;

revoke all on table public.ten_rooms_records from anon, authenticated;
grant select on table public.ten_rooms_records to anon, authenticated;

create policy "Public records are readable"
  on public.ten_rooms_records
  for select
  to anon, authenticated
  using (true);

create or replace function public.submit_ten_rooms_record(
  p_nickname text,
  p_game_version integer,
  p_floor integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_nickname text := btrim(p_nickname);
  v_saved boolean;
begin
  if v_nickname is null
     or char_length(v_nickname) not between 1 and 20
     or v_nickname ~ '[[:cntrl:]]'
     or p_game_version not between 1 and 3999
     or p_floor not between 1 and 9999 then
    return false;
  end if;

  insert into public.ten_rooms_records (nickname, game_version, floor)
  values (v_nickname, p_game_version, p_floor)
  on conflict (nickname_key) do update
    set nickname = excluded.nickname,
        game_version = excluded.game_version,
        achieved_at = timezone('utc', now()),
        floor = excluded.floor
    where excluded.floor > public.ten_rooms_records.floor
  returning true into v_saved;

  return coalesce(v_saved, false);
end;
$$;

revoke all on function public.submit_ten_rooms_record(text, integer, integer)
  from public;
grant execute on function public.submit_ten_rooms_record(text, integer, integer)
  to anon, authenticated;
