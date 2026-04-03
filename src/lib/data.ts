/**
 * データアクセス層
 *
 * NEXT_PUBLIC_USE_MOCK=true の場合はモックデータを返す。
 * それ以外は Supabase から取得する。
 */

import type { Artist, Artwork, Tag } from '@/types'
import {
  MOCK_TAGS,
  MOCK_ARTISTS,
  MOCK_FEED_ARTWORKS,
  MOCK_ADMIN_ARTISTS,
  getMockArtistArtworks,
  getMockArtworkWithTagJoin,
  type FeedArtwork,
  type ArtworkWithTagJoin,
  type AdminArtist,
} from './mock-data'

export type { FeedArtwork, ArtworkWithTagJoin, AdminArtist }

const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// -------- 公開ページ用 --------

/** タグ一覧を取得 */
export async function getTags(): Promise<Tag[]> {
  if (isMock) return MOCK_TAGS

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data } = await supabase.from('tags').select('*').order('name')
  return data ?? []
}

/** フィード用作品一覧を取得（タグスラグで絞り込み可） */
export async function getFeedArtworks(tagSlug?: string): Promise<FeedArtwork[]> {
  if (isMock) {
    if (!tagSlug) return MOCK_FEED_ARTWORKS
    return MOCK_FEED_ARTWORKS.filter((a) =>
      a.tags.some((t) => t.slug === tagSlug)
    )
  }

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()

  let query = supabase
    .from('artworks')
    .select(`*, artist:artists(*), tags:artwork_tags(tag:tags(*))`)
    .order('created_at', { ascending: false })

  if (tagSlug) {
    const { data: tagData } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagSlug)
      .single()

    if (tagData) {
      const { data: artworkTagData } = await supabase
        .from('artwork_tags')
        .select('artwork_id')
        .eq('tag_id', tagData.id)

      const artworkIds = artworkTagData?.map((at) => at.artwork_id) ?? []
      query = query.in('id', artworkIds)
    }
  }

  const { data: artworks } = await query
  if (!artworks) return []

  return artworks.map((artwork) => ({
    ...(artwork as Artwork),
    artist: artwork.artist as Artist,
    tags: (artwork.tags as { tag: Tag }[]).map((at) => at.tag),
  }))
}

/** アーティスト情報を取得 */
export async function getArtist(id: string): Promise<Artist | null> {
  if (isMock) return MOCK_ARTISTS.find((a) => a.id === id) ?? null

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()
  return data ?? null
}

/** アーティストの作品一覧を取得（タグはフラット配列） */
export async function getArtistArtworks(
  artistId: string
): Promise<(Artwork & { tags: Tag[] })[]> {
  if (isMock) return getMockArtistArtworks(artistId)

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data } = await supabase
    .from('artworks')
    .select('*, tags:artwork_tags(tag:tags(*))')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false })

  if (!data) return []
  return data.map((artwork) => ({
    ...(artwork as Artwork),
    tags: (artwork.tags as { tag: Tag }[]).map((at) => at.tag),
  }))
}

// -------- 管理ページ用 --------

/** 管理者向けアーティスト一覧（作品数付き） */
export async function getAdminArtists(): Promise<AdminArtist[]> {
  if (isMock) return MOCK_ADMIN_ARTISTS

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data } = await supabase
    .from('artists')
    .select('*, artworks(count)')
    .order('created_at', { ascending: false })
  return (data ?? []) as AdminArtist[]
}

/** 管理者向けアーティスト詳細（アーティスト + 作品 + タグ） */
export async function getAdminArtistDetail(id: string): Promise<{
  artist: Artist
  artworks: ArtworkWithTagJoin[]
  tags: Tag[]
} | null> {
  if (isMock) {
    const artist = MOCK_ARTISTS.find((a) => a.id === id)
    if (!artist) return null
    return {
      artist,
      artworks: getMockArtworkWithTagJoin(id),
      tags: MOCK_TAGS,
    }
  }

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()
  if (!artist) return null

  const { data: tags } = await supabase.from('tags').select('*').order('name')
  const { data: artworks } = await supabase
    .from('artworks')
    .select('*, tags:artwork_tags(tag:tags(*))')
    .eq('artist_id', id)
    .order('created_at', { ascending: false })

  return {
    artist: artist as Artist,
    artworks: (artworks ?? []) as ArtworkWithTagJoin[],
    tags: tags ?? [],
  }
}
