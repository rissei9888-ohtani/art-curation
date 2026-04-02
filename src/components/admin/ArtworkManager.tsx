'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import type { Artwork, Tag } from '@/types'

type ArtworkWithTags = Artwork & { tags: { tag: Tag }[] }

type Props = {
  artistId: string
  artworks: ArtworkWithTags[]
  tags: Tag[]
}

export function ArtworkManager({ artistId, artworks: initialArtworks, tags }: Props) {
  const router = useRouter()
  const [artworks, setArtworks] = useState(initialArtworks)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const handleAddArtwork = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return
    setError(null)
    setLoading(true)

    const supabase = createClient()

    // 画像アップロード
    const ext = imageFile.name.split('.').pop()
    const path = `artworks/${artistId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(path, imageFile)

    if (uploadError) {
      setError('画像のアップロードに失敗しました')
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)

    // 作品レコード作成
    const { data: artwork, error: insertError } = await supabase
      .from('artworks')
      .insert({
        artist_id: artistId,
        title: title || null,
        description: description || null,
        image_url: urlData.publicUrl,
      })
      .select()
      .single()

    if (insertError || !artwork) {
      setError('作品の登録に失敗しました')
      setLoading(false)
      return
    }

    // タグの紐付け
    if (selectedTagIds.length > 0) {
      await supabase.from('artwork_tags').insert(
        selectedTagIds.map((tagId) => ({ artwork_id: artwork.id, tag_id: tagId }))
      )
    }

    // フォームリセット
    setTitle('')
    setDescription('')
    setImageFile(null)
    setSelectedTagIds([])
    setLoading(false)

    router.refresh()
  }

  const handleDeleteArtwork = async (artworkId: string) => {
    if (!confirm('この作品を削除しますか？')) return

    const supabase = createClient()
    await supabase.from('artworks').delete().eq('id', artworkId)
    setArtworks((prev) => prev.filter((a) => a.id !== artworkId))
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* 作品追加フォーム */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">作品を追加</h3>
          <form onSubmit={handleAddArtwork} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="artwork-image">画像 *</Label>
              <Input
                id="artwork-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artwork-title">タイトル（任意）</Label>
              <Input
                id="artwork-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="作品タイトル"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artwork-desc">説明（任意）</Label>
              <Textarea
                id="artwork-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            {tags.length > 0 && (
              <div className="space-y-2">
                <Label>タグ（任意・複数選択可）</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTagIds.includes(tag.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.id)}
                    >
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" size="sm" disabled={loading || !imageFile}>
              {loading ? '追加中...' : '作品を追加'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 既存作品一覧 */}
      {artworks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title ?? '作品'}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              {artwork.title && (
                <p className="text-xs mt-1 line-clamp-1">{artwork.title}</p>
              )}
              <button
                onClick={() => handleDeleteArtwork(artwork.id)}
                className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="削除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
