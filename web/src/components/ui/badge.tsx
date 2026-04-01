import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "border-accent/40 bg-accent/20 text-foreground shadow hover:bg-accent/30",
        secondary:
          "border-border/50 bg-card/60 text-muted-foreground hover:bg-border/60",
        destructive:
          "border-red-500/30 bg-red-500/20 text-red-300 shadow hover:bg-red-500/30",
        outline: "border-border text-foreground",
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
