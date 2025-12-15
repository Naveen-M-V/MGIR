import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export function DatePicker({ 
  date, 
  onDateChange, 
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  className = ""
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`w-full justify-start text-left font-normal ${!date && "text-white/50"} ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      {isOpen && (
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate)
              setIsOpen(false)
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              return false
            }}
            initialFocus
          />
        </PopoverContent>
      )}
    </Popover>
  )
}
