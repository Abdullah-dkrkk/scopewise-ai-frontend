export function validateEmail(email) {
  if (!email) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email address.';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

export function validatePasswordConfirm(password, confirm) {
  if (password !== confirm) return 'Passwords do not match.';
  return '';
}

export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required.';
  return '';
}

export function validateProjectName(name) {
  if (!name || !name.trim()) return 'Project name is required.';
  return '';
}

export function validateRequirementText(text) {
  if (!text || !text.trim()) return 'Please describe the requirement before analyzing.';
  return '';
}
