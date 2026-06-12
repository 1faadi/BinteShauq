import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface PageLoaderProps {
  label?: string
  className?: string
  fullScreen?: boolean
}

export function PageLoader({
  label = "Loading",
  className,
  fullScreen = false,
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4",
        fullScreen ? "min-h-[60vh]" : "py-20",
        className,
      )}
    >
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <Spinner className="size-7 text-primary" />
      </span>
      <span className="caps-tight text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
