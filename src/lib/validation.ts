/**
 * Centralized validation utilities for premium toast-based feedback.
 */

export const VALIDATION_REGEX = {
  // Standard email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Basic phone validation (allows +, space, digits, parens)
  PHONE: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
};

export function validateEmail(email: string): boolean {
  return VALIDATION_REGEX.EMAIL.test(email);
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  return VALIDATION_REGEX.PHONE.test(phone);
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
