import { Skeleton } from '@/components/ui/skeleton'

export function FeedSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border-b border-border pb-8">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>
          <Skeleton className="w-full aspect-[4/3] rounded-xl" />
          <div className="mt-3 space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-3" />
          </div>
        </div>
      ))}
    </div>
  )
}
