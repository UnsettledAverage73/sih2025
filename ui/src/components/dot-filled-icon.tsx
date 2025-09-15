"use client"

import React, { lazy, Suspense } from "react"
import { LucideIcon } from "lucide-react"

const LazyDotFilled = lazy(() =>
  import("lucide-react").then((module) => ({
    default: module.DotFilled as LucideIcon,
  }))
);

export function DotFilledIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Suspense fallback={<div>...</div>}>
      <LazyDotFilled {...props} />
    </Suspense>
  )
}
