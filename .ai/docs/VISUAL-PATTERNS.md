# 🎨 NOTION UI/UX PATTERNS - GÖRSEL REFERANS

> **Not:** Bu dosya web araştırmasından elde edilen görsel pattern'ları ve tasarım detaylarını içerir.

---

## 🎨 PART 1: COLOR PALETTE (Dark Mode)

### Notion's Exact Colors

**Background Colors:**
```css
--bg-primary: #191919      /* Main background */
--bg-secondary: #252525    /* Panels, cards */
--bg-tertiary: #2a2a2a     /* Hover states */
--bg-hover: #2f2f2f        /* Interactive hover */
```

**Text Colors:**
```css
--text-primary: #FFFFFF    /* Main text */
--text-secondary: #9B9A97  /* Muted text */
--text-tertiary: #787774   /* Disabled/placeholder */
```

**Border Colors:**
```css
--border-primary: #404040  /* Main borders */
--border-secondary: #373737 /* Subtle borders */
```

**Accent Colors:**
```css
--accent-blue: #2383E2     /* Primary actions */
--accent-blue-hover: #1D70C2
```

### Property Tag Colors

**10 Standard Colors:**
```css
/* Default */
--color-default-bg: rgba(55, 53, 47, 0.2)
--color-default-text: #9B9A97

/* Gray */
--color-gray-bg: rgba(155, 154, 151, 0.2)
--color-gray-text: #9B9A97

/* Brown */
--color-brown-bg: rgba(100, 71, 58, 0.2)
--color-brown-text: #64473A

/* Orange */
--color-orange-bg: rgba(217, 115, 13, 0.2)
--color-orange-text: #D9730D

/* Yellow */
--color-yellow-bg: rgba(223, 171, 1, 0.2)
--color-yellow-text: #DFAB01

/* Green */
--color-green-bg: rgba(15, 123, 108, 0.2)
--color-green-text: #0F7B6C

/* Blue */
--color-blue-bg: rgba(11, 110, 153, 0.2)
--color-blue-text: #0B6E99

/* Purple */
--color-purple-bg: rgba(105, 64, 165, 0.2)
--color-purple-text: #6940A5

/* Pink */
--color-pink-bg: rgba(173, 26, 114, 0.2)
--color-pink-text: #AD1A72

/* Red */
--color-red-bg: rgba(224, 62, 62, 0.2)
--color-red-text: #E03E3E
```

---

## 📐 PART 2: SPACING & SIZING

### Standard Spacing Scale (8px grid)
```css
--space-xs: 4px      /* Tiny gaps */
--space-sm: 8px      /* Small gaps */
--space-md: 12px     /* Medium gaps */
--space-lg: 16px     /* Large gaps */
--space-xl: 24px     /* Extra large gaps */
--space-2xl: 32px    /* Section spacing */
```

### Component Sizes
```css
/* Buttons */
--button-sm: 28px height
--button-md: 32px height
--button-lg: 40px height

/* Input fields */
--input-height: 32px
--input-padding: 8px 12px

/* Icons */
--icon-sm: 14px
--icon-md: 16px
--icon-lg: 20px
--icon-xl: 24px

/* Avatars */
--avatar-sm: 20px
--avatar-md: 24px
--avatar-lg: 32px
```

---

## 🔤 PART 3: TYPOGRAPHY

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes
```css
--text-xs: 11px      /* Tiny labels */
--text-sm: 12px      /* Property labels, metadata */
--text-base: 14px    /* Body text, table cells */
--text-lg: 16px      /* Emphasized text */
--text-xl: 20px      /* Subheadings */
--text-2xl: 24px     /* Page titles inline */
--text-3xl: 32px     /* Page titles full */
--text-4xl: 40px     /* Large titles */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Line Heights
```css
--leading-tight: 1.2    /* Headers */
--leading-normal: 1.5   /* Body text */
--leading-relaxed: 1.7  /* Long form */
```

---

## 📊 PART 4: TABLE VIEW SPECIFICATIONS

### Table Structure
```
Header Row:    height: 33px
Data Row:      height: 33px (min)
Cell Padding:  8px horizontal, 4px vertical
Column Width:  min: 100px, default: 180px, max: none
```

### Column Header
```html
<!-- Structure -->
<div class="column-header">
  <div class="drag-handle">⋮⋮</div>
  <div class="header-content">
    <span class="icon">📝</span>
    <span class="name">Property Name</span>
  </div>
  <div class="resize-handle"></div>
</div>

<!-- Styling -->
.column-header {
  height: 33px;
  background: #252525;
  border-bottom: 1px solid #404040;
  border-right: 1px solid #404040;
  font-size: 12px;
  font-weight: 500;
  color: #9B9A97;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.drag-handle {
  width: 24px;
  opacity: 0;
  cursor: grab;
}

.column-header:hover .drag-handle {
  opacity: 1;
}

.resize-handle {
  width: 4px;
  cursor: col-resize;
  position: absolute;
  right: 0;
  height: 100%;
}
```

### Table Cell
```html
<!-- Structure -->
<div class="table-cell">
  <div class="cell-content">
    <!-- Property-specific content -->
  </div>
</div>

<!-- Styling -->
.table-cell {
  padding: 4px 8px;
  border-right: 1px solid #373737;
  min-height: 33px;
  display: flex;
  align-items: center;
}

.table-cell:hover {
  background: #2a2a2a;
}

/* Editing state */
.table-cell.editing {
  background: #191919;
  border: 1px solid #2383E2;
  box-shadow: 0 0 0 1px #2383E2;
}
```

### Select Property Pill
```html
<!-- Structure -->
<div class="select-pill" style="--color: blue">
  <span>Status Name</span>
</div>

<!-- Styling -->
.select-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  background: var(--color-bg);
  color: var(--color-text);
  white-space: nowrap;
}

/* Color variants */
.select-pill[data-color="blue"] {
  --color-bg: rgba(11, 110, 153, 0.2);
  --color-text: #0B6E99;
}

.select-pill[data-color="green"] {
  --color-bg: rgba(15, 123, 108, 0.2);
  --color-text: #0F7B6C;
}
```

---

## 🃏 PART 5: BOARD VIEW (KANBAN) SPECIFICATIONS

### Board Layout
```
Column Width:     272px (fixed)
Column Gap:       16px
Card Width:       100% (of column)
Card Gap:         8px
Card Padding:     12px
Card Min Height:  80px
```

### Board Column
```html
<!-- Structure -->
<div class="board-column">
  <div class="column-header">
    <h3>Column Title</h3>
    <span class="count">3</span>
    <button class="collapse">▼</button>
  </div>
  <div class="cards-container">
    <!-- Cards here -->
  </div>
  <button class="add-card">+ New</button>
</div>

<!-- Styling -->
.board-column {
  width: 272px;
  background: #252525;
  border-radius: 4px;
  padding: 8px;
}

.column-header {
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.count {
  font-size: 12px;
  color: #9B9A97;
  background: #404040;
  padding: 2px 6px;
  border-radius: 10px;
}
```

### Board Card
```html
<!-- Structure -->
<div class="board-card">
  <div class="card-cover" style="background-image: url(...)"></div>
  <div class="card-content">
    <div class="card-icon">📝</div>
    <h4 class="card-title">Task Title</h4>
    <div class="card-properties">
      <div class="property-pill">Tag</div>
      <div class="property-pill">Status</div>
    </div>
    <div class="card-meta">
      <img class="avatar" src="..." />
      <span class="date">Jan 15</span>
    </div>
  </div>
</div>

<!-- Styling -->
.board-card {
  background: #191919;
  border: 1px solid #404040;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 150ms;
}

.board-card:hover {
  background: #252525;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.card-cover {
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 4px 4px 0 0;
}

.card-content {
  padding: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  margin: 4px 0 8px 0;
}

.card-properties {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #9B9A97;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
```

---

## 📅 PART 6: CALENDAR VIEW SPECIFICATIONS

### Calendar Layout
```
Cell Width:     14.28% (100% / 7 days)
Cell Height:    100px (min)
Header Height:  40px
Event Height:   22px
Event Padding:  2px 6px
Event Gap:      2px
```

### Calendar Header
```html
<div class="calendar-header">
  <button class="nav-btn">◀</button>
  <h2 class="month-year">January 2025</h2>
  <button class="nav-btn">▶</button>
  <button class="today-btn">Today</button>
</div>

<div class="calendar-weekdays">
  <div class="weekday">Mo</div>
  <div class="weekday">Tu</div>
  <div class="weekday">We</div>
  <div class="weekday">Th</div>
  <div class="weekday">Fr</div>
  <div class="weekday">Sa</div>
  <div class="weekday">Su</div>
</div>

<!-- Styling -->
.calendar-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #404040;
}

.month-year {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #404040;
}

.weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #9B9A97;
  padding: 8px;
}
```

### Calendar Day Cell
```html
<div class="calendar-day" data-current-month="true">
  <div class="day-number">15</div>
  <div class="events">
    <div class="event" style="--color: blue">
      Meeting
    </div>
    <div class="event" style="--color: green">
      Deadline
    </div>
  </div>
</div>

<!-- Styling -->
.calendar-day {
  min-height: 100px;
  border: 1px solid #373737;
  padding: 4px;
  background: #191919;
}

.calendar-day[data-current-month="false"] {
  background: #252525;
  opacity: 0.5;
}

.calendar-day.today {
  background: rgba(35, 131, 226, 0.1);
  border-color: #2383E2;
}

.day-number {
  font-size: 12px;
  font-weight: 500;
  color: #9B9A97;
  margin-bottom: 4px;
}

.event {
  font-size: 11px;
  padding: 2px 6px;
  margin-bottom: 2px;
  border-radius: 3px;
  background: var(--color-bg);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.event:hover {
  opacity: 0.8;
}
```

---

## 🎛️ PART 7: DROPDOWN MENUS

### Standard Dropdown
```html
<div class="dropdown-menu">
  <div class="dropdown-search">
    <input type="text" placeholder="Search..." />
  </div>
  <div class="dropdown-items">
    <div class="dropdown-item">
      <span class="icon">📝</span>
      <span class="label">Text</span>
    </div>
    <div class="dropdown-item active">
      <span class="icon">🔢</span>
      <span class="label">Number</span>
      <span class="checkmark">✓</span>
    </div>
    <div class="dropdown-divider"></div>
    <div class="dropdown-item danger">
      <span class="icon">🗑️</span>
      <span class="label">Delete</span>
    </div>
  </div>
</div>

<!-- Styling -->
.dropdown-menu {
  background: #252525;
  border: 1px solid #404040;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  min-width: 200px;
  max-width: 320px;
  padding: 4px;
}

.dropdown-search {
  padding: 4px;
  border-bottom: 1px solid #404040;
}

.dropdown-search input {
  width: 100%;
  background: #191919;
  border: none;
  padding: 6px 8px;
  font-size: 14px;
  color: #FFFFFF;
  border-radius: 3px;
}

.dropdown-items {
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 3px;
  transition: background 100ms;
}

.dropdown-item:hover {
  background: #2f2f2f;
}

.dropdown-item.active {
  background: rgba(35, 131, 226, 0.1);
  color: #2383E2;
}

.dropdown-item.danger {
  color: #E03E3E;
}

.dropdown-item .icon {
  width: 16px;
  font-size: 14px;
}

.dropdown-item .checkmark {
  margin-left: auto;
}

.dropdown-divider {
  height: 1px;
  background: #404040;
  margin: 4px 0;
}
```

---

## 🎨 PART 8: FILTER/SORT UI

### Filter Bar
```html
<div class="filter-bar">
  <button class="filter-toggle">
    <span class="icon">🔍</span>
    <span>Filter</span>
    <span class="badge">2</span>
  </button>
  
  <div class="active-filters">
    <div class="filter-chip">
      <span>Status is Done</span>
      <button class="remove">✕</button>
    </div>
    <div class="filter-chip">
      <span>Priority is High</span>
      <button class="remove">✕</button>
    </div>
  </div>
  
  <button class="clear-all">Clear all</button>
</div>

<!-- Styling -->
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #252525;
  border-bottom: 1px solid #404040;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #FFFFFF;
  font-size: 14px;
  cursor: pointer;
}

.filter-toggle:hover {
  background: #2f2f2f;
}

.badge {
  background: #2383E2;
  color: #FFFFFF;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(35, 131, 226, 0.1);
  border: 1px solid rgba(35, 131, 226, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #2383E2;
}

.filter-chip .remove {
  background: none;
  border: none;
  color: #2383E2;
  cursor: pointer;
  padding: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.filter-chip .remove:hover {
  opacity: 1;
}

.clear-all {
  margin-left: auto;
  background: none;
  border: none;
  color: #9B9A97;
  font-size: 12px;
  cursor: pointer;
}

.clear-all:hover {
  color: #FFFFFF;
}
```

---

## 🎯 PART 9: ANIMATIONS & TRANSITIONS

### Standard Transitions
```css
/* Hover effects */
transition: background 150ms ease;
transition: opacity 150ms ease;
transition: transform 150ms ease;

/* Modal/dropdown appearance */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

animation: fadeIn 200ms ease-out;

/* Drag & drop */
transition: box-shadow 200ms ease;

.dragging {
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  transform: rotate(2deg);
}
```

### Loading States
```html
<div class="skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
</div>

<!-- Styling -->
.skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    #252525 0%,
    #2f2f2f 50%,
    #252525 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 📱 PART 10: RESPONSIVE BREAKPOINTS

### Desktop First Approach
```css
/* Desktop (default) */
.database-view {
  padding: 24px;
}

/* Tablet */
@media (max-width: 1024px) {
  .database-view {
    padding: 16px;
  }
  .board-column {
    width: 240px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .database-view {
    padding: 12px;
  }
  .table-view {
    overflow-x: auto;
  }
  .board-view {
    flex-direction: column;
  }
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

Use this to ensure pixel-perfect recreation:

- [ ] Colors match exactly (use color picker on Notion)
- [ ] Fonts are Inter (with fallbacks)
- [ ] Spacing follows 8px grid
- [ ] Border radius is 4px for most elements
- [ ] Hover states are subtle (#2f2f2f background)
- [ ] Focus states have blue outline (#2383E2)
- [ ] Animations are smooth (150-200ms)
- [ ] Dropdown shadows are consistent
- [ ] Icon sizes are 14px/16px/20px
- [ ] Pills have 0.2 alpha backgrounds

---

**Kaynak:** Web research + Notion UI inspection  
**Tarih:** 12 Ocak 2025