# Responsive Design Quick Reference

## Breakpoints
```
xs (default):  0px - 639px    (Mobile phones)
sm:           640px - 767px   (Small tablets)
md:           768px - 1023px  (Tablets)
lg:          1024px - 1279px  (Desktops)
xl:          1280px+          (Large desktops)
```

## Common Responsive Patterns Used

### 1. Responsive Padding
```tailwind
px-4 sm:px-6 md:px-8
py-12 sm:py-16 md:py-20
```

### 2. Responsive Font Sizes
```tailwind
text-3xl sm:text-5xl md:text-7xl
text-sm sm:text-base md:text-lg
```

### 3. Responsive Grid
```tailwind
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

### 4. Responsive Spacing
```tailwind
gap-4 sm:gap-6 md:gap-8 lg:gap-10
mb-6 sm:mb-8 md:mb-12
```

### 5. Responsive Display
```tailwind
hidden lg:flex              (Hidden on mobile, visible on desktop)
block md:hidden             (Visible on mobile, hidden on desktop)
```

### 6. Responsive Image Heights
```tailwind
h-48 sm:h-56 md:h-64 lg:h-80
```

### 7. Responsive Widths
```tailwind
w-20 sm:w-28 md:w-40
w-full sm:w-auto
```

---

## Components Modified

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| TopNav | Logo only | Logo + some links | Full navigation |
| BottomNav | Wrapped items | Normal spacing | Full spacing |
| Sidebar | Compact (w-72) | Wider (w-80) | Not visible |
| Footer | Compact text | Normal text | Full spacing |
| Grids | 1 column | 2 columns | 3-4 columns |
| Buttons | Small (sm) | Medium (base) | Large (base) |

---

## Mobile-First Development Tips

1. **Start with mobile styles** (no breakpoint prefix)
2. **Add tablet enhancements** with `sm:` and `md:`
3. **Add desktop features** with `lg:` and `xl:`
4. **Test at each breakpoint** to ensure smooth transitions

---

## Common Issues & Solutions

### Issue: Text too small on mobile
**Solution:** Add responsive font sizes
```tailwind
text-base sm:text-lg md:text-xl
```

### Issue: Grid too cramped on mobile
**Solution:** Use responsive columns
```tailwind
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### Issue: Buttons hard to tap on mobile
**Solution:** Increase padding on mobile
```tailwind
px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3
```

### Issue: Images too large on mobile
**Solution:** Responsive image heights
```tailwind
h-32 sm:h-40 md:h-48 lg:h-64
```

---

## Testing Checklist

- [ ] Mobile (320px): All text readable, buttons tappable
- [ ] Tablet (768px): Two-column layouts work
- [ ] Desktop (1024px): Full navigation visible
- [ ] Large Desktop (1280px+): Proper max-width respected
- [ ] Landscape mobile: Content doesn't overflow
- [ ] Tablet landscape: Proper spacing maintained
- [ ] Images: Scale correctly at all sizes
- [ ] Forms: Easy to fill on mobile
- [ ] Navigation: Accessible on all devices

---

## Files to Reference

- `src/components/TopNav.jsx` - Navigation header
- `src/components/Footer.jsx` - Page footer
- `src/pages/FullscreenMenu.jsx` - Mobile menu
- `src/pages/AboutPage.jsx` - About page layout
- `src/pages/ServicesPage.jsx` - Services grid
- `src/pages/ContactPage.jsx` - Contact forms
- `src/pages/GalleryPage.jsx` - Gallery grid

---

## Tailwind CSS Resources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Tailwind Breakpoints](https://tailwindcss.com/docs/screens)
- [Tailwind Spacing](https://tailwindcss.com/docs/padding)
- [Tailwind Typography](https://tailwindcss.com/docs/font-size)

---

## Key Takeaway

The entire website now uses **consistent responsive patterns** across all pages. Every component scales smoothly from mobile (320px) to large desktop (1920px+) using Tailwind's responsive breakpoints.
