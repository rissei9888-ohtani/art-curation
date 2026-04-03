import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAdminArtists } from '@/lib/data'

export default async function AdminPage() {
  const artists = await getAdminArtists()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">アーティスト一覧</h1>
        <Link href="/admin/artists/new">
          <Button size="sm">+ 新規登録</Button>
        </Link>
      </div>

      {artists.length === 0 && (
        <p className="text-center text-muted-foreground py-16">
          アーティストがまだ登録されていません
        </p>
      )}

      <div className="space-y-3">
        {artists.map((artist) => (
          <Card key={artist.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={artist.avatar_url ?? undefined} alt={artist.name} />
                <AvatarFallback>{artist.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{artist.name}</p>
                {artist.name_en && (
                  <p className="text-xs text-muted-foreground">{artist.name_en}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  作品数: {artist.artworks[0]?.count ?? 0}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/artists/${artist.id}/edit`}>
                  <Button size="sm" variant="outline">編集</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
