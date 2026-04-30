import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "border-transparent bg-orange-600 text-white",
        secondary: "border-transparent bg-zinc-800 text-zinc-100",
        destructive: "border-transparent bg-red-500/20 text-red-500",
        outline: "text-zinc-400 border-zinc-800",
        success: "border-transparent bg-green-500/20 text-green-500",
        openStatus: "border-green-500/50 bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]", 
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
