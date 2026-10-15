import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { UserCredentials } from '../types';

export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginCard: Locator;
  readonly errorMessage: Locator;
  readonly showPasswordCheckbox: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly portalLogo: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Multi-selector fallbacks for IoT Hub Portal / Keycloak / SSO Form
    this.usernameInput = page.locator(
      'input#username, input[name="username"], input[name="email"], input[type="email"], input[placeholder*="user" i], input[placeholder*="email" i], input[id*="user" i]'
    );
    this.passwordInput = page.locator(
      'input#password, input[name="password"], input[type="password"], input[placeholder*="password" i], input[id*="pass" i]'
    );
    this.submitButton = page.locator(
      'button[type="submit"], input[type="submit"], #kc-login, button:has-text("Sign In"), button:has-text("Log In"), button:has-text("Login"), .btn-primary'
    );
    this.loginCard = page.locator(
      '.login-container, .card-login, #kc-form-login, .auth-container, .login-box, form'
    );
    this.errorMessage = page.locator(
      '.alert-error, .alert-danger, .kc-feedback-text, [role="alert"], .error-message, .invalid-feedback, .text-danger, .form-error'
    );
    this.showPasswordCheckbox = page.locator(
      'input#showPassword, label:has-text("Show Password") input, input[name="showPassword"]'
    );
    this.rememberMeCheckbox = page.locator(
      'input#rememberMe, label:has-text("Remember me") input, input[name="rememberMe"], input[type="checkbox"]'
    );
    this.forgotPasswordLink = page.locator(
      'a:has-text("Forgot Password"), a:has-text("Forgot your password"), a#forgot-password'
    );
    this.portalLogo = page.locator(
      'img.logo, .navbar-brand img, .brand-logo, [alt*="IoT Hub" i], [alt*="WING" i], svg.logo'
    );
    this.pageHeading = page.locator(
      'h1, h2, .login-title, #kc-page-title, .auth-title, div:has-text("IoT Hub")'
    );
  }

  /**
   * Navigates to the portal login page
   */
  async goto(): Promise<void> {
    Logger.info('Navigating to IoT Hub Portal login page');
    await this.navigate('/');
    await this.waitForPageReady();
  }

  /**
   * Checks if the login form elements are visible on page
   */
  async isLoginFormVisible(): Promise<boolean> {
    try {
      const userVisible = await this.usernameInput.first().isVisible({ timeout: 10000 });
      const passVisible = await this.passwordInput.first().isVisible({ timeout: 10000 });
      const btnVisible = await this.submitButton.first().isVisible({ timeout: 10000 });
      return userVisible && passVisible && btnVisible;
    } catch {
      return false;
    }
  }

  /**
   * Performs standard login with username and password
   */
  async login(credentials: UserCredentials): Promise<void> {
    Logger.info(`Attempting login for user: ${credentials.username}`);
    await this.waitForLoadingSpinnerToDisappear();
    
    if (credentials.username) {
      const userInput = this.usernameInput.first();
      await userInput.waitFor({ state: 'visible', timeout: 10000 });
      await userInput.fill(credentials.username);
    }
    if (credentials.password) {
      const passInput = this.passwordInput.first();
      await passInput.waitFor({ state: 'visible', timeout: 10000 });
      await passInput.fill(credentials.password);
    }

    await this.clickAndMeasure(this.submitButton.first(), 'Submit Login Form', 1200);
    await this.waitForLoadingSpinnerToDisappear();
    await this.page.waitForTimeout(500);
  }

  /**
   * Retrieves the current error message text if visible
   */
  async getErrorMessageText(): Promise<string | null> {
    if (await this.isVisible(this.errorMessage.first(), 5000)) {
      return (await this.errorMessage.first().textContent())?.trim() || null;
    }
    return null;
  }

  /**
   * Asserts that an error message is visible and optionally contains expected text
   */
  async expectErrorMessage(expectedText?: string | RegExp): Promise<void> {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 10000 });
    if (expectedText) {
      await expect(this.errorMessage.first()).toContainText(expectedText);
    }
  }

  /**
   * Asserts that login succeeded and user is navigated away from login
   */
  async expectLoginSuccess(): Promise<void> {
    await this.page.waitForURL((url) => !url.pathname.includes('/login') && !url.pathname.includes('/auth'), {
      timeout: 15000,
    });
  }

  /**
   * Checks if password field is currently masked with type="password"
   */
  async isPasswordMasked(): Promise<boolean> {
    const inputType = await this.passwordInput.first().getAttribute('type');
    return inputType === 'password';
  }

  /**
   * Toggles the "Show Password" checkbox/button if available
   */
  async toggleShowPassword(): Promise<boolean> {
    if (await this.showPasswordCheckbox.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.click(this.showPasswordCheckbox.first());
      return true;
    }
    const showPassIcon = this.page.locator('.show-password-icon, .toggle-password, [aria-label*="password" i]');
    if (await showPassIcon.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.click(showPassIcon.first());
      return true;
    }
    return false;
  }

  /**
   * Toggles the "Remember Me" checkbox
   */
  async checkRememberMe(checked: boolean = true): Promise<boolean> {
    if (await this.rememberMeCheckbox.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      const isChecked = await this.rememberMeCheckbox.first().isChecked();
      if (isChecked !== checked) {
        await this.rememberMeCheckbox.first().setChecked(checked);
      }
      return true;
    }
    return false;
  }

  /**
   * Clicks Forgot Password link
   */
  async clickForgotPassword(): Promise<boolean> {
    if (await this.forgotPasswordLink.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.click(this.forgotPasswordLink.first(), 'Forgot Password Link');
      return true;
    }
    return false;
  }
}

