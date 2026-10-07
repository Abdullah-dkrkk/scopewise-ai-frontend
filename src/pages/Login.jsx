import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state && location.state.from ? location.state.from.pathname : '/app';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err.response && err.response.data && err.response.data.message) || 'Sign in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to analyze and scope your requirements"
      footer={(
        <>
          Don&apos;t have an account?
          {' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error" title="Sign in failed">{error}</Alert>}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in...' : (
            <>
              <LogIn />
              Sign In
            </>
          )}
        </Button>
        <div className="rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
          Demo account:
          {' '}
          <span className="font-mono font-medium">test@scopewise.ai</span>
          {' '}
          /
          {' '}
          <span className="font-mono font-medium">password123</span>
        </div>
      </form>
    </AuthShell>
  );
}
