# Campus Events Hub - Frontend Client

A modern, simple, interactive, clean, and responsive frontend built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion** for exploring, creating, and managing university campus events and session schedules.

## 🚀 Key Features

- **Responsive & Modern Design**:
  - Academic campus aesthetic with elegant typography, soft ambient glows, and clean cards.
  - Fully adaptive from mobile smartphones to widescreen desktops.
  - Grid View and Compact List View toggles.
- **Interactive Animations with Framer Motion**:
  - Smooth card layout transitions and micro-interactions.
  - Fluid modal entrance, exit, and backdrop animations.
  - Animated toast alerts for CRUD and interactive feedback.
- **Rich Campus Event Experience**:
  - **Live Search**: Instant keyword matching across title, description, department/organizer, venue location, speaker names, and session titles.
  - **Dynamic Filtering**: Filter by Timeframe (All / Upcoming / Past) and Department/Organizer.
  - **Sorting**: Date (Soonest first, Latest first) or Title (A to Z).
  - **Event Details Modal**: Comprehensive view with session timeline, speaker chips, and HH:mm schedule.
  - **Add to Calendar**: Instant `.ics` calendar export for Google Calendar, Apple Calendar, and Outlook.
  - **Shareable Links**: Copy event direct links with instant confirmation toast.
  - **Event Creation & Editing**: Intuitive modal with a dynamic multi-session builder that validates HH:mm time formatting, speakers, titles, and dates.
  - **Safe Deletion**: Animated confirmation dialog.
- **Seamless Backend Integration**:
  - Designed to seamlessly communicate with the NestJS backend on `http://localhost:3000`.
  - Configured with Vite proxy to eliminate CORS without touching any backend code.
  - Real-time backend status badge with automatic detection and retry functionality.
  - Built-in fallback seed data for zero-config immediate preview when the backend is offline.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Motion & Animations**: Framer Motion
- **Icons**: Lucide React
- **Bundler**: Vite

---

## 🏃 Running the Client

### 1. Start the Frontend Dev Server
From the project root:
```bash
npm run dev --prefix campus-events-client
```
or inside `campus-events-client`:
```bash
cd campus-events-client
npm run dev
```
Open **[http://127.0.0.1:3001](http://127.0.0.1:3001)** in your browser.

### 2. Start the Backend Server (Optional / Recommended)
In a separate terminal:
```bash
npm run start --prefix campus-events-server
```
The NestJS backend will listen on `http://localhost:3000`. The frontend will automatically detect it and switch to live API data!
