/**
 * Accessible form validation utilities.
 * Ensures form error messages are clear and can be linked via aria-describedby.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateRequired(value: string, fieldLabel: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldLabel} is required.`,
    };
  }
  return { isValid: true };
}

export function validateEmail(email: string): ValidationResult {
  const requiredCheck = validateRequired(email, 'Email address');
  if (!requiredCheck.isValid) return requiredCheck;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid email address (e.g., name@example.com).',
    };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  const requiredCheck = validateRequired(password, 'Password');
  if (!requiredCheck.isValid) return requiredCheck;

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long.',
    };
  }
  return { isValid: true };
}

