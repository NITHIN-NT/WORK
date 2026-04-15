import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-[13px] font-black uppercase tracking-widest ring-offset-background transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow-[0_4px_20px_-4px_rgba(var(--primary),0.4)] hover:shadow-[0_8px_30px_-4px_rgba(var(--primary),0.6)] hover:-translate-y-0.5 active:translate-y-0": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
            "glass text-foreground hover:bg-white/5 border-border/40": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "hover:bg-primary/10 hover:text-primary": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-14 px-8 py-4": size === "default",
            "h-10 rounded-sm px-6": size === "sm",
            "h-16 rounded-md px-12 text-sm": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
