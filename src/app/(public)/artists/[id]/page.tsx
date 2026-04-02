import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Tag } from '@/types'

type Params = { id: string }

export default async function ArtistPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()

  if (!artist) notFound()

  const { data: artworks } = await supabase
    .from('artworks')
    .select(`*, tags:artwork_tags(tag:tags(*))`)
    .eq('artist_id', id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      {/* アーティストプロフィール */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="w-16 h-16">
          <AvatarImage src={artist.avatar_url ?? undefined} alt={artist.name} />
          <AvatarFallback className="text-lg">{artist.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">{artist.name}</h1>
          {artist.name_en && (
            <p className="text-sm text-muted-foreground">{artist.name_en}</p>
          )}
          {artist.bio && (
            <p className="text-sm mt-2 whitespace-pre-wrap">{artist.bio}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {artist.website_url && (
              <a
                href={artist.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                Website
              </a>
            )}
            {artist.twitter_url && (
              <a
                href={artist.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                X / Twitter
              </a>
            )}
            {artist.instagram_url && (
              <a
                href={artist.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* 作品一覧 */}
      <div className="grid grid-cols-2 gap-3">
        {artworks?.map((artwork) => {
          const tags = (artwork.tags as { tag: Tag }[]).map((at) => at.tag)
          return (
            <div key={artwork.id} className="space-y-1">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title ?? '作品'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 280px"
                />
              </div>
              {artwork.title && (
                <p className="text-xs font-medium line-clamp-1">{artwork.title}</p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Link key={tag.id} href={`/?tag=${tag.slug}`}>
                      <Badge variant="secondary" className="text-[10px] py-0 h-4">
                        #{tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {(!artworks || artworks.length === 0) && (
        <p className="text-center text-muted-foreground py-12">作品がありません</p>
      )}
    </main>
  )
}
