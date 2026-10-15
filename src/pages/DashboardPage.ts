import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class DashboardPage extends BasePage {
  // Top Header Locators
  readonly headerNavbar: Locator;
  readonly brandLogo: Locator;
  readonly tenantDropdown: Locator;
  readonly languageSelector: Locator;
  readonly userProfileDropdown: Locator;
  readonly userProfileName: Locator;
  readonly logoutButton: Locator;

  // Dashboard Tabs
  readonly tabAccounts: Locator;
  readonly tabSubscriptions: Locator;
  readonly tabUsage: Locator;

  // Metric Cards
  readonly totalAccountsCard: Locator;
  readonly activeAccountsCard: Locator;
  readonly allocatedSimsCard: Locator;
  readonly simInventoryCard: Locator;
  readonly allocatedEsimsCard: Locator;
  readonly esimInventoryCard: Locator;

  // Charts & Panels
  readonly accountStatusCard: Locator;
  readonly accountTypeCard: Locator;
  readonly topAccountsTable: Locator;
  readonly accountEvolutionChart: Locator;
  readonly widgetHeaders: Locator;
  readonly globalSearchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.headerNavbar = page.locator('nav, header, .navbar, .top-bar, .MuiToolbar-root');
    this.brandLogo = page.locator('.navbar-brand, a:has-text("IoT Hub"), a:has-text("Connection Manager")');
    this.tenantDropdown = page.locator('.tenant-select, button:has-text("All"), .realm-select');
    this.languageSelector = page.locator('button:has-text("English"), .lang-select');
    this.userProfileDropdown = page.locator('button:has-text("vetrivel_m"), button:has-text("vm7485"), div:has-text("VETRIVEL"), [data-testid="AccountCircleIcon"], [aria-label*="profile" i], .user-profile').first();
    this.userProfileName = page.locator('text="vetrivel_m", text="vm7485", text="VETRIVEL MUTHUSAMY"');
    this.logoutButton = page.locator('a:has-text("Logout"), button:has-text("Logout"), [role="menuitem"]:has-text("Logout"), a:has-text("Log Out"), button:has-text("Log Out"), [role="menuitem"]:has-text("Log Out"), a:has-text("Sign Out"), button:has-text("Sign Out"), [role="menuitem"]:has-text("Sign Out")');

    // Dashboard Tabs
    this.tabAccounts = page.locator('button:has-text("Accounts"), button:has-text("ACCOUNTS"), a:has-text("Accounts")');
    this.tabSubscriptions = page.locator('button:has-text("Subscriptions"), button:has-text("SUBSCRIPTIONS"), a:has-text("Subscriptions")');
    this.tabUsage = page.locator('button:has-text("Usage"), button:has-text("USAGE"), a:has-text("Usage")');

    // Metric Cards
    this.totalAccountsCard = page.locator('div:has-text("TOTAL ACCOUNTS"), div:has-text("Total Accounts")');
    this.activeAccountsCard = page.locator('div:has-text("ACTIVE ACCOUNTS"), div:has-text("Active Accounts")');
    this.allocatedSimsCard = page.locator('div:has-text("ALLOCATED SIMS"), div:has-text("Allocated SIMs")');
    this.simInventoryCard = page.locator('div:has-text("SIM INVENTORY"), div:has-text("ENTERPRISE-INVENTORY")');
    this.allocatedEsimsCard = page.locator('div:has-text("ALLOCATED ESIMS"), div:has-text("Allocated eSIMs")');
    this.esimInventoryCard = page.locator('div:has-text("ESIM INVENTORY"), div:has-text("eSIM Inventory")');

    // Charts & Panels (Recharts & MUI Data Grids)
    this.accountStatusCard = page.locator('div:has-text("ACCOUNT STATUS"), div:has-text("Account Status")');
    this.accountTypeCard = page.locator('div:has-text("ACCOUNT TYPE"), div:has-text("Account Type")');
    this.topAccountsTable = page.locator('div:has-text("TOP 15 ACTIVE ACCOUNTS"), table.MuiTable-root');
    this.accountEvolutionChart = page.locator('div:has-text("ACCOUNT EVOLUTION"), div:has-text("SUBSCRIPTION EVOLUTION"), .recharts-wrapper, svg.recharts-surface');
    this.widgetHeaders = page.locator('.card-header, .widget-title, .panel-heading, h3, h4, .MuiTypography-h6');
    this.globalSearchInput = page.locator('input[placeholder*="Search" i], input[type="search"], .search-input');
  }

  /**
   * Waits for dashboard to be fully loaded
   */
  async waitForDashboard(): Promise<void> {
    Logger.info('Waiting for Dashboard elements to render...');
    await this.waitForPageReady();
    await this.headerNavbar.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  /**
   * Verifies if dashboard top header is visible
   */
  async isHeaderVisible(): Promise<boolean> {
    return await this.isVisible(this.headerNavbar.first(), 5000);
  }

  /**
   * Opens user profile menu dropdown
   */
  async openUserProfile(): Promise<void> {
    Logger.info('Opening user profile dropdown');
    await this.waitForLoadingSpinnerToDisappear();
    if (await this.userProfileDropdown.isVisible({ timeout: 5000 })) {
      await this.clickAndMeasure(this.userProfileDropdown, 'Open User Profile Menu', 400);
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Logs out from the portal
   */
  async logout(): Promise<void> {
    Logger.info('Performing logout');
    await this.openUserProfile();
    if (await this.logoutButton.first().isVisible({ timeout: 3000 })) {
      await this.clickAndMeasure(this.logoutButton.first(), 'Execute Portal Logout', 1200);
      await this.waitForPageReady();
    }
  }

  /**
   * Switches to Accounts tab with API performance assessment
   */
  async switchToAccountsTab(): Promise<void> {
    Logger.info('Switching to Accounts tab');
    if (await this.tabAccounts.first().isVisible({ timeout: 5000 })) {
      await this.clickAndMeasure(this.tabAccounts.first(), 'Switch to Dashboard Accounts Tab', 1000);
      await this.waitForLoadingSpinnerToDisappear();
    }
  }

  /**
   * Switches to Subscriptions tab with API performance assessment
   */
  async switchToSubscriptionsTab(): Promise<void> {
    Logger.info('Switching to Subscriptions tab');
    if (await this.tabSubscriptions.first().isVisible({ timeout: 5000 })) {
      await this.clickAndMeasure(this.tabSubscriptions.first(), 'Switch to Dashboard Subscriptions Tab', 1000);
      await this.waitForLoadingSpinnerToDisappear();
    }
  }

  /**
   * Switches to Usage tab with API performance assessment
   */
  async switchToUsageTab(): Promise<void> {
    Logger.info('Switching to Usage tab');
    if (await this.tabUsage.first().isVisible({ timeout: 5000 })) {
      await this.clickAndMeasure(this.tabUsage.first(), 'Switch to Dashboard Usage Tab', 1000);
      await this.waitForLoadingSpinnerToDisappear();
    }
  }

  /**
   * Returns all visible dashboard widget titles
   */
  async getWidgetTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.widgetHeaders.count();
    for (let i = 0; i < count; i++) {
      const text = await this.widgetHeaders.nth(i).textContent();
      if (text && text.trim()) {
        titles.push(text.trim());
      }
    }
    return titles;
  }

  /**
   * Performs search from global search input
   */
  async searchGlobal(query: string): Promise<void> {
    Logger.info(`Searching for: ${query}`);
    await this.fill(this.globalSearchInput.first(), query, 'Global Search');
    await this.page.keyboard.press('Enter');
    await this.waitForLoadingSpinnerToDisappear();
  }
}
