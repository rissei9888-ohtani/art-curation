import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ArtworkCard } from '@/components/feed/ArtworkCard'
import { FeedSkeleton } from '@/components/feed/FeedSkeleton'
import { TagFilter } from '@/components/feed/TagFilter'
import type { Artwork, Tag } from '@/types'

type SearchParams = { tag?: string }

async function Feed({ tag }: { tag?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('artworks')
    .select(`
      *,
      artist:artists(*),
      tags:artwork_tags(tag:tags(*))
    `)
    .order('created_at', { ascending: false })

  // タグで絞り込む場合はサブクエリで対応
  if (tag) {
    const { data: tagData } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tag)
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

  if (!artworks || artworks.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16">
        作品がありません
      </p>
    )
  }

  return (
    <div>
      {artworks.map((artwork) => {
        const tags = (artwork.tags as { tag: Tag }[]).map((at) => at.tag)
        return (
          <ArtworkCard
            key={artwork.id}
            artwork={{ ...(artwork as Artwork), tags, artist: artwork.artist }}
          />
        )
      })}
    </div>
  )
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { tag } = await searchParams
  const supabase = await createClient()
  const { data: tags } = await supabase.from('tags').select('*').order('name')

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">ArtFeed</h1>
        <p className="text-sm text-muted-foreground mt-1">
          いけてるアーティストを発掘しよう
        </p>
      </header>

      <Suspense fallback={null}>
        <TagFilter tags={tags ?? []} />
      </Suspense>

      <Suspense fallback={<FeedSkeleton />}>
        <Feed tag={tag} />
      </Suspense>
    </main>
  )
}
