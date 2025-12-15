import * as React from "react"

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    outline: "border border-white/20 bg-white/10 hover:bg-white/20 text-white",
    ghost: "hover:bg-white/10 text-white",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }
  
  const variantClass = variants[variant] || variants.default
  const sizeClass = sizes[size] || sizes.default
  
  return (
    <button
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
