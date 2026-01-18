import Image from "next/image"

export function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <div
      aria-label="Sadia Ismail logo"
      className="flex items-center justify-center rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src="/PHOTO-2025-10-02-00-42-10.jpg"
        alt="Sadia Ismail Logo"
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
    </div>
  )
}

export function Wordmark() {
  return <span className="caps text-sm tracking-[0.35em]">SADIA ISMAIL</span>
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={size} />
      <Wordmark />
    </div>
  )
}
