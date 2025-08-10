# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo with separate frontend and backend folders:
- `frontend/` - Next.js 15.3.5 application with TypeScript, Tailwind CSS v4, and Turbopack
- `backend/` - Backend service (currently empty, awaiting implementation)

## Development Commands

### Frontend
All frontend commands should be run from the `frontend/` directory:

```bash
cd frontend
npm run dev        # Start development server with Turbopack on http://localhost:3000
npm run build      # Build production bundle
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Architecture

### Frontend Stack
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Build Tool**: Turbopack for development
- **Font**: Geist font family (auto-optimized)

### Key Configuration
- TypeScript path alias: `@/*` maps to `./src/*`
- Strict TypeScript configuration with ES2017 target
- ESLint configured with Next.js defaults

### Current Implementation
The frontend is a fresh Next.js installation with:
- Default landing page at `src/app/page.tsx`
- Global styles in `src/app/globals.css`
- Root layout in `src/app/layout.tsx`

## IMPORTANT: UI/UX Development Rules

1. **ALWAYS read `design_reference.md` before creating or modifying any UI components**
2. Every UI element must follow the design system specified in design_reference.md
3. When uncertain about styling, check design_reference.md first
4. Use the exact color codes, spacing, and typography defined in the reference

## Workflow for UI Tasks
- First: Read design_reference.md
- Second: Understand the component requirements  
- Third: Implement following the design system
- Fourth: Ensure responsive behavior matches the specs

## Testing Requirements
- Use Playwright to screenshot components after creation
- Verify responsive breakpoints (mobile: 375px, tablet: 768px, desktop: 1440px)
- Test hover states and animations

## Reference
Design inspiration: https://www.behance.net/gallery/222314129/Sport-Bets-Interface-UXUI-design
Always maintain visual consistency with this reference.

The backend folder exists but has no implementation yet.
- after any chage you do , run tests to 100% sure it's works

/src## 🎯 RESPONSIVE DESIGN REQUIREMENTS (MANDATORY)

### Every component MUST be responsive for these breakpoints:
- **Mobile**: 320px - 767px (minimum support 320px iPhone SE)
- **Tablet**: 768px - 1023px (iPad Portrait/Landscape)
- **Desktop**: 1024px - 1919px (Standard screens)
- **Large Desktop**: 1920px+ (4K and ultrawide monitors)

### Mobile-First Approach:
- ALWAYS start with mobile styles as the base
- Use min-width media queries to enhance for larger screens
- Touch targets must be minimum 44x44px on mobile
- Text must be minimum 16px on mobile to prevent zoom

### Required Device Testing:
- iPhone SE (375px) - Smallest common device
- iPhone 14/15 Pro (430px)
- iPad Mini (768px)
- iPad Pro (1024px)
- Desktop (1440px)
- 4K Display (2560px)

## 🌐 CROSS-BROWSER COMPATIBILITY (MANDATORY)

### Must Support:
- Chrome 90+ (and Chromium-based: Edge, Brave, Opera)
- Firefox 88+
- Safari 14+ (macOS and iOS)
- Edge 90+

### CSS Requirements:
- Include vendor prefixes for:
  * -webkit- (Safari, Chrome)
  * -moz- (Firefox)
  * -ms- (older Edge)
- Use CSS Grid and Flexbox with fallbacks
- Avoid bleeding-edge CSS features without fallbacks

### JavaScript Requirements:
- Use ES6 with transpilation for older browsers
- Avoid using browser-specific APIs
- Test for feature availability before using
  /components  - All React/JS components
  /styles      - CSS files following design_reference.md
  /assets      - Images and icons
  
