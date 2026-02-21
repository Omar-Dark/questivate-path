
# Profile Page Redesign

## Overview
Redesign the profile page into a modern, elegant two-mode layout: a **view mode** (default) showing a polished profile card with all user info, and an **edit mode** toggled by an "Edit Profile" button. The statistics section will be expanded with rich dummy data for quizzes, projects, roadmaps, and tracks.

## Layout Structure

### Top Section: Profile Hero Banner
- Large glassmorphism card with a gradient accent banner at the top
- Large centered avatar with neon glow ring
- Display name, username (@handle), bio underneath
- Location, member since date, social link icons (GitHub, LinkedIn, Globe) as clickable icon buttons
- "Edit Profile" button that toggles inline editing

### View Mode (Default)
- All profile fields shown as styled text (not inputs)
- Contact info (email, phone, location, birth date) displayed in a clean grid with icons
- Social links shown as small icon-only buttons with tooltips

### Edit Mode (Toggled)
- Same layout transforms: text becomes editable inputs
- "Save" and "Cancel" buttons replace the "Edit Profile" button
- Uses existing Zod validation and save logic
- Smooth transition via `isEditing` state toggle

### Statistics Section (Right Column / Below on mobile)
Expanded with 4 sub-sections, all using dummy data:

1. **Overview Cards** (top row of 4 mini stat cards):
   - Active Tracks: 5
   - Completed: 2
   - Quizzes Taken: 8
   - Achievements: 3

2. **Quiz Performance** (new section):
   - Dummy data for recent quizzes with scores, dates, and pass/fail badges
   - Average score display
   - Example entries: "JavaScript Basics (92%)", "React Hooks (78%)", "CSS Grid (100%)", "TypeScript Advanced (65%)"

3. **Roadmap and Track Progress** (new section):
   - Progress bars for active tracks with percentage
   - Example: "Frontend Development (72%)", "Backend with Node.js (45%)", "React Mastery (100%)", "DevOps Fundamentals (30%)"

4. **Project Progress** (new section):
   - Cards showing project name, status badge (In Progress / Completed / Not Started), and progress percentage
   - Example: "E-Commerce App (85%)", "Portfolio Website (100%)", "Chat Application (40%)"

### Removed
- "Completed Courses" and "Bookmarked Courses" cards removed from the left column (their data is now represented in the statistics section)
- "Quick Actions" card removed

---

## Technical Details

### File Changes
- **`src/pages/Profile.tsx`** -- Full rewrite of the component:
  - Add `isEditing` state (boolean, default false)
  - Define dummy data objects at the top:
    - `dummyQuizHistory`: array of quiz results with title, score, date, passed
    - `dummyTrackProgress`: array with track name, progress percentage, status
    - `dummyProjectProgress`: array with project name, progress, status
  - View mode renders profile data as styled text elements
  - Edit mode renders existing form inputs
  - Statistics section uses Tabs component (Overview / Quizzes / Learning / Projects)
  - Uses existing glass-card, gradient-primary, glow-cyan CSS utilities
  - Uses existing ProgressCircle component for visual progress indicators
  - Uses Progress component from ui for horizontal progress bars
  - Framer Motion stagger animations on stat cards

### No new files or dependencies needed
All components (Card, Badge, Progress, Tabs, Avatar, Separator, Tooltip) and utilities (glass-card, gradient-primary, glow-cyan) already exist in the project.
