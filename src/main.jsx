import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import ConfigErrorScreen from './components/common/ConfigErrorScreen';
import { CONFIG_ERRORS, CONFIG_IS_VALID } from './config/env';
import './styles/globals.css';

const container = document.getElementById('root');
const root = createRoot(container);

if (CONFIG_IS_VALID) {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <ConfigErrorScreen problems={CONFIG_ERRORS} />
    </StrictMode>,
  );
}
