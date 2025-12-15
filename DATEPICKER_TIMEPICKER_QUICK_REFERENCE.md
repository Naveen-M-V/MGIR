# Modern DatePicker & TimePicker - Quick Reference

## Component Imports
```jsx
import { ModernDatePicker } from "../../components/ModernDatePicker";
import { ModernTimePicker } from "../../components/ModernTimePicker";
```

## DatePicker Quick Usage

### Basic Example
```jsx
const [date, setDate] = useState(null);

<ModernDatePicker
  selected={date}
  onSelect={setDate}
  minDate={new Date()}
  placeholder="Select a date"
/>
```

### With Date String (ISO Format)
```jsx
const [dateStr, setDateStr] = useState("");

<ModernDatePicker
  selected={dateStr ? new Date(dateStr) : null}
  onSelect={(date) => setDateStr(date.toISOString().slice(0, 10))}
  minDate={new Date()}
  placeholder="Select a date"
/>
```

### Multiple Date Selection
```jsx
const [dates, setDates] = useState([]);

<ModernDatePicker
  selected={dates}
  onSelect={(date) => {
    // Handle multiple selection logic
  }}
  mode="multiple"
  placeholder="Select dates"
/>
```

## TimePicker Quick Usage

### Basic Example
```jsx
const [time, setTime] = useState("");

<ModernTimePicker
  selected={time}
  onSelect={setTime}
  placeholder="Select a time"
/>
```

### With Custom Intervals
```jsx
<ModernTimePicker
  selected={time}
  onSelect={setTime}
  placeholder="Select a time"
  interval={30}        // 30-minute intervals
  startHour={9}        // Start at 09:00
  endHour={18}         // End at 18:00
/>
```

### Different Configurations

#### Hourly Slots (08:00-18:00)
```jsx
<ModernTimePicker
  selected={time}
  onSelect={setTime}
  interval={60}
  startHour={8}
  endHour={18}
/>
```

#### 15-Minute Slots (06:00-23:00)
```jsx
<ModernTimePicker
  selected={time}
  onSelect={setTime}
  interval={15}
  startHour={6}
  endHour={23}
/>
```

#### 30-Minute Slots (09:00-20:00)
```jsx
<ModernTimePicker
  selected={time}
  onSelect={setTime}
  interval={30}
  startHour={9}
  endHour={20}
/>
```

## Service-Specific Configurations

### Seamless Transport (BookingModal)
```jsx
// Date Picker
<ModernDatePicker
  selected={selectedDateObj}
  onSelect={(date) => {
    setSelectedDateObj(date);
    setSelectedTime("");
  }}
  minDate={new Date()}
  placeholder="Select a date"
/>

// Time Picker
<ModernTimePicker
  selected={selectedTime}
  onSelect={setSelectedTime}
  placeholder="Select a time"
  interval={60}
  startHour={8}
  endHour={18}
/>
```

### Private Chauffeur (PrivateChauffeurModal)
```jsx
// Time Picker
<ModernTimePicker
  selected={formData.pickupTime}
  onSelect={(time) => handleInputChange('pickupTime', time)}
  placeholder="Select start time"
  interval={15}
  startHour={6}
  endHour={23}
/>

// Multiple Date Selection
<ModernDatePicker
  selected={formData.selectedDates.map(dateStr => {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  })}
  onSelect={handleDateSelect}
  minDate={new Date()}
  placeholder="Click to select dates"
  mode="multiple"
/>
```

### Beauty Services (BookingFormModal)
```jsx
// Date Picker
<ModernDatePicker
  selected={serviceDate ? new Date(serviceDate) : null}
  onSelect={(date) => setServiceDate(date.toISOString().slice(0, 10))}
  minDate={new Date()}
  placeholder="Select a date"
/>

// Time Picker
<ModernTimePicker
  selected={serviceTime}
  onSelect={setServiceTime}
  placeholder="Select a time"
  interval={30}
  startHour={9}
  endHour={20}
/>
```

### Sitting Services (Babysitting/Pet Sitting)
```jsx
// Start Date & Time
<div className="flex gap-2">
  <div className="w-1/2">
    <ModernDatePicker
      selected={startDate ? new Date(startDate) : null}
      onSelect={(date) => setStartDate(date.toISOString().slice(0, 10))}
      minDate={new Date()}
      placeholder="Start date"
    />
  </div>
  <div className="w-1/2">
    <ModernTimePicker
      selected={startTime}
      onSelect={setStartTime}
      placeholder="Start time"
      interval={30}
    />
  </div>
</div>

// End Date & Time
<div className="flex gap-2">
  <div className="w-1/2">
    <ModernDatePicker
      selected={endDate ? new Date(endDate) : null}
      onSelect={(date) => setEndDate(date.toISOString().slice(0, 10))}
      minDate={startDate ? new Date(startDate) : new Date()}
      disabled={!startDate}
      placeholder="End date"
    />
  </div>
  <div className="w-1/2">
    <ModernTimePicker
      selected={endTime}
      onSelect={setEndTime}
      disabled={!startDate}
      placeholder="End time"
      interval={30}
    />
  </div>
</div>
```

### Tour Services (ServiceModal)
```jsx
// Date Picker
<div className="flex-1">
  <ModernDatePicker
    selected={null}
    onSelect={(date) => {
      const input = document.querySelector('input[name="date"]');
      if (input) input.value = date.toISOString().slice(0, 10);
    }}
    minDate={new Date()}
    placeholder="Select date"
  />
</div>

// Time Picker
<ModernTimePicker
  selected=""
  onSelect={(time) => {
    const input = document.querySelector('input[name="time"]');
    if (input) input.value = time;
  }}
  placeholder="Select tour time"
  interval={60}
  startHour={9}
  endHour={18}
/>
```

### Personal Curator (Image Flow Modal)
```jsx
// Date Picker
<ModernDatePicker
  selected={callDate ? new Date(callDate) : null}
  onSelect={(date) => setCallDate(date.toISOString().slice(0, 10))}
  minDate={new Date()}
  placeholder="Select a date"
/>

// Time Picker
<ModernTimePicker
  selected={callTime}
  onSelect={setCallTime}
  placeholder="Select a time"
  interval={30}
  startHour={9}
  endHour={18}
/>
```

### Personal Companion (BookingModal)
```jsx
// Date Picker
<ModernDatePicker
  selected={formData.date ? new Date(formData.date) : null}
  onSelect={(date) => {
    setFormData({
      ...formData,
      date: date.toISOString().slice(0, 10)
    });
  }}
  minDate={new Date()}
  placeholder="Select a date"
/>
```

## Common Patterns

### Form Integration
```jsx
const [formData, setFormData] = useState({
  date: '',
  time: ''
});

const handleDateChange = (date) => {
  setFormData({
    ...formData,
    date: date.toISOString().slice(0, 10)
  });
};

const handleTimeChange = (time) => {
  setFormData({
    ...formData,
    time: time
  });
};

// In JSX
<ModernDatePicker
  selected={formData.date ? new Date(formData.date) : null}
  onSelect={handleDateChange}
/>

<ModernTimePicker
  selected={formData.time}
  onSelect={handleTimeChange}
/>
```

### Dependent Date Pickers
```jsx
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

<ModernDatePicker
  selected={startDate}
  onSelect={setStartDate}
  minDate={new Date()}
/>

<ModernDatePicker
  selected={endDate}
  onSelect={setEndDate}
  minDate={startDate || new Date()}
  disabled={!startDate}
/>
```

## Styling Notes

- **DatePicker Button**: Amber accent (#f59e0b)
- **TimePicker Button**: Emerald accent (#10b981)
- **Calendar**: Dark slate background with white text
- **Selected State**: Highlighted with accent color
- **Hover State**: Slightly lighter background
- **Disabled State**: Reduced opacity

## Troubleshooting

### Date not updating
- Ensure you're converting to/from ISO string format correctly
- Check that the date object is valid: `new Date(dateString)`

### Time picker not showing slots
- Verify `startHour` is less than `endHour`
- Check that `interval` divides evenly into 60 minutes

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check that backdrop-blur is enabled in Tailwind config
- Verify lucide-react icons are properly imported

## Performance Tips

1. Memoize callbacks if passing to multiple pickers
2. Use `useCallback` for date/time change handlers
3. Avoid re-rendering parent on every date change
4. Use controlled components for better performance

## Accessibility

- Both components support keyboard navigation
- Proper ARIA labels are included
- Focus management is handled automatically
- Screen reader friendly
