# NOTION CLONE PROJECT RULES

## Project Overview
Desktop application: Notion-like database system with local storage
Stack: Electron + React + TypeScript + SQLite + Tailwind CSS

## Tech Stack (Exact Versions)
- Electron 39.2.7
- React 18.3.1
- TypeScript 5.8.3
- Tailwind CSS 3.4.19
- better-sqlite3 12.5.0
- @tanstack/react-table 8.21.3
- @dnd-kit/core 6.3.1
- Zustand 5.0.9
- Lucide React 0.511.0

## Design System (Notion Dark Mode)
```css
--bg: #191919           /* Main background */
--panel: #252525        /* Panels, cards */
--border: #404040       /* Borders */
--text: #FFFFFF         /* Primary text */
--muted: #A0A0A0        /* Secondary text */
--selection: #2383e2    /* Accent/selection */
```

## Coding Standards

### TypeScript
- Strict mode enabled
- Explicit types (no `any`)
- Interfaces for data structures
- Type guards where needed

### React
- Functional components only
- Custom hooks for logic
- No class components
- Props interfaces required

### Styling
- Tailwind CSS only (no CSS modules, no inline styles)
- Use design tokens from above
- Follow 8px spacing grid
- Component-level variants with clsx/cn

### File Structure
```
src/
├── components/
│   └── database/
│       ├── cells/          # Property cell components
│       ├── views/          # Table, Board, Calendar views
│       └── PropertyManager.tsx
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
└── utils/                  # Helper functions

electron/
├── main.ts                 # Main process
├── preload.ts             # Preload script
└── db.ts                  # SQLite operations
```

### Database Conventions
- Use UUIDs for IDs
- Snake_case for SQL columns
- CamelCase for TypeScript
- JSON for complex values in SQLite

### IPC Naming
- Format: `namespace:action`
- Example: `db:createPage`, `property:setValue`

## Property Types (Core Set)
1. Text - plain text
2. Number - with formatting (plain, percent, currency)
3. Select - single choice with color
4. Multi-select - multiple choices
5. Date - with optional time
6. Checkbox - boolean
7. Status - special (To-do/In Progress/Complete groups)

## Reference Documents
- Detailed property specs: `.ai/docs/NOTION-RESEARCH.md`
- UI/UX patterns: `.ai/docs/VISUAL-PATTERNS.md`

## Current Implementation Status
- ✅ Basic Electron setup
- ✅ React + Vite
- ✅ BlockNote editor
- ✅ Simple page system
- ❌ Property system (NEXT)
- ❌ Table view v2
- ❌ Filtering/sorting
- ❌ Multiple views

## Code Generation Guidelines
1. Always provide complete, working code (no snippets)
2. Include TypeScript types
3. Add error handling
4. Follow the file structure above
5. Use Tailwind utilities (never inline styles)
6. Make components accessible (keyboard nav, ARIA)
7. Include usage examples in comments

## Icons
- Use Lucide React
- Sizes: 14px (small), 16px (default), 20px (large)
- Always include aria-label for icon-only buttons