'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Artist } from '@/types'

type Props = {
  artist?: Artist
}

export function ArtistForm({ artist }: Props) {
  const router = useRouter()
  const isEdit = !!artist

  const [name, setName] = useState(artist?.name ?? '')
  const [nameEn, setNameEn] = useState(artist?.name_en ?? '')
  const [bio, setBio] = useState(artist?.bio ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(artist?.website_url ?? '')
  const [twitterUrl, setTwitterUrl] = useState(artist?.twitter_url ?? '')
  const [instagramUrl, setInstagramUrl] = useState(artist?.instagram_url ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    let avatarUrl = artist?.avatar_url ?? null

    // アバター画像をアップロード
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `avatars/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(path, avatarFile, { upsert: true })

      if (uploadError) {
        setError('画像のアップロードに失敗しました')
        setLoading(false)
        return
      }

      const { data } = supabase.storage.from('images').getPublicUrl(path)
      avatarUrl = data.publicUrl
    }

    const payload = {
      name,
      name_en: nameEn || null,
      bio: bio || null,
      website_url: websiteUrl || null,
      twitter_url: twitterUrl || null,
      instagram_url: instagramUrl || null,
      avatar_url: avatarUrl,
    }

    if (isEdit) {
      const { error: updateError } = await supabase
        .from('artists')
        .update(payload)
        .eq('id', artist.id)

      if (updateError) {
        setError('更新に失敗しました')
        setLoading(false)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from('artists')
        .insert(payload)

      if (insertError) {
        setError('登録に失敗しました')
        setLoading(false)
        return
      }
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">名前 *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="山田 太郎"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name_en">英語名（任意）</Label>
        <Input
          id="name_en"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Taro Yamada"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">プロフィール（任意）</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="アーティストの紹介文を入力..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">アバター画像（任意）</Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Webサイト URL（任意）</Label>
        <Input
          id="website"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter">X / Twitter URL（任意）</Label>
        <Input
          id="twitter"
          type="url"
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
          placeholder="https://x.com/username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram URL（任意）</Label>
        <Input
          id="instagram"
          type="url"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="https://instagram.com/username"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin')}
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}
