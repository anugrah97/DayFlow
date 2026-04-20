"use client"

import { useDroppable } from "@dnd-kit/core"

interface DroppableSlotProps {
  slotTime: string  // ISO string for this 30-min slot
  style?: React.CSSProperties
  className?: string
}

export default function DroppableSlot({ slotTime, style, className }: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: slotTime,
    data: { slotTime },
  })

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute left-0 right-0 transition-colors ${
        isOver ? "bg-blue-50 border border-dashed border-blue-400 rounded" : ""
      } ${className ?? ""}`}
    />
  )
}
