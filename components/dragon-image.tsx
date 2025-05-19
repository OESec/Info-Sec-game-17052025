interface DragonImageProps {
  className?: string
}

export function DragonImage({ className }: DragonImageProps) {
  return (
    <div className={className}>
      <img src="/dragon-icon.png" alt="" className="h-full w-auto object-contain" aria-hidden="true" />
    </div>
  )
}
