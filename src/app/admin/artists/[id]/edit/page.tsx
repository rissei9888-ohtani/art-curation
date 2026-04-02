import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArtistForm } from '@/components/admin/ArtistForm'
import { ArtworkManager } from '@/components/admin/ArtworkManager'
import { Separator } from '@/components/ui/separator'

type Params = { id: string }

export default async function EditArtistPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single()

  if (!artist) notFound()

  const { data: tags } = await supabase.from('tags').select('*').order('name')
  const { data: artworks } = await supabase
    .from('artworks')
    .select('*, tags:artwork_tags(tag:tags(*))')
    .eq('artist_id', id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">アーティスト編集: {artist.name}</h1>
      <ArtistForm artist={artist} />

      <Separator className="my-8" />

      <h2 className="text-lg font-bold mb-4">作品管理</h2>
      <ArtworkManager
        artistId={id}
        artworks={artworks ?? []}
        tags={tags ?? []}
      />
    </div>
  )
}
