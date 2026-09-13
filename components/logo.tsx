import Image from "next/image"
import { BRAND_NAME, FOUNDER_NAME } from "@/lib/site"

const LOGO_SRC = "/PHOTO-2025-10-02-00-42-10.jpg"

export function LogoMark({ size = 56 }: { size?: number }): React.ReactElement {
  return (
    <div
      aria-label={`${BRAND_NAME} logo`}
      className="flex items-center justify-center rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Image
        src={LOGO_SRC}
        alt={`${BRAND_NAME} logo`}
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
    </div>
  )
}

export function Wordmark({ className }: { className?: string }): React.ReactElement {
  return (
    <span className={`font-medium tracking-[0.12em] text-sm uppercase ${className ?? ""}`}>
      {BRAND_NAME}
    </span>
  )
}

export function Logo({
  size = 40,
  showFounder = false,
}: {
  size?: number
  showFounder?: boolean
}): React.ReactElement {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={size} />
      <div className="flex flex-col">
        <Wordmark />
        {showFounder ? (
          <span className="text-[10px] text-muted-foreground tracking-wide">
            by {FOUNDER_NAME}
          </span>
        ) : null}
      </div>
    </div>
  )
}
