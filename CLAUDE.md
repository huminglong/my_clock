# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js single-page time management application with current time display, countdown timer, stopwatch, todo list (file-based persistence), and light/dark theme toggle. UI and documentation are in Chinese.

## Commands

```bash
npm run dev      # Start development server on port 3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Alternative: Use `bun` instead of `npm` (bun.lock present).

## Technology Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 + PostCSS
- Node.js 18+ recommended

## Architecture

All UI components are client components (`'use client'` directive) located in `app/components/`:
- `CurrentTime.tsx` - Real-time clock (1s interval)
- `Countdown.tsx` - Timer with hour/minute/second controls
- `Stopwatch.tsx` - Start/pause/resume/reset functionality
- `TodoList.tsx` - Todo CRUD with API integration
- `ThemeToggle.tsx` - Theme switcher (persists to localStorage)

**API Route:** `app/api/todos/route.ts` - REST API for todo CRUD operations using file system storage.

**Data Storage:** `storage/todos.json` is local development only - not suitable for production deployment.

## Key Conventions

- **Path alias:** Use `@/*` to import from project root
- **Theme system:** Dark mode via `.dark` class on `document.documentElement`, controlled by CSS variables in `globals.css`
- **Styling:** CSS custom properties define the design system; Tailwind utilities for layout
- **Components:** Keep single responsibility; mark client components with `'use client'`

## API Endpoints

All endpoints at `/api/todos`:
- `GET` - Fetch all todos
- `POST` - Create todo (`{ "title": "..." }`)
- `PUT` - Update todo (`{ "id": "...", "completed": true }`)
- `DELETE ?id={id}` - Delete todo

## Important Notes

- No test framework configured
- File-based storage requires replacing with database for production
- Main layout uses responsive 3-column grid (`app/page.tsx`)
