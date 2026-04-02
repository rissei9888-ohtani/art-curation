'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import type { Tag } from '@/types'

type Props = {
  tags: Tag[]
}

export function TagFilter({ tags }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTag = searchParams.get('tag')

  const handleTag = (slug: string) => {
    if (currentTag === slug) {
      router.push('/')
    } else {
      router.push(`/?tag=${slug}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Badge
        variant={!currentTag ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => router.push('/')}
      >
        すべて
      </Badge>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={currentTag === tag.slug ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleTag(tag.slug)}
        >
          #{tag.name}
        </Badge>
      ))}
    </div>
  )
}
