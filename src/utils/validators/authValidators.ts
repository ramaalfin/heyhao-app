/**
 * Authentication Form Validators
 * 
 * Validation functions for authentication forms.
 * Each validator returns null for valid input or an error message string for invalid input.
 */

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns null if valid, error message if invalid
 */
export const validateEmail = (email: string): string | null => {
	if (!email || email.trim().length === 0) {
		return "Email is required";
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		return "Invalid email format";
	}

	return null;
};

/**
 * Validates password length for registration and password reset
 * @param password - Password to validate
 * @returns null if valid, error message if invalid
 */
export const validatePassword = (password: string): string | null => {
	if (!password || password.length === 0) {
		return "Password is required";
	}

	if (password.length < 6) {
		return "Password must be at least 6 characters long";
	}

	return null;
};

/**
 * Validates password for sign-in (only checks if not empty)
 * @param password - Password to validate
 * @returns null if valid, error message if invalid
 */
export const validateSignInPassword = (password: string): string | null => {
	if (!password || password.length === 0) {
		return "Password is required";
	}

	return null;
};

/**
 * Validates name length
 * @param name - Name to validate
 * @returns null if valid, error message if invalid
 */
export const validateName = (name: string): string | null => {
	if (!name || name.trim().length === 0) {
		return "Name is required";
	}

	if (name.trim().length < 1) {
		return "Name must be at least 1 character long";
	}

	return null;
};

/**
 * Validates that password and confirm password match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns null if valid, error message if invalid
 */
export const validatePasswordMatch = (
	password: string,
	confirmPassword: string
): string | null => {
	if (!confirmPassword || confirmPassword.length === 0) {
		return "Confirm Password is required";
	}

	if (password !== confirmPassword) {
		return "Passwords don't match";
	}

	return null;
};

/**
 * Validates all sign-up form fields
 * @param name - User's name
 * @param email - User's email
 * @param password - User's password
 * @returns Object with field errors, or empty object if all valid
 */
export const validateSignUpForm = (
	name: string,
	email: string,
	password: string
): Record<string, string> => {
	const errors: Record<string, string> = {};

	const nameError = validateName(name);
	if (nameError) errors.name = nameError;

	const emailError = validateEmail(email);
	if (emailError) errors.email = emailError;

	const passwordError = validatePassword(password);
	if (passwordError) errors.password = passwordError;

	return errors;
};

/**
 * Validates all sign-in form fields
 * @param email - User's email
 * @param password - User's password
 * @returns Object with field errors, or empty object if all valid
 */
export const validateSignInForm = (
	email: string,
	password: string
): Record<string, string> => {
	const errors: Record<string, string> = {};

	const emailError = validateEmail(email);
	if (emailError) errors.email = emailError;

	const passwordError = validateSignInPassword(password);
	if (passwordError) errors.password = passwordError;

	return errors;
};

/**
 * Validates forgot password form
 * @param email - User's email
 * @returns Object with field errors, or empty object if all valid
 */
export const validateForgotPasswordForm = (
	email: string
): Record<string, string> => {
	const errors: Record<string, string> = {};

	const emailError = validateEmail(email);
	if (emailError) errors.email = emailError;

	return errors;
};

/**
 * Validates update password form
 * @param password - New password
 * @param confirmPassword - Confirmation password
 * @returns Object with field errors, or empty object if all valid
 */
export const validateUpdatePasswordForm = (
	password: string,
	confirmPassword: string
): Record<string, string> => {
	const errors: Record<string, string> = {};

	const passwordError = validatePassword(password);
	if (passwordError) errors.password = passwordError;

	const matchError = validatePasswordMatch(password, confirmPassword);
	if (matchError) errors.confirmPassword = matchError;

	return errors;
};
