import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  User, Mail, Lock, Save,
} from 'lucide-react';
import Card, {
  CardContent, CardDescription, CardHeader, CardTitle,
} from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authApi, toMessage } from '../api';

export function ProfileHeader({ user }) {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-xl border bg-card p-6 shadow-sm">
      <Avatar name={user?.name || 'User'} size="lg" />
      <div className="min-w-0">
        <p className="truncate font-heading text-lg font-semibold">{user?.name || 'User'}</p>
        <p className="truncate text-sm text-muted-foreground">{user?.email || ''}</p>
        <p className="mt-1 text-xs font-medium uppercase text-muted-foreground">
          {user?.role || 'user'}
        </p>
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default function Profile() {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  async function handleProfileUpdate(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setSaving(true);
    try {
      const updated = await authApi.updateProfile({ name: name.trim(), email: email.trim() });
      setName(updated.name);
      setEmail(updated.email);
      setSuccess('Profile updated successfully.');
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been saved.',
      });
    } catch (err) {
      const msg = toMessage(err, 'Could not save your profile.');
      setError(msg);
      addNotification({ type: 'error', title: 'Update Failed', message: msg });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from the current one.');
      return;
    }

    setPasswordSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully. Other sessions have been signed out.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addNotification({
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been updated.',
      });
    } catch (err) {
      const msg = toMessage(err, 'Could not change your password.');
      setPasswordError(msg);
      addNotification({ type: 'error', title: 'Password Change Failed', message: msg });
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <ProfileHeader user={user} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="size-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {error && <Alert variant="error" title="Update failed">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium">Full name</label>
              <Input
                id="profile-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium">Email</label>
              <Input
                id="profile-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
                required
                autoComplete="email"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="size-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="size-5" />
            Change Password
          </CardTitle>
          <CardDescription>Ensure your account stays secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <Alert variant="error" title="Password change failed">{passwordError}</Alert>
            )}
            {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
            <div>
              <label htmlFor="current-password" className="mb-1.5 block text-sm font-medium">
                Current password
              </label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={passwordSaving}
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">
                New password
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={passwordSaving}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="mb-1.5 block text-sm font-medium">
                Confirm new password
              </label>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={passwordSaving}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={passwordSaving}>
                <Lock className="size-4" />
                {passwordSaving ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <Mail className="size-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            This action cannot be undone. All your projects, analyses, and data will be
            permanently removed.
          </p>
          <Button
            variant="destructive"
            disabled
            title="Account deletion is not enabled yet"
            onClick={() => addNotification({
              type: 'warning',
              title: 'Not available',
              message: 'Account deletion is not enabled yet. Contact support to remove your data.',
            })}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
