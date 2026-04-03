import type { Artist, Artwork, Tag } from '@/types'

// フィードページ用の型
export type FeedArtwork = Artwork & { artist: Artist; tags: Tag[] }
// 管理ページ（ArtworkManager）が期待する結合形式（Artwork の tags フィールドを上書き）
export type ArtworkWithTagJoin = Omit<Artwork, 'tags'> & { tags: { tag: Tag }[] }
// 管理アーティスト一覧用の型（Artist の artworks フィールドを count 形式で上書き）
export type AdminArtist = Omit<Artist, 'artworks'> & { artworks: { count: number }[] }

// -------- タグ --------

export const MOCK_TAGS: Tag[] = [
  { id: 'tag-1', name: '油絵', slug: 'oil-painting' },
  { id: 'tag-2', name: '水彩', slug: 'watercolor' },
  { id: 'tag-3', name: 'デジタル', slug: 'digital' },
  { id: 'tag-4', name: 'イラスト', slug: 'illustration' },
  { id: 'tag-5', name: '抽象', slug: 'abstract' },
  { id: 'tag-6', name: '人物', slug: 'portrait' },
  { id: 'tag-7', name: '風景', slug: 'landscape' },
  { id: 'tag-8', name: 'アニメ', slug: 'anime' },
]

// -------- アーティスト --------

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: '山田 花子',
    name_en: 'Hanako Yamada',
    bio: '東京在住の油絵画家。自然と人物をモチーフに、独自の色彩表現を追求しています。\n国内外のギャラリーで定期的に個展を開催。',
    avatar_url: 'https://picsum.photos/seed/avatar1/200/200',
    website_url: 'https://example.com',
    twitter_url: 'https://x.com/example',
    instagram_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'artist-2',
    name: '田中 蒼',
    name_en: 'Ao Tanaka',
    bio: 'デジタルアートとイラストを中心に活動。\nアニメ・ゲーム業界でのキャラクターデザイン経験を持つ。',
    avatar_url: 'https://picsum.photos/seed/avatar2/200/200',
    website_url: null,
    twitter_url: 'https://x.com/example2',
    instagram_url: 'https://instagram.com/example2',
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'artist-3',
    name: '鈴木 みのり',
    name_en: 'Minori Suzuki',
    bio: '水彩と抽象表現を融合させた独自のスタイル。\n自然の光と影をテーマに制作活動を続けています。',
    avatar_url: 'https://picsum.photos/seed/avatar3/200/200',
    website_url: null,
    twitter_url: null,
    instagram_url: 'https://instagram.com/example3',
    created_at: '2024-03-01T00:00:00Z',
  },
]

// -------- 作品（タグIDつきの内部形式） --------

type RawArtwork = Artwork & { tag_ids: string[] }

const RAW_ARTWORKS: RawArtwork[] = [
  // 山田 花子
  {
    id: 'artwork-1',
    artist_id: 'artist-1',
    title: '朝の光の中で',
    image_url: 'https://picsum.photos/seed/art1/600/750',
    description: '早朝の光を浴びた人物を油絵で表現。柔らかな筆致と暖かいトーンが特徴です。',
    created_at: '2024-03-15T00:00:00Z',
    tag_ids: ['tag-1', 'tag-6'],
  },
  {
    id: 'artwork-2',
    artist_id: 'artist-1',
    title: '秋の庭',
    image_url: 'https://picsum.photos/seed/art2/600/800',
    description: '秋の庭を描いた風景油絵。落ち葉の色彩を豊かに表現。',
    created_at: '2024-02-20T00:00:00Z',
    tag_ids: ['tag-1', 'tag-7'],
  },
  {
    id: 'artwork-3',
    artist_id: 'artist-1',
    title: null,
    image_url: 'https://picsum.photos/seed/art3/600/600',
    description: null,
    created_at: '2024-01-25T00:00:00Z',
    tag_ids: ['tag-1'],
  },
  // 田中 蒼
  {
    id: 'artwork-4',
    artist_id: 'artist-2',
    title: 'BLOOM',
    image_url: 'https://picsum.photos/seed/art4/600/900',
    description: 'キャラクターと花をモチーフにしたデジタルイラスト。',
    created_at: '2024-03-20T00:00:00Z',
    tag_ids: ['tag-3', 'tag-4', 'tag-8'],
  },
  {
    id: 'artwork-5',
    artist_id: 'artist-2',
    title: '夜明けの少女',
    image_url: 'https://picsum.photos/seed/art5/600/850',
    description: null,
    created_at: '2024-02-28T00:00:00Z',
    tag_ids: ['tag-3', 'tag-4', 'tag-6', 'tag-8'],
  },
  {
    id: 'artwork-6',
    artist_id: 'artist-2',
    title: 'City Lights',
    image_url: 'https://picsum.photos/seed/art6/600/600',
    description: '都市の夜景をモチーフにしたデジタルアート。',
    created_at: '2024-01-15T00:00:00Z',
    tag_ids: ['tag-3', 'tag-7'],
  },
  // 鈴木 みのり
  {
    id: 'artwork-7',
    artist_id: 'artist-3',
    title: '流れ',
    image_url: 'https://picsum.photos/seed/art7/600/800',
    description: '水彩の滲みと流れを活かした抽象作品。',
    created_at: '2024-03-10T00:00:00Z',
    tag_ids: ['tag-2', 'tag-5'],
  },
  {
    id: 'artwork-8',
    artist_id: 'artist-3',
    title: '霧の朝',
    image_url: 'https://picsum.photos/seed/art8/600/750',
    description: '霧の中の風景を水彩で。静寂と柔らかさを表現。',
    created_at: '2024-02-10T00:00:00Z',
    tag_ids: ['tag-2', 'tag-7'],
  },
  {
    id: 'artwork-9',
    artist_id: 'artist-3',
    title: null,
    image_url: 'https://picsum.photos/seed/art9/600/600',
    description: null,
    created_at: '2024-01-05T00:00:00Z',
    tag_ids: ['tag-2', 'tag-5'],
  },
]

// -------- 導出データ（各ページが必要とする形式に変換済み） --------

const tagById = Object.fromEntries(MOCK_TAGS.map((t) => [t.id, t]))
const artistById = Object.fromEntries(MOCK_ARTISTS.map((a) => [a.id, a]))

/** フィードページ用：作品 + アーティスト + タグ（フラット配列） */
export const MOCK_FEED_ARTWORKS: FeedArtwork[] = RAW_ARTWORKS.map((raw) => {
  const { tag_ids, ...artwork } = raw
  return {
    ...artwork,
    artist: artistById[artwork.artist_id],
    tags: tag_ids.map((id) => tagById[id]),
  }
}).sort((a, b) => b.created_at.localeCompare(a.created_at))

/** 管理ページ（アーティスト一覧）用：作品数付きアーティスト */
export const MOCK_ADMIN_ARTISTS: AdminArtist[] = MOCK_ARTISTS.map((artist) => ({
  ...artist,
  artworks: [
    { count: RAW_ARTWORKS.filter((a) => a.artist_id === artist.id).length },
  ],
}))

/** アーティスト詳細ページ用：作品 + タグ（フラット配列） */
export function getMockArtistArtworks(artistId: string): (Artwork & { tags: Tag[] })[] {
  return RAW_ARTWORKS.filter((a) => a.artist_id === artistId)
    .map(({ tag_ids, ...artwork }) => ({
      ...artwork,
      tags: tag_ids.map((id) => tagById[id]),
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

/** 管理編集ページ用：作品 + タグ（結合形式 { tag: Tag }[]） */
export function getMockArtworkWithTagJoin(artistId: string): ArtworkWithTagJoin[] {
  return RAW_ARTWORKS.filter((a) => a.artist_id === artistId)
    .map(({ tag_ids, ...artwork }) => ({
      ...artwork,
      tags: tag_ids.map((id) => ({ tag: tagById[id] })),
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}
