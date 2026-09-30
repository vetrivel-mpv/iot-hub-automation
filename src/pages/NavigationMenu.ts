import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export interface MenuHierarchy {
  parent: string;
  sections: {
    sectionTitle?: string;
    items: string[];
  }[];
}

export const WDH_NAVIGATION_MAP: Record<string, { sectionTitle?: string; items: string[] }[]> = {
  Dashboard: [{ items: [] }],
  Subscriptions: [
    {
      sectionTitle: 'Subscriptions',
      items: ['SIM', 'eSIM Profiles', 'Tags', 'Custom fields', 'Group Subscriptions'],
    },
    {
      sectionTitle: 'Rate Plan Summary',
      items: ['Rate Plan Usage', 'Individual Add-ons', 'Pool Add-ons'],
    },
  ],
  Accounts: [
    {
      sectionTitle: 'Accounts',
      items: ['Accounts', 'Custom fields'],
    },
    {
      sectionTitle: 'Sales',
      items: ['Sales Agents', 'Sales Agents Assignment'],
    },
  ],
  Resources: [
    {
      sectionTitle: 'Resources',
      items: ['APN/DNN', 'QoS', 'Network Profile', 'SIM Inventory', 'eSIM Inventory', 'IP Pools', 'Roaming Profile'],
    },
    {
      sectionTitle: '5G Resource',
      items: ['Slice'],
    },
  ],
  Rating: [
    {
      sectionTitle: 'Rating',
      items: ['Rate Plans', 'Add-on Bundle'],
    },
    {
      sectionTitle: 'Rating Configuration',
      items: ['Rating Zones', 'Quota Management'],
    },
    {
      sectionTitle: 'Service Fees',
      items: ['Service Fee Catalog', 'Assigned Service Fees'],
    },
    {
      sectionTitle: 'Discounts',
      items: ['Discount Catalog', 'Assigned Discounts'],
    },
    {
      sectionTitle: 'Commitments',
      items: ['Commitment Catalog', 'Assigned Commitments'],
    },
  ],
  Reports: [
    {
      items: ['Batch Executions', 'Off the Shelf Reports'],
    },
  ],
  Administration: [
    {
      items: ['Users', 'User Groups', 'Roles', 'IP-Whitelist'],
    },
  ],
  'Automation Rules': [
    {
      items: ['Global Rules', 'Enterprise Rules'],
    },
  ],
  'Invoice Data': [
    {
      sectionTitle: 'Invoice Data',
      items: ['Account Invoice Feeds', 'Legacy Account Invoice Feeds', 'Final Invoices', 'Invoice Payments'],
    },
    {
      sectionTitle: 'Adjustment',
      items: ['Adjustment Type', 'Adjustment Summary'],
    },
  ],
  Security: [
    {
      items: ['Audit Logs'],
    },
  ],
  Ordering: [
    {
      items: [],
    },
  ],
};

export class NavigationMenu extends BasePage {
  // Top level menu buttons
  readonly menuButtons: Locator;
  readonly activeDropdown: Locator;
  readonly accountContextModal: Locator;
  readonly modalCloseButton: Locator;

  constructor(page: Page) {
    super(page);

    this.menuButtons = page.locator('nav button, nav a, .navbar-nav li, [role="menubar"] [role="menuitem"]');
    this.activeDropdown = page.locator('.dropdown-menu, .popover, [role="menu"], .MuiMenu-paper, div[class*="menu" i]');
    this.accountContextModal = page.locator('div:has-text("My orders"), .modal, [role="dialog"]');
    this.modalCloseButton = page.locator('button:has-text("CLOSE"), button:has-text("Close"), .modal-footer button');
  }

  /**
   * Clicks and opens a top-level menu dropdown
   */
  async openMenu(menuName: string): Promise<void> {
    Logger.info(`Opening top-level menu: "${menuName}"`);
    await this.waitForLoadingSpinnerToDisappear();
    const button = this.page
      .locator('header, nav, .navbar, .MuiToolbar-root, [role="menubar"], [role="navigation"]')
      .locator('a, button, [role="button"], .MuiListItem-root, a.MuiListItem-button, .MuiListItemText-root, span')
      .filter({ hasText: new RegExp(`^\\s*${menuName}\\s*$`, 'i') })
      .first();

    if (await button.isVisible({ timeout: 4000 })) {
      await this.click(button, `Top Menu "${menuName}"`);
    } else {
      const fallback = this.page.locator(`nav a:has-text("${menuName}"), nav button:has-text("${menuName}"), header button:has-text("${menuName}"), a:has-text("${menuName}")`).first();
      await this.click(fallback, `Top Menu "${menuName}" (Fallback)`);
    }
    await this.page.waitForTimeout(600);
  }

  /**
   * Navigates to a specific submenu item under a parent menu
   */
  async navigateToSubmenu(parentMenu: string, itemTitle: string): Promise<void> {
    Logger.info(`Navigating to: ${parentMenu} -> ${itemTitle}`);
    await this.openMenu(parentMenu);

    const submenuItem = this.page
      .locator(
        `.MuiPopover-paper a, .MuiMenu-paper a, .MuiPaper-root a, a:has-text("${itemTitle}"), button:has-text("${itemTitle}"), span:has-text("${itemTitle}")`
      )
      .filter({ hasText: new RegExp(itemTitle, 'i') })
      .first();

    await this.click(submenuItem, `Submenu Item "${itemTitle}"`);
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.waitForPageReady();
    await this.page.waitForTimeout(500);
  }

  /**
   * Verifies that all expected submenu items are visible in the currently opened menu
   */
  async expectSubmenuItemsVisible(items: string[]): Promise<void> {
    for (const item of items) {
      Logger.info(`Checking visibility of submenu item: "${item}"`);
      const itemLocator = this.page
        .locator('.MuiPopover-paper, .MuiMenu-paper, [role="menu"], body')
        .locator(`a, button, span, li, [role="menuitem"], div`)
        .filter({ hasText: new RegExp(item, 'i') })
        .first();
      await expect(itemLocator).toBeVisible({ timeout: 8000 });
    }
  }

  /**
   * Closes any open modal/dialog if present
   */
  async dismissModalIfPresent(): Promise<void> {
    if (await this.modalCloseButton.first().isVisible({ timeout: 1500 })) {
      Logger.info('Closing modal dialog');
      await this.click(this.modalCloseButton.first());
      await this.page.waitForTimeout(300);
    }
  }
}
