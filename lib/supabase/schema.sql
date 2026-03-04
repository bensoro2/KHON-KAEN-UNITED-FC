-- =========================================
-- Khon Kaen United — Supabase Schema
-- Run this in Supabase SQL Editor
-- =========================================

-- Players / Staff
CREATE TABLE IF NOT EXISTS players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  name_th     TEXT,
  number      INTEGER,
  position    TEXT NOT NULL CHECK (position IN ('GK','DEF','MID','FWD','STAFF')),
  nationality TEXT DEFAULT 'Thailand',
  image_url   TEXT,
  bio         TEXT,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- News / Articles
CREATE TABLE IF NOT EXISTS news (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  content      TEXT,
  excerpt      TEXT,
  cover_url    TEXT,
  category     TEXT NOT NULL DEFAULT 'club' CHECK (category IN ('club','team','youth')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Matches (upcoming + results)
CREATE TABLE IF NOT EXISTS matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opponent      TEXT NOT NULL,
  opponent_logo TEXT,
  match_date    TIMESTAMPTZ NOT NULL,
  venue         TEXT,
  competition   TEXT DEFAULT 'Thai League 1',
  is_home       BOOLEAN DEFAULT true,
  home_score    INTEGER,
  away_score    INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- League Standings
CREATE TABLE IF NOT EXISTS standings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season     TEXT NOT NULL DEFAULT '2025',
  team_name  TEXT NOT NULL,
  logo_url   TEXT,
  played     INTEGER DEFAULT 0,
  won        INTEGER DEFAULT 0,
  drawn      INTEGER DEFAULT 0,
  lost       INTEGER DEFAULT 0,
  gf         INTEGER DEFAULT 0,
  ga         INTEGER DEFAULT 0,
  points     INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

-- Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  logo_url   TEXT,
  website    TEXT,
  sort_order INTEGER DEFAULT 0
);

-- =========================================
-- Row Level Security
-- =========================================

ALTER TABLE players   ENABLE ROW LEVEL SECURITY;
ALTER TABLE news      ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches   ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors  ENABLE ROW LEVEL SECURITY;

-- Public can read all
CREATE POLICY "Public read players"   ON players   FOR SELECT USING (true);
CREATE POLICY "Public read news"      ON news      FOR SELECT USING (true);
CREATE POLICY "Public read matches"   ON matches   FOR SELECT USING (true);
CREATE POLICY "Public read standings" ON standings FOR SELECT USING (true);
CREATE POLICY "Public read sponsors"  ON sponsors  FOR SELECT USING (true);

-- Authenticated (admin) can do anything
CREATE POLICY "Auth all players"   ON players   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all news"      ON news      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all matches"   ON matches   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all standings" ON standings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all sponsors"  ON sponsors  FOR ALL USING (auth.role() = 'authenticated');

-- Honours / Trophies
CREATE TABLE IF NOT EXISTS honours (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year       TEXT NOT NULL,
  title      TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Shop Products
CREATE TABLE IF NOT EXISTS products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  price      INTEGER NOT NULL,
  category   TEXT NOT NULL,
  image_url  TEXT,
  badge      TEXT,
  is_active  BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Club Settings (key-value สำหรับข้อมูลสโมสร)
CREATE TABLE IF NOT EXISTS club_settings (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key   TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- Default club settings
INSERT INTO club_settings (key, value) VALUES
  ('founded',          '2014'),
  ('colors',           'แดง & ดำ'),
  ('league',           'Thai League'),
  ('nickname',         'งูเห่าสายฟ้า'),
  ('stadium_name',     'สนามกีฬากลางจังหวัดขอนแก่น'),
  ('stadium_location', 'ขอนแก่น, ประเทศไทย'),
  ('stadium_capacity', '20,000 ที่นั่ง'),
  ('stadium_image',    ''),
  ('history',          'สโมสรฟุตบอลขอนแก่น ยูไนเต็ด ก่อตั้งขึ้นด้วยความมุ่งมั่นที่จะพัฒนาวงการฟุตบอลในจังหวัดขอนแก่นและภาคตะวันออกเฉียงเหนือของประเทศไทย ภายใต้สัญลักษณ์งูเห่าอันทรงพลัง'),
  ('contact_email',    'info@kkufc.com'),
  ('shop_email',       'shop@kkufc.com')
ON CONFLICT (key) DO NOTHING;

-- RLS for new tables
ALTER TABLE honours       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read honours"       ON honours       FOR SELECT USING (true);
CREATE POLICY "Public read products"      ON products      FOR SELECT USING (true);
CREATE POLICY "Public read club_settings" ON club_settings FOR SELECT USING (true);

CREATE POLICY "Auth all honours"       ON honours       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all products"      ON products      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all club_settings" ON club_settings FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- Storage Bucket: "uploads" (bucket เดียว จัดโครงสร้างด้วย folder path)
-- =========================================
-- วิธีสร้างใน Supabase Dashboard:
--   Storage → New bucket → Name: "uploads" → Public bucket: ON
--
-- หรือรัน SQL นี้:

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: ทุกคนอ่านได้ (public)
CREATE POLICY "Public read uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

-- Policy: เฉพาะ authenticated upload/delete ได้
CREATE POLICY "Auth upload uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update uploads"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete uploads"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- โครงสร้าง folder ใน bucket "uploads":
--   uploads/news/       → รูปข่าว
--   uploads/players/    → รูปผู้เล่น
--   uploads/logos/      → โลโก้คู่แข่ง
--   uploads/products/   → รูปสินค้า
--   uploads/general/    → รูปสนาม, รูปทั่วไป
