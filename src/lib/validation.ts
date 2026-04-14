/**
 * Forensic Validation Protocols
 */

export const VALIDATION_PROTOCOLS = {
  EMAIL_IDENTITY: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  STRICT_CONTACT: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
};

export function validateEmailIdentity(email: string): boolean {
  return VALIDATION_PROTOCOLS.EMAIL_IDENTITY.test(email);
}

export function validateContactString(phone: string): boolean {
  if (!phone) return true;
  return VALIDATION_PROTOCOLS.STRICT_CONTACT.test(phone);
}

export function isInputPopulated(value: string): boolean {
  return value.trim().length > 0;
}
