import { notFound } from 'next/navigation'
import { ArtistForm } from '@/components/admin/ArtistForm'
import { ArtworkManager } from '@/components/admin/ArtworkManager'
import { Separator } from '@/components/ui/separator'
import { getAdminArtistDetail } from '@/lib/data'

type Params = { id: string }

export default async function EditArtistPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const detail = await getAdminArtistDetail(id)

  if (!detail) notFound()

  const { artist, artworks, tags } = detail

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">アーティスト編集: {artist.name}</h1>
      <ArtistForm artist={artist} />

      <Separator className="my-8" />

      <h2 className="text-lg font-bold mb-4">作品管理</h2>
      <ArtworkManager
        artistId={id}
        artworks={artworks}
        tags={tags}
      />
    </div>
  )
}
