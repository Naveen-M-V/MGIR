import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

function Calendar({ className = "", classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 ${className}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-white/70 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-white/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal text-white hover:bg-white/20 rounded-md transition-colors",
        day_selected: "bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-emerald-600",
        day_today: "bg-white/10 text-white",
        day_outside: "text-white/30 opacity-50",
        day_disabled: "text-white/30 opacity-50",
        day_range_middle: "aria-selected:bg-white/10 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
