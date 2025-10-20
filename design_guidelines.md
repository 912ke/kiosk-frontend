# SimRacing Club Kiosk - Design Guidelines

## Design Approach
**Kiosk-Optimized Utility Interface** - This is a touch-first, self-service kiosk application requiring maximum clarity, accessibility, and fail-safe navigation. Design prioritizes large touch targets, minimal distractions, and instant comprehension over aesthetic experimentation.

## Core Design Principles
1. **Touch-First**: All interactive elements minimum 48×48dp, generous spacing
2. **High Contrast**: Dark theme optimized for kiosk viewing conditions
3. **Time-Aware**: 60-second idle timeout - every screen must be immediately navigable
4. **Error-Resistant**: Clear feedback, large cancel buttons, obvious navigation paths

## Color Palette

### Dark Theme (Primary)
- Background: `0 0% 4%` (#0B0B0D)
- Surface: `240 6% 8%` (#15151A)
- Text Primary: `220 13% 97%` (#F5F6F8)
- Text Secondary: `225 4% 67%` (#A5A8AE)

### Accent & Status
- Accent/Primary: `355 100% 63%` (#FF4655) - vibrant red for CTAs
- Success: `145 63% 49%` (#2ECC71)
- Warning: `48 89% 60%` (#F1C40F)
- Error: `6 78% 57%` (#E74C3C)

## Typography
- **Headings**: Bold, 28-36px - maximum clarity for kiosk viewing distance
- **Body Text**: Regular, 18-20px - larger than web standards for readability
- **Button Text**: Semibold, 18-20px
- **Font**: System font stack (SF Pro, Segoe UI) for instant loading

## Layout System

### Viewport & Orientation
- **Primary**: Portrait 1080×1920 (kiosk mode)
- **Secondary**: Landscape 1920×1080 (adaptive)
- **Safe Areas**: 24-32px padding on all edges
- **Content Max-Width**: 900px centered for portrait

### Spacing
- Use Tailwind units: `p-6`, `p-8`, `gap-6` for consistency
- Generous whitespace between interactive sections (min 32px vertical)
- Touch targets never closer than 16px apart

## Component Library

### Buttons
- **Height**: 56-64px for easy touch
- **Border Radius**: 12-16px (modern, friendly)
- **States**: Clear hover (brightness +10%), active (scale 0.98), disabled (opacity 50%)
- **Primary**: Red accent background, white text
- **Secondary**: Surface background, accent border
- **Ghost**: Transparent with accent text

### Navigation Tiles (Home Screen)
- Large square/rectangular cards (min 200×200px)
- Icon + label layout, generous padding
- Surface background with subtle border
- Clear hover state (lift shadow)

### Input Fields
- **Height**: 56px minimum
- **On-Screen Keyboard**: Custom numpad component for phone/amounts
- **Phone Mask**: +7 XXX XXX XX XX with auto-formatting
- **Focus State**: Accent color border, 2px width

### Time Picker
- Horizontal scroll of 30-minute intervals (12:00-00:00)
- Each slot: pill-shaped button, active state with accent background
- Disabled slots: low opacity, no interaction

### Slot Cards
- Display: Time range, available count, price (if applicable)
- Action button integrated (not separate)
- Availability indicator: green dot for available, gray for limited

### QR Code Display
- Centered, large size (300×300px minimum)
- White background with padding for scannability
- Timer display above/below
- "Scan with your phone" instruction text

### Toast Notifications
- Bottom center position
- Auto-dismiss after 5 seconds
- Icon + message layout
- Color-coded by type (success/error/warning)

## Navigation & Flow

### Header (All Screens Except Home)
- Back button (left, 48×48px minimum)
- Screen title (center)
- Help button (right, optional) - calls administrator

### Footer
- "Help" button always accessible
- Language selector (if i18n enabled)

### Progress Indicators
- Booking wizard: Step counter (1/4, 2/4, etc.)
- Loading states: Spinner with text
- Payment status: Progress bar with timer

## Kiosk-Specific Design

### Idle State Prevention
- Activity indicators visible during processes
- "Still here?" prompt at 50 seconds
- Auto-redirect without confirmation

### Error Handling
- Large error messages (24px text)
- Always provide "Go to Home" escape button
- Network errors: friendly language, retry option

### No-Keyboard Design
- All text input via on-screen components
- Number pad: 3×4 grid, 64×64px buttons
- Phone keyboard: optimized for +7 format
- No reliance on system keyboard

## Images

### Minimal Image Usage
- **Home Screen**: Optional small club logo (200×200px max)
- **About Screen**: 1-2 atmospheric racing simulator photos (16:9 ratio)
- **No Hero Images**: This is a utility kiosk, not a marketing page
- **Icons**: Use Heroicons for consistency, 24×24px standard size

### Image Treatment
- Dark overlays if using photos behind text
- High contrast maintained
- Optimize for fast loading (<100KB per image)

## Animations
- **Minimal**: Screen transitions only (fade in 200ms)
- **No**: Decorative animations, parallax, auto-playing content
- **Loading**: Simple spinner, no skeleton screens (adds complexity)

## Accessibility
- High contrast ratios (WCAG AAA where possible)
- Large touch targets exceed WCAG 2.5.5
- No time-based interactions except idle timeout
- Clear focus states for any navigation method

## Critical UX Patterns

### Booking Flow
1. Large hall selection cards with real-time status badges
2. Calendar with today/tomorrow quick picks + date picker
3. Time slots as horizontal scrollable pills
4. Confirmation screen: summary table + large "Confirm" button

### Deposit Flow
1. Amount selection: 3-5 preset buttons + custom input
2. QR code full-screen with prominent timer
3. Payment status with auto-polling feedback
4. Success screen with balance display

### Registration
1. Phone input with country code locked to +7
2. Name field (optional on first pass)
3. Checkbox for agreement (required)
4. Large "Complete Registration" button

---

**Design Philosophy**: This kiosk interface prioritizes operational clarity over visual flair. Every design decision serves immediate comprehension, error prevention, and efficient task completion. The dark theme provides modern appeal while ensuring optimal readability in various lighting conditions.