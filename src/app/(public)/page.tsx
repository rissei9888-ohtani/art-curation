import { Suspense } from 'react'
import { ArtworkCard } from '@/components/feed/ArtworkCard'
import { FeedSkeleton } from '@/components/feed/FeedSkeleton'
import { TagFilter } from '@/components/feed/TagFilter'
import { getTags, getFeedArtworks } from '@/lib/data'

type SearchParams = { tag?: string }

async function Feed({ tag }: { tag?: string }) {
  const artworks = await getFeedArtworks(tag)

  if (artworks.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-16">
        作品がありません
      </p>
    )
  }

  return (
    <div>
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  )
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { tag } = await searchParams
  const tags = await getTags()

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">ArtFeed</h1>
        <p className="text-sm text-muted-foreground mt-1">
          いけてるアーティストを発掘しよう
        </p>
      </header>

      <Suspense fallback={null}>
        <TagFilter tags={tags} />
      </Suspense>

      <Suspense fallback={<FeedSkeleton />}>
        <Feed tag={tag} />
      </Suspense>
    </main>
  )
}
