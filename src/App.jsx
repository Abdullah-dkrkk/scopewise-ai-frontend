import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Spinner from './components/ui/Spinner';
import Toast from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import routes from './routes';

const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function renderRoutes(items) {
  return items.map(({
    path, index, element, children,
  }) => (
    <Route key={path || index} path={path} index={index} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {renderRoutes(routes)}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toast />
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
}
