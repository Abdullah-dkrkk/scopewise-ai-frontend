# AGENTS.md - ScopeWise AI Frontend

## Project Overview
ScopeWise AI is an intelligent web-based system for software requirement analysis, scope creep prevention, and project estimation. This repository contains the **frontend** built with React 18.

---

## Strict Rules

### 1. Code Style & Standards
- **JavaScript/JSX**: Follow Airbnb style guide with ESLint
- **Naming**: camelCase for variables/functions, PascalCase for components
- **File naming**: PascalCase for component files (e.g., `RequirementInput.jsx`)
- **Folder naming**: kebab-case (e.g., `user-auth/`)
- **Imports**: React imports first, third-party second, local last
- **No inline styles** - Use Tailwind CSS classes only
- **No console.log** in production code - Use proper error handling

### 2. Component Structure
- **One component per file** - Maximum 150 lines per component
- **Functional components only** - No class components
- **Use React hooks** - useState, useEffect, useContext, useRef, useCallback, useMemo
- **Extract custom hooks** - Reusable logic goes in `/hooks` folder
- **Props validation** - Use PropTypes or TypeScript for all components

### 3. File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Modal)
│   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   └── charts/         # Chart components using Chart.js
├── pages/              # Route-level components
├── hooks/              # Custom React hooks
├── services/           # API service calls
├── context/            # React Context providers
├── utils/              # Helper functions
├── constants/          # App constants and config
└── assets/             # Static assets (images, icons)
```

### 4. State Management
- **React Context** for global state (auth, theme, notifications)
- **Local state** for component-specific data
- **No prop drilling** - Use context or custom hooks
- **Keep state minimal** - Derive values when possible

### 5. API Integration
- **Axios** for HTTP requests
- **Base URL from environment** - Use `VITE_API_URL` or `REACT_APP_API_URL`
- **Request/Response interceptors** for auth tokens
- **Error handling** - All API calls must have try-catch
- **Loading states** - Show loading indicators during API calls
- **API service layer** - All API calls in `/services` folder

### 6. Routing
- **React Router v6** for navigation
- **Protected routes** - Auth guard for authenticated pages
- **Route-level code splitting** - Use React.lazy for pages
- **Nested routes** - Organize routes hierarchically

### 7. Styling
- **Tailwind CSS** - Primary styling framework
- **No CSS-in-JS** - No styled-components or emotion
- **Responsive design** - Mobile-first approach
- **Dark mode support** - Use Tailwind's dark mode classes
- **Consistent spacing** - Use Tailwind's spacing scale

### 8. Testing
- **Jest + React Testing Library** for unit tests
- **Component tests** - Test user interactions, not implementation
- **No snapshot tests** - Focus on behavior testing
- **Minimum 70% code coverage** for critical paths

### 9. Git Workflow
- **Branch naming**: `feature/short-description`, `fix/short-description`
- **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`
- **No direct commits to main** - All changes via pull requests
- **Squash commits** before merging

### 10. Performance
- **Lazy loading** - Code split at route level
- **Image optimization** - Use WebP, lazy load images
- **Memoization** - Use React.memo for expensive components
- **Virtualization** - For long lists (use react-window)
- **Bundle analysis** - Check bundle size regularly

---

## Tech Stack
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Chart.js (via react-chartjs-2)
- Vite (build tool)

---

## Environment Variables
```env
VITE_API_URL=http://localhost:8000/api
VITE_ML_API_URL=http://localhost:5000/api
```

---

## Running the Project
```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Lint code
```
