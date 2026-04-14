import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-150 p-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 bg-zinc-100" />
          <Skeleton className="h-4 w-48 bg-zinc-50" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-sm border border-border" />
        ))}
      </div>

      <div className="grid gap-6">
        <Skeleton className="h-[400px] rounded-sm border border-border" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[500px] rounded-sm border border-border" />
          <Skeleton className="h-[500px] rounded-sm border border-border" />
        </div>
      </div>
    </div>
  );
}
