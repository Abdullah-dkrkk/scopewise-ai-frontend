import { lazy } from 'react';
import { ENABLE_DESIGN_PREVIEW } from './config/env';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const RequirementAnalysis = lazy(() => import('./pages/RequirementAnalysis'));
const AnalysisResults = lazy(() => import('./pages/AnalysisResults'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));
const DesignPreview = lazy(() => import('./pages/DesignPreview'));

const routes = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  ...(ENABLE_DESIGN_PREVIEW ? [{ path: '/design-preview', element: <DesignPreview /> }] : []),
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'analyze', element: <RequirementAnalysis /> },
      { path: 'analysis/:id', element: <AnalysisResults /> },
      { path: 'history', element: <History /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
];

export default routes;
