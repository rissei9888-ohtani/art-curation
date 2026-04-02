'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Artwork } from '@/types'

type Props = {
  artwork: Artwork & {
    artist: NonNullable<Artwork['artist']>
    tags?: NonNullable<Artwork['tags']>
  }
}

export function ArtworkCard({ artwork }: Props) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const handleLike = () => {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <article className="border-b border-border pb-8 mb-8 last:border-0">
      {/* アーティスト情報ヘッダー */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/artists/${artwork.artist.id}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={artwork.artist.avatar_url ?? undefined} alt={artwork.artist.name} />
            <AvatarFallback>{artwork.artist.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link
            href={`/artists/${artwork.artist.id}`}
            className="font-semibold text-sm hover:underline"
          >
            {artwork.artist.name}
          </Link>
          {artwork.artist.name_en && (
            <p className="text-xs text-muted-foreground">{artwork.artist.name_en}</p>
          )}
        </div>
      </div>

      {/* 作品画像 */}
      <div className="relative w-full rounded-xl overflow-hidden bg-muted aspect-[4/3]">
        <Image
          src={artwork.image_url}
          alt={artwork.title ?? '作品画像'}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 600px"
        />
      </div>

      {/* アクション */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm transition-colors ${
            liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'
          }`}
          aria-label="お気に入り"
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
      </div>

      {/* タイトル・説明 */}
      {(artwork.title || artwork.description) && (
        <div className="mt-2 text-sm">
          {artwork.title && <p className="font-medium">{artwork.title}</p>}
          {artwork.description && (
            <p className="text-muted-foreground mt-1 line-clamp-3">{artwork.description}</p>
          )}
        </div>
      )}

      {/* タグ */}
      {artwork.tags && artwork.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {artwork.tags.map((tag) => (
            <Link key={tag.id} href={`/?tag=${tag.slug}`}>
              <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
