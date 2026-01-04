import * as React from "react"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", size = "default", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]",
            outline: "border-2 border-zinc-900 bg-white text-zinc-900 hover:bg-zinc-50 active:scale-[0.98]",
            ghost: "text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900"
        }

        const sizes = {
            default: "h-12 px-6 py-3 text-base",
            sm: "h-9 px-4 text-sm",
            lg: "h-14 px-8 text-lg"
        }

        return (
            <button
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
