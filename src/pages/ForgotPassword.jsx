import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { authApi, toMessage } from '../api';

const GENERIC_SUCCESS = 'If an account exists for that email, we have sent a password reset link.';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await authApi.forgotPassword(email.trim());
      // Never surface backend wording here — the response is intentionally
      // identical whether or not the account exists.
      setSuccess(GENERIC_SUCCESS);
    } catch (err) {
      setError(toMessage(err, 'Could not send the reset email. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset link"
      footer={(
        <Link to="/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error" title="Reset failed">{error}</Alert>}
        {success && (
          <Alert variant="success" title="Check your inbox">
            {success}
          </Alert>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            required
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          <Mail className="size-4" />
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </AuthShell>
  );
}
