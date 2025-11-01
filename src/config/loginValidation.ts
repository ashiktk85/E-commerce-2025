export interface ValidationResult {
    valid: boolean;
    message?: string;
  }
  
  export function validateRegistrationInput(email: string, password: string): ValidationResult {
    if (!email.includes('@')) {
      return { valid: false, message: "Invalid email address" };
    }
    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters long" };
    }
    return { valid: true };
  }
  