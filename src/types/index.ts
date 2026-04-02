export type Artist = {
  id: string
  name: string
  name_en: string | null
  bio: string | null
  avatar_url: string | null
  website_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  created_at: string
  artworks?: Artwork[]
}

export type Artwork = {
  id: string
  artist_id: string
  title: string | null
  image_url: string
  description: string | null
  created_at: string
  artist?: Artist
  tags?: Tag[]
}

export type Tag = {
  id: string
  name: string
  slug: string
}

export type ArtworkTag = {
  artwork_id: string
  tag_id: string
}

export type Favorite = {
  id: string
  user_id: string
  artwork_id: string
  created_at: string
}
