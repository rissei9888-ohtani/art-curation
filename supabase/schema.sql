-- アーティストテーブル
create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  bio text,
  avatar_url text,
  website_url text,
  twitter_url text,
  instagram_url text,
  created_at timestamptz default now() not null
);

-- 作品テーブル
create table if not exists artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references artists(id) on delete cascade,
  title text,
  image_url text not null,
  description text,
  created_at timestamptz default now() not null
);

-- タグテーブル
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

-- 作品↔タグ 中間テーブル
create table if not exists artwork_tags (
  artwork_id uuid not null references artworks(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (artwork_id, tag_id)
);

-- お気に入りテーブル（将来的な拡張用）
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  artwork_id uuid not null references artworks(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique (user_id, artwork_id)
);

-- RLS（Row Level Security）設定
alter table artists enable row level security;
alter table artworks enable row level security;
alter table tags enable row level security;
alter table artwork_tags enable row level security;

-- 一般ユーザー：全件読み取り可
create policy "artists_public_read" on artists for select using (true);
create policy "artworks_public_read" on artworks for select using (true);
create policy "tags_public_read" on tags for select using (true);
create policy "artwork_tags_public_read" on artwork_tags for select using (true);

-- 認証済みユーザー（管理者）：全操作可
create policy "artists_auth_all" on artists for all using (auth.role() = 'authenticated');
create policy "artworks_auth_all" on artworks for all using (auth.role() = 'authenticated');
create policy "tags_auth_all" on tags for all using (auth.role() = 'authenticated');
create policy "artwork_tags_auth_all" on artwork_tags for all using (auth.role() = 'authenticated');

-- Storageバケット設定（Supabaseダッシュボードで実行）
-- insert into storage.buckets (id, name, public) values ('images', 'images', true);
-- create policy "images_public_read" on storage.objects for select using (bucket_id = 'images');
-- create policy "images_auth_upload" on storage.objects for insert using (auth.role() = 'authenticated' and bucket_id = 'images');
-- create policy "images_auth_delete" on storage.objects for delete using (auth.role() = 'authenticated' and bucket_id = 'images');

-- サンプルタグ（任意）
insert into tags (name, slug) values
  ('油絵', 'oil-painting'),
  ('水彩', 'watercolor'),
  ('デジタル', 'digital'),
  ('イラスト', 'illustration'),
  ('抽象', 'abstract'),
  ('人物', 'portrait'),
  ('風景', 'landscape'),
  ('アニメ', 'anime')
on conflict do nothing;
