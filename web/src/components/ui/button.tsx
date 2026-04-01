import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
    variant: {
      default: "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:from-accent hover:to-primary hover:shadow-primary/30",
      destructive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-sm shadow-red-500/20 hover:from-red-500 hover:to-red-400",
      outline: "border border-border shadow-sm hover:border-accent/50 dark:bg-card/60 dark:text-foreground dark:hover:bg-border/60 light:bg-muted light:text-foreground light:hover:bg-muted/80",
      secondary: "border border-border/60 shadow-sm hover:bg-border/60 dark:bg-card/80 dark:text-foreground light:bg-white light:text-foreground light:hover:bg-muted",
      ghost: "hover:bg-card/60 hover:text-foreground dark:text-muted-foreground light:text-muted-foreground light:hover:text-foreground",
      link: "text-accent underline-offset-4 hover:underline",
    },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
