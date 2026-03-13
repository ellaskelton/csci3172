class ValidationResult {
    static invalid(message) {
        return { valid: false, message };
    }

    static valid() {
        return { valid: true, message: '' };
    }
}

class UserDatabase {
    constructor() {
        this.defaultUsers = {
            "johnDoe": "P@ssw0rd123!",
            "janeSmith": "SecureP@ss456!",
            "adminUser": "Admin@123456!",
            "testUser": "Test@Pass789!"
        };
        this.users = this.loadUsers();
        this.registeredUsernames = new Set(Object.keys(this.users));
    }

    loadUsers() {
        try {
            const storedUsers = localStorage.getItem('usersDatabase');
            if (storedUsers) {
                return JSON.parse(storedUsers);
            }
        } catch (error) {
            console.error('Error loading users from localStorage:', error);
        }
        return { ...this.defaultUsers };
    }

    saveUsers() {
        try {
            localStorage.setItem('usersDatabase', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users to localStorage:', error);
        }
    }

    addUser(username, password) {
        const trimmedUsername = (username || '').trim();
        this.users[trimmedUsername] = password;
        this.registeredUsernames.add(trimmedUsername);
        this.saveUsers();
    }

    authenticate(username, password) {
        const trimmedUsername = (username || '').trim();
        return this.users[trimmedUsername] === password;
    }
}

class Validator {
    constructor() {
        this.validationMessages = new Map([
            ['emailInvalid', 'Email must follow traditional format with TLD between 2-8 characters'],
            ['emailRequired', 'Email is required'],
            ['usernameInvalid', 'Username must not begin with a number or contain spaces/special characters'],
            ['usernameRequired', 'Username is required'],
            ['usernameExists', 'Username already exists'],
            ['passwordWeak', 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character'],
            ['passwordRequired', 'Password is required'],
            ['passwordMismatch', 'Passwords do not match']
        ]);
        this.specialChars = new Set(['@', '$', '!', '%', '*', '?', '&']);
    }

    isValidChar(char) {
        return char && char.length > 0;
    }

    getCharCode(char) {
        return this.isValidChar(char) ? char.charCodeAt(0) : 0;
    }

    isLetter(char) {
        if (!this.isValidChar(char)) return false;
        const code = this.getCharCode(char);
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    }

    isDigit(char) {
        if (!this.isValidChar(char)) return false;
        const code = this.getCharCode(char);
        return code >= 48 && code <= 57;
    }

    isUppercase(char) {
        if (!this.isValidChar(char)) return false;
        const code = this.getCharCode(char);
        return code >= 65 && code <= 90;
    }

    isLowercase(char) {
        if (!this.isValidChar(char)) return false;
        const code = this.getCharCode(char);
        return code >= 97 && code <= 122;
    }

    isSpecialChar(char) {
        return this.specialChars.has(char);
    }

    validateEmail(email) {
        const trimmedEmail = (email || '').trim();
        if (trimmedEmail.length === 0) {
            return ValidationResult.invalid(this.validationMessages.get('emailRequired'));
        }

        const atIndex = trimmedEmail.indexOf('@');
        
        if (atIndex === -1 || atIndex === 0) {
            return ValidationResult.invalid(this.validationMessages.get('emailInvalid'));
        }

        const localPart = trimmedEmail.substring(0, atIndex);
        const domainPart = trimmedEmail.substring(atIndex + 1);
        const dotIndex = domainPart.lastIndexOf('.');

        if (dotIndex === -1 || dotIndex === 0 || dotIndex === domainPart.length - 1) {
            return ValidationResult.invalid(this.validationMessages.get('emailInvalid'));
        }

        const domain = domainPart.substring(0, dotIndex);
        const tld = domainPart.substring(dotIndex + 1);

        if (domain.length === 0 || tld.length < 2 || tld.length > 8) {
            return ValidationResult.invalid(this.validationMessages.get('emailInvalid'));
        }

        const emailChars = [...trimmedEmail];
        const hasInvalidChar = emailChars.some(char => 
            char === ' ' || (char !== '@' && char !== '.' && !this.isLetter(char) && !this.isDigit(char) && char !== '_' && char !== '-' && char !== '+')
        );

        if (hasInvalidChar) {
            return ValidationResult.invalid(this.validationMessages.get('emailInvalid'));
        }

        const tldChars = [...tld];
        const tldIsValid = tldChars.every(char => this.isLetter(char));

        if (!tldIsValid) {
            return ValidationResult.invalid(this.validationMessages.get('emailInvalid'));
        }

        return ValidationResult.valid();
    }

    validateUsername(username, registeredUsernames) {
        const trimmedUsername = (username || '').trim();
        if (trimmedUsername.length === 0) {
            return ValidationResult.invalid(this.validationMessages.get('usernameRequired'));
        }

        const firstChar = trimmedUsername[0];

        if (this.isDigit(firstChar)) {
            return ValidationResult.invalid(this.validationMessages.get('usernameInvalid'));
        }

        const usernameChars = [...trimmedUsername];
        const hasInvalidChar = usernameChars.some(char => 
            !this.isLetter(char) && !this.isDigit(char)
        );

        if (hasInvalidChar) {
            return ValidationResult.invalid(this.validationMessages.get('usernameInvalid'));
        }

        if (registeredUsernames.has(trimmedUsername)) {
            return ValidationResult.invalid(this.validationMessages.get('usernameExists'));
        }

        return ValidationResult.valid();
    }

    validatePassword(password) {
        const trimmedPassword = (password || '').trim();
        if (trimmedPassword.length === 0) {
            return ValidationResult.invalid(this.validationMessages.get('passwordRequired'));
        }

        if (password.length < 12) {
            return ValidationResult.invalid(this.validationMessages.get('passwordWeak'));
        }

        const passwordChars = [...password];
        const hasUppercase = passwordChars.some(char => this.isUppercase(char));
        const hasLowercase = passwordChars.some(char => this.isLowercase(char));
        const hasNumber = passwordChars.some(char => this.isDigit(char));
        const hasSpecial = passwordChars.some(char => this.isSpecialChar(char));

        if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
            return ValidationResult.invalid(this.validationMessages.get('passwordWeak'));
        }

        return ValidationResult.valid();
    }

    validateConfirmPassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            return ValidationResult.invalid(this.validationMessages.get('passwordMismatch'));
        }
        return ValidationResult.valid();
    }

    checkPasswordRequirements(password) {
        if (!password) {
            return {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false
            };
        }

        const passwordChars = [...password];
        return {
            length: password.length >= 12,
            uppercase: passwordChars.some(char => this.isUppercase(char)),
            lowercase: passwordChars.some(char => this.isLowercase(char)),
            number: passwordChars.some(char => this.isDigit(char)),
            special: passwordChars.some(char => this.isSpecialChar(char))
        };
    }
}

class FormHandler {
    constructor(userDatabase, validator) {
        this.userDatabase = userDatabase;
        this.validator = validator;
    }

    updateInputState(element, isValid) {
        if (!element) return;
        if (isValid) {
            element.classList.remove('invalid');
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
            element.classList.add('invalid');
        }
    }

    displayError(elementId, errorElementId, message, isValid) {
        const inputElement = document.getElementById(elementId);
        const errorElement = document.getElementById(errorElementId);
        
        if (inputElement && errorElement) {
            this.updateInputState(inputElement, isValid);
            errorElement.textContent = isValid ? '' : message;
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(element => {
            element.textContent = '';
        });
        
        document.querySelectorAll('input').forEach(element => {
            element.classList.remove('valid', 'invalid');
        });
    }

    updatePasswordRequirements(password) {
        const requirements = this.validator.checkPasswordRequirements(password);
        const requirementIds = {
            length: 'req-length',
            uppercase: 'req-uppercase',
            lowercase: 'req-lowercase',
            number: 'req-number',
            special: 'req-special'
        };

        Object.entries(requirements).forEach(([key, met]) => {
            const element = document.getElementById(requirementIds[key]);
            if (element) {
                element.classList.remove('requirement-met', 'requirement-unmet');
                if (password && password.length > 0) {
                    element.classList.add(met ? 'requirement-met' : 'requirement-unmet');
                }
            }
        });
    }

    displayValidationErrors(validations, fieldErrorMap) {
        Object.entries(validations).forEach(([field, validation]) => {
            const { elementId, errorId } = fieldErrorMap[field] || {};
            if (elementId && errorId) {
                this.displayError(elementId, errorId, validation.message, validation.valid);
            }
        });
    }

    async handleRegistration(formData) {
        return new Promise((resolve, reject) => {
            try {
                const { email, username, password, confirmPassword } = formData;

                const validations = {
                    email: this.validator.validateEmail(email),
                    username: this.validator.validateUsername(username, this.userDatabase.registeredUsernames),
                    password: this.validator.validatePassword(password),
                    confirmPassword: this.validator.validateConfirmPassword(password, confirmPassword)
                };

                const allValid = Object.values(validations).every(v => v.valid);

                if (allValid) {
                    const trimmedUsername = (username || '').trim();
                    this.userDatabase.addUser(trimmedUsername, password);
                    resolve({ success: true, validations });
                } else {
                    resolve({ success: false, validations });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleLogin(formData) {
        return new Promise((resolve, reject) => {
            try {
                const { username, password } = formData;
                const trimmedUsername = (username || '').trim();

                if (trimmedUsername.length === 0 || !password) {
                    resolve({ success: false, message: 'Please fill in all fields' });
                    return;
                }

                this.userDatabase.users = this.userDatabase.loadUsers();
                const authenticated = this.userDatabase.authenticate(trimmedUsername, password);
                resolve({ success: authenticated, username: trimmedUsername });
            } catch (error) {
                reject(error);
            }
        });
    }
}

class PageInitializer {
    constructor() {
        this.userDatabase = new UserDatabase();
        this.validator = new Validator();
        this.formHandler = new FormHandler(this.userDatabase, this.validator);
    }

    getFormElements(elementIds) {
        return elementIds.map(id => document.getElementById(id));
    }

    setupInputValidation(input, validatorFn, elementId, errorId) {
        input?.addEventListener('blur', () => {
            const { valid, message } = validatorFn(input.value);
            this.formHandler.displayError(elementId, errorId, message, valid);
        });
    }

    setupPasswordInputValidation(passwordInput, confirmInput) {
        passwordInput?.addEventListener('input', () => {
            this.formHandler.updatePasswordRequirements(passwordInput.value);
            const { valid, message } = this.validator.validatePassword(passwordInput.value);
            this.formHandler.displayError('password', 'passwordError', message, valid);
            
            if (confirmInput.value) {
                const confirmValid = this.validator.validateConfirmPassword(passwordInput.value, confirmInput.value);
                this.formHandler.displayError('confirmPassword', 'confirmPasswordError', confirmValid.message, confirmValid.valid);
            }
        });
    }

    initRegistrationPage() {
        const registrationForm = document.getElementById('registrationForm');
        if (!registrationForm) return;

        const [emailInput, usernameInput, passwordInput, confirmPasswordInput, successMessage] = 
            this.getFormElements(['email', 'username', 'password', 'confirmPassword', 'successMessage']);

        this.setupInputValidation(
            emailInput,
            (value) => this.validator.validateEmail(value),
            'email',
            'emailError'
        );

        this.setupInputValidation(
            usernameInput,
            (value) => this.validator.validateUsername(value, this.userDatabase.registeredUsernames),
            'username',
            'usernameError'
        );

        this.setupPasswordInputValidation(passwordInput, confirmPasswordInput);

        this.setupInputValidation(
            confirmPasswordInput,
            () => this.validator.validateConfirmPassword(passwordInput.value, confirmPasswordInput.value),
            'confirmPassword',
            'confirmPasswordError'
        );

        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.formHandler.clearErrors();
            successMessage.textContent = '';

            try {
                const formData = {
                    email: emailInput.value,
                    username: usernameInput.value,
                    password: passwordInput.value,
                    confirmPassword: confirmPasswordInput.value
                };

                const { validations } = await this.formHandler.handleRegistration(formData);

                const fieldErrorMap = {
                    email: { elementId: 'email', errorId: 'emailError' },
                    username: { elementId: 'username', errorId: 'usernameError' },
                    password: { elementId: 'password', errorId: 'passwordError' },
                    confirmPassword: { elementId: 'confirmPassword', errorId: 'confirmPasswordError' }
                };

                this.formHandler.displayValidationErrors(validations, fieldErrorMap);

                if (Object.values(validations).every(v => v.valid)) {
                    successMessage.textContent = 'You\'ve been successfully registered!';
                    console.log('Registration successful:', { username: formData.username, email: formData.email });
                    console.log('Updated users database:', this.userDatabase.users);

                    registrationForm.reset();
                    this.formHandler.updatePasswordRequirements('');
                    
                    setTimeout(() => {
                        this.formHandler.clearErrors();
                        successMessage.textContent = '';
                    }, 5000);
                } else {
                    console.error('Registration failed: Validation errors present');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                this.formHandler.displayError('email', 'emailError', 'An unexpected error occurred. Please try again.', false);
                successMessage.textContent = '';
            }
        });
    }

    initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        const [usernameInput, passwordInput, successMessage, errorMessage] = 
            this.getFormElements(['loginUsername', 'loginPassword', 'loginSuccessMessage', 'loginErrorMessage']);

        [usernameInput, passwordInput].forEach(input => {
            input?.addEventListener('input', () => {
                errorMessage.textContent = '';
                successMessage.textContent = '';
                this.formHandler.updateInputState(input, null);
            });
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.textContent = '';
            successMessage.textContent = '';

            try {
                const formData = {
                    username: usernameInput.value,
                    password: passwordInput.value
                };

                const result = await this.formHandler.handleLogin(formData);

                if (result.success) {
                    console.log('Login successful:', { username: result.username });
                    window.location.href = 'welcome.html';
                } else {
                    errorMessage.textContent = result.message || 'Invalid username or password';
                    this.formHandler.updateInputState(usernameInput, false);
                    this.formHandler.updateInputState(passwordInput, false);
                    
                    console.error('Login failed: Invalid credentials for username:', formData.username);
                }
            } catch (error) {
                console.error('Error during login:', error);
                errorMessage.textContent = 'An unexpected error occurred. Please try again.';
                this.formHandler.updateInputState(usernameInput, false);
                this.formHandler.updateInputState(passwordInput, false);
            }
        });
    }

    init() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('login.html')) {
            this.initLoginPage();
        } else {
            this.initRegistrationPage();
        }
    }
}

const pageInitializer = new PageInitializer();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => pageInitializer.init());
} else {
    pageInitializer.init();
}
