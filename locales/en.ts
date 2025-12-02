export default {
  common: {
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
  home: {
    title: "Home",
    welcome: "Welcome to Coffee Tracker!",
    loggedInMessage:
      "You are successfully logged in. Start tracking your coffee journey!",
  },
  auth: {
    usernameLabel: "Username",
    emailLabel: "Email",
    passwordLabel: "Password",
    usernamePlaceholder: "Enter username...",
    emailPlaceholder: "email@example.com",
    passwordPlaceholder: "Enter password...",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm password...",
    loginButton: "Log In",
    logoutButton: "Log Out",
    registerButton: "Sign Up",
    dontHaveAccount: "Don't have an account? Sign up",
    alreadyHaveAccount: "Already have an account? Log in",
  },
  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email",
    passwordTooShort: "Password must be at least 6 characters",
  },
} as const;
