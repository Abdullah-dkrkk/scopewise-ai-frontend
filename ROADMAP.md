# ScopeWise AI - Frontend Project Roadmap

## Project Structure

```
scopewise-ai-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/                    # Base UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── Tooltip.jsx
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── charts/                # Chart components
│   │   │   ├── RequirementChart.jsx
│   │   │   ├── ComplexityChart.jsx
│   │   │   └── RiskChart.jsx
│   │   └── features/              # Feature-specific components
│   │       ├── auth/
│   │       │   ├── LoginForm.jsx
│   │       │   ├── RegisterForm.jsx
│   │       │   └── ForgotPassword.jsx
│   │       ├── requirements/
│   │       │   ├── RequirementInput.jsx
│   │       │   ├── RequirementList.jsx
│   │       │   ├── RequirementCard.jsx
│   │       │   └── RequirementDetails.jsx
│   │       ├── analysis/
│   │       │   ├── AnalysisResults.jsx
│   │       │   ├── ClassificationBadge.jsx
│   │       │   ├── RiskAssessment.jsx
│   │       │   ├── ComplexityScore.jsx
│   │       │   └── EstimationPanel.jsx
│   │       ├── questions/
│   │       │   ├── QuestionList.jsx
│   │       │   └── QuestionCard.jsx
│   │       └── dashboard/
│   │           ├── StatsCard.jsx
│   │           ├── RecentProjects.jsx
│   │           └── ActivityFeed.jsx
│   ├── pages/                     # Route-level pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── RequirementAnalysis.jsx
│   │   ├── AnalysisResults.jsx
│   │   ├── History.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useRequirements.js
│   ├── services/                   # API service layer
│   │   ├── api.js                 # Axios instance & interceptors
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   ├── requirementService.js
│   │   └── analysisService.js
│   ├── context/                    # React Context
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── utils/                      # Helper functions
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── assets/                     # Static assets
│   │   ├── images/
│   │   └── icons/
│   ├── styles/                     # Global styles
│   │   └── globals.css
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   └── routes.jsx                  # Route definitions
├── .env.example                    # Environment variables template
├── .eslintrc.cjs                   # ESLint configuration
├── tailwind.config.js              # Tailwind configuration
├── vite.config.js                  # Vite configuration
├── package.json                    # Dependencies
└── README.md
```

---

## Development Phases

### Phase 1: Project Setup (Day 1)
- [ ] Initialize Vite + React project
- [ ] Install dependencies (Tailwind, React Router, Axios, Chart.js)
- [ ] Configure ESLint, Tailwind, and Vite
- [ ] Set up folder structure
- [ ] Create base UI components (Button, Input, Modal, Card)
- [ ] Set up API service layer with Axios

### Phase 2: Authentication (Day 2)
- [ ] Create AuthContext for state management
- [ ] Build Login page and form
- [ ] Build Register page and form
- [ ] Implement JWT token handling (storage, refresh, logout)
- [ ] Create protected route component
- [ ] Add form validation

### Phase 3: Layout & Navigation (Day 3)
- [ ] Build MainLayout with Header, Sidebar, Footer
- [ ] Implement responsive sidebar (mobile hamburger menu)
- [ ] Set up React Router with nested routes
- [ ] Create navigation links
- [ ] Add route-level code splitting (React.lazy)

### Phase 4: Dashboard (Day 4)
- [ ] Build Dashboard page
- [ ] Create StatsCard component
- [ ] Build RecentProjects component
- [ ] Create ActivityFeed component
- [ ] Integrate with backend API for dashboard data

### Phase 5: Project Management (Day 5)
- [ ] Build Projects page (list view)
- [ ] Create ProjectCard component
- [ ] Build ProjectDetail page
- [ ] Implement project CRUD operations
- [ ] Add search and filter functionality

### Phase 6: Requirement Input (Day 6-7)
- [ ] Build RequirementAnalysis page
- [ ] Create RequirementInput component (text area with validation)
- [ ] Implement requirement submission to ML API
- [ ] Add loading states and error handling
- [ ] Create RequirementList and RequirementCard components

### Phase 7: Analysis Results (Day 8-9)
- [ ] Build AnalysisResults page
- [ ] Create ClassificationBadge component
- [ ] Build RiskAssessment component
- [ ] Create ComplexityScore component
- [ ] Build EstimationPanel component
- [ ] Integrate Chart.js for visualizations

### Phase 8: Questions & Communication (Day 10)
- [ ] Build QuestionList component
- [ ] Create QuestionCard component
- [ ] Implement question display from ML API
- [ ] Add question response functionality

### Phase 9: History & Profile (Day 11)
- [ ] Build History page with previous analyses
- [ ] Build Profile page
- [ ] Implement user settings
- [ ] Add data export functionality

### Phase 10: Polish & Testing (Day 12-14)
- [ ] Add dark mode support
- [ ] Implement notifications (toast alerts)
- [ ] Write unit tests for critical components
- [ ] Performance optimization (lazy loading, memoization)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Documentation updates

---

## API Endpoints (Frontend Integration)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Requirements
- `POST /api/requirements/analyze` - Submit requirement text
- `GET /api/requirements/:id` - Get requirement details
- `GET /api/projects/:id/requirements` - List project requirements

### Analysis
- `GET /api/analysis/:id` - Get analysis results
- `GET /api/analysis/:id/questions` - Get generated questions
- `GET /api/history` - Get analysis history

---

## Component Examples

### Button Component
```jsx
// src/components/ui/Button.jsx
const Button = ({ children, variant = 'primary', size = 'md', disabled, onClick, className }) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
```

### API Service Example
```jsx
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Environment Setup

### Required Tools
- Node.js 18+
- npm or yarn
- Git

### Development Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs at http://localhost:5173
```

---

## Git Branching Strategy

```
main
├── develop
│   ├── feature/auth-system
│   ├── feature/dashboard
│   ├── feature/requirement-input
│   ├── feature/analysis-results
│   └── feature/chart-visualizations
```

---

## Checklist Before Each Commit
- [ ] Code follows ESLint rules
- [ ] No console.log statements
- [ ] Components are properly formatted
- [ ] All props have PropTypes defined
- [ ] API calls have error handling
- [ ] Loading states are implemented
- [ ] Responsive design works
