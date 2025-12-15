import * as React from "react"

const Popover = ({ children }) => {
  return <div className="relative">{children}</div>
}

const PopoverTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ref, ...props })
  }
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className = "", align = "center", sideOffset = 4, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 rounded-md border border-white/20 bg-black/90 backdrop-blur-xl p-4 text-white shadow-lg outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
