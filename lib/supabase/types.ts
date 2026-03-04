export type Position = 'GK' | 'DEF' | 'MID' | 'FWD' | 'STAFF'
export type NewsCategory = 'club' | 'team' | 'youth'

export interface Player {
  id: string
  name: string
  name_th: string | null
  number: number | null
  position: Position
  nationality: string | null
  image_url: string | null
  bio: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface News {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_url: string | null
  category: NewsCategory
  published_at: string
  created_at: string
}

export interface Match {
  id: string
  opponent: string
  opponent_logo: string | null
  match_date: string
  venue: string | null
  competition: string | null
  is_home: boolean
  home_score: number | null
  away_score: number | null
  created_at: string
}

export interface Standing {
  id: string
  season: string
  team_name: string
  logo_url: string | null
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  points: number
  sort_order: number
}

export interface Sponsor {
  id: string
  name: string
  logo_url: string | null
  website: string | null
  sort_order: number
}

export interface Honour {
  id: string
  year: string
  title: string
  sort_order: number
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  image_url: string | null
  badge: string | null
  is_active: boolean
  sort_order: number
}

export interface ClubSetting {
  id: string
  key: string
  value: string
}
