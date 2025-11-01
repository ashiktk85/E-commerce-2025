export function validateRegistrationInput(email, password) {
    if (!email.includes('@')) {
        return { valid: false, message: "Invalid email address" };
    }
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long" };
    }
    return { valid: true };
}
//# sourceMappingURL=loginValidation.js.map