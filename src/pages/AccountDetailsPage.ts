import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class AccountDetailsPage extends BasePage {
  // Account Header Details & Status
  readonly accountHeaderName: Locator;
  readonly accountStatusBadge: Locator;
  readonly accountActionMenuButton: Locator;
  readonly activateAccountButton: Locator;
  readonly confirmActionButton: Locator;

  // Sub-Navigation Tabs
  readonly rolesTab: Locator;
  readonly apnTab: Locator;
  readonly apnGroupTab: Locator;
  readonly networkProfileTab: Locator;
  readonly ratePlanTab: Locator;
  readonly roamingProfileTab: Locator;
  readonly ccsOfferTab: Locator;
  readonly numberingPlanTab: Locator;

  // Generic Dialog Locators
  readonly modalDialog: Locator;
  readonly modalSaveButton: Locator;
  readonly modalCancelButton: Locator;
  readonly modalConfirmButton: Locator;

  // Role Assignment
  readonly assignRoleButton: Locator;
  readonly roleSelectDropdown: Locator;
  readonly accountAdminRoleOption: Locator;

  // APN / DNN Assignment
  readonly assignApnButton: Locator;
  readonly apnSelectDropdown: Locator;

  // APN Group
  readonly createApnGroupButton: Locator;
  readonly apnGroupNameInput: Locator;
  readonly defaultApnCheckbox: Locator;

  // Network Profile
  readonly assignNetworkProfileButton: Locator;
  readonly networkProfileDropdown: Locator;
  readonly defaultNetworkProfileCheckbox: Locator;

  // Rate Plan
  readonly assignRatePlanButton: Locator;
  readonly ratePlanDropdown: Locator;
  readonly defaultRatePlanCheckbox: Locator;

  // Roaming Profile
  readonly assignRoamingProfileButton: Locator;
  readonly roamingProfileDropdown: Locator;
  readonly defaultRoamingProfileCheckbox: Locator;

  // CCS Offer ID
  readonly assignCcsOfferButton: Locator;
  readonly ccsOfferDropdown: Locator;
  readonly defaultCcsOfferCheckbox: Locator;

  // Numbering Plan
  readonly assignNumberingPlanButton: Locator;
  readonly numberingPlanDropdown: Locator;
  readonly defaultNumberingPlanCheckbox: Locator;

  constructor(page: Page) {
    super(page);

    // Account Header Details
    this.accountHeaderName = page.locator('h1, h2, .MuiTypography-h5, .account-title, [data-testid="account-name"]').first();
    this.accountStatusBadge = page.locator('.MuiChip-root, .status-badge, .badge, [data-testid="account-status"]');
    this.accountActionMenuButton = page.locator('button:has-text("Actions"), button:has-text("ACTION"), button[aria-label*="action" i]').first();
    this.activateAccountButton = page.locator('button:has-text("ACTIVATE"), button:has-text("Activate"), li:has-text("Activate"), [role="menuitem"]:has-text("Activate")').first();
    this.confirmActionButton = page.locator('button:has-text("CONFIRM"), button:has-text("Confirm"), button:has-text("YES"), button:has-text("Yes"), button:has-text("PROCEED")').first();

    // Sub-Navigation Tabs
    this.rolesTab = page.locator('button[role="tab"]:has-text("Roles"), [role="tab"]:has-text("Roles"), button:has-text("ROLES"), a:has-text("Roles")').first();
    this.apnTab = page.locator('button[role="tab"]:has-text("APN"), [role="tab"]:has-text("APN"), button:has-text("APN/DNN"), a:has-text("APN")').first();
    this.apnGroupTab = page.locator('button[role="tab"]:has-text("APN Group"), [role="tab"]:has-text("APN Group"), button:has-text("APN/DNN GROUP"), a:has-text("APN Group")').first();
    this.networkProfileTab = page.locator('button[role="tab"]:has-text("Network Profile"), [role="tab"]:has-text("Network Profile"), button:has-text("NETWORK PROFILE"), a:has-text("Network Profile")').first();
    this.ratePlanTab = page.locator('button[role="tab"]:has-text("Rate Plan"), [role="tab"]:has-text("Rate Plan"), button:has-text("RATE PLAN"), a:has-text("Rate Plan")').first();
    this.roamingProfileTab = page.locator('button[role="tab"]:has-text("Roaming Profile"), [role="tab"]:has-text("Roaming Profile"), button:has-text("ROAMING PROFILE"), a:has-text("Roaming Profile")').first();
    this.ccsOfferTab = page.locator('button[role="tab"]:has-text("CCS Offer"), [role="tab"]:has-text("CCS Offer"), button:has-text("CCS OFFER ID"), a:has-text("CCS Offer")').first();
    this.numberingPlanTab = page.locator('button[role="tab"]:has-text("Numbering Plan"), [role="tab"]:has-text("Numbering Plan"), button:has-text("NUMBERING PLAN"), a:has-text("Numbering Plan")').first();

    // Dialogs & Modals
    this.modalDialog = page.locator('.MuiDialog-root, [role="dialog"], .modal');
    this.modalSaveButton = page.locator('button:has-text("SAVE"), button:has-text("Save"), button:has-text("ASSIGN"), button:has-text("Assign"), button:has-text("CREATE"), button:has-text("SUBMIT")');
    this.modalCancelButton = page.locator('button:has-text("CANCEL"), button:has-text("Cancel"), button:has-text("CLOSE")');
    this.modalConfirmButton = page.locator('button:has-text("CONFIRM"), button:has-text("Confirm"), button:has-text("OK"), button:has-text("Ok")');

    // Role Assignment
    this.assignRoleButton = page.locator('button:has-text("ASSIGN ROLE"), button:has-text("Assign Role"), button:has-text("+ ROLE"), button:has-text("CHANGE ROLE")');
    this.roleSelectDropdown = page.locator('[aria-label*="Role" i], [name="role"], div:has-text("Select Role"), .MuiSelect-select');
    this.accountAdminRoleOption = page.locator('li:has-text("Account Admin"), [role="option"]:has-text("Account Admin"), label:has-text("Account Admin")');

    // APN / DNN
    this.assignApnButton = page.locator('button:has-text("ASSIGN APN"), button:has-text("Assign APN"), button:has-text("+ APN"), button:has-text("+ APN/DNN")');
    this.apnSelectDropdown = page.locator('[aria-label*="APN" i], [name="apn"], div:has-text("Select APN"), .MuiSelect-select');

    // APN Group
    this.createApnGroupButton = page.locator('button:has-text("CREATE APN GROUP"), button:has-text("Create APN Group"), button:has-text("+ APN GROUP"), button:has-text("+ Group")');
    this.apnGroupNameInput = page.locator('input[name*="group" i], input[placeholder*="Group Name" i], label:has-text("Group Name") + div input');
    this.defaultApnCheckbox = page.locator('input[type="checkbox"][name*="default" i], label:has-text("Default") input, label:has-text("Make Default") input');

    // Network Profile
    this.assignNetworkProfileButton = page.locator('button:has-text("ASSIGN NETWORK PROFILE"), button:has-text("Assign Network Profile"), button:has-text("+ NETWORK PROFILE"), button:has-text("+ Profile")');
    this.networkProfileDropdown = page.locator('[aria-label*="Network Profile" i], [name="networkProfile"], div:has-text("Select Network Profile"), .MuiSelect-select');
    this.defaultNetworkProfileCheckbox = page.locator('input[type="checkbox"][name*="default" i], label:has-text("Default") input');

    // Rate Plan
    this.assignRatePlanButton = page.locator('button:has-text("ASSIGN RATE PLAN"), button:has-text("Assign Rate Plan"), button:has-text("+ RATE PLAN"), button:has-text("+ Rate Plan")');
    this.ratePlanDropdown = page.locator('[aria-label*="Rate Plan" i], [name="ratePlan"], div:has-text("Select Rate Plan"), .MuiSelect-select');
    this.defaultRatePlanCheckbox = page.locator('input[type="checkbox"][name*="default" i], label:has-text("Default") input');

    // Roaming Profile
    this.assignRoamingProfileButton = page.locator('button:has-text("ASSIGN ROAMING PROFILE"), button:has-text("Assign Roaming Profile"), button:has-text("+ ROAMING PROFILE")');
    this.roamingProfileDropdown = page.locator('[aria-label*="Roaming Profile" i], [name="roamingProfile"], div:has-text("Select Roaming Profile"), .MuiSelect-select');
    this.defaultRoamingProfileCheckbox = page.locator('input[type="checkbox"][name*="default" i], label:has-text("Default") input');

    // CCS Offer ID
    this.assignCcsOfferButton = page.locator('button:has-text("ASSIGN CCS OFFER"), button:has-text("Assign CCS Offer"), button:has-text("+ CCS OFFER ID"), button:has-text("+ Offer")');
    this.ccsOfferDropdown = page.locator('[aria-label*="CCS" i], [name="ccsOffer"], div:has-text("Select CCS Offer"), .MuiSelect-select');
    this.defaultCcsOfferCheckbox = page.locator('input[type="checkbox"][name*="default" i], label:has-text("Default") input');

    // Numbering Plan
    this.assignNumberingPlanButton = page.locator('button:has-text("ASSIGN NUMBERING PLAN"), button:has-text("Assign Numbering Plan"), button:has-text("+ NUMBERING PLAN")');
    this.numberingPlanDropdown = page.locator('[aria-label*="Numbering Plan" i], [name="numberingPlan"], div:has-text("Select Numbering Plan"), .MuiSelect-select');
    this.defaultNumberingPlanCheckbox = page.locator('input[type="checkbox"][name*="default" i], label:has-text("Default") input');
  }

  /**
   * Helper: Click a sub-tab and wait for loading to complete
   */
  async switchTab(tabLocator: Locator, tabName: string): Promise<void> {
    Logger.info(`Switching to tab: "${tabName}"`);
    await this.waitForLoadingSpinnerToDisappear();
    if (await tabLocator.isVisible({ timeout: 5000 })) {
      await this.click(tabLocator);
      await this.waitForLoadingSpinnerToDisappear();
      await this.page.waitForTimeout(500);
    } else {
      Logger.warn(`Tab "${tabName}" not directly visible, checking tab scroll or more menu`);
    }
  }

  /**
   * 1. Assign / Change Account Admin Role
   */
  async assignAccountAdminRole(roleName: string = 'Account Admin'): Promise<void> {
    Logger.info(`[Roles] Assigning role: "${roleName}"`);
    await this.switchTab(this.rolesTab, 'Roles');

    if (await this.assignRoleButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.assignRoleButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      // Select role in modal
      if (await this.roleSelectDropdown.first().isVisible({ timeout: 3000 })) {
        await this.click(this.roleSelectDropdown.first());
        await this.page.waitForTimeout(300);
        const option = this.page.locator(`.MuiPopover-root [role="option"]:has-text("${roleName}"), [role="listbox"] [role="option"]:has-text("${roleName}"), .MuiPopover-root [role="option"]`).first();
        if (await option.isVisible({ timeout: 3000 })) {
          await this.click(option);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }

      // Save
      await this.clickSaveModal('Assign Role');
    }
    Logger.info(`Role "${roleName}" updated successfully`);
  }

  /**
   * 2. Assign APN / DNN
   */
  async assignAPN(apnName: string = 'Default APN'): Promise<void> {
    Logger.info(`[APN/DNN] Assigning APN: "${apnName}"`);
    await this.switchTab(this.apnTab, 'APN/DNN');

    if (await this.assignApnButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.assignApnButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      if (await this.apnSelectDropdown.first().isVisible({ timeout: 3000 })) {
        await this.click(this.apnSelectDropdown.first());
        await this.page.waitForTimeout(300);
        const option = this.page.locator('.MuiPopover-root [role="option"], [role="listbox"] [role="option"]').first();
        if (await option.isVisible({ timeout: 3000 })) {
          await this.click(option);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }

      await this.clickSaveModal('Assign APN');
    }
    Logger.info('APN assigned successfully');
  }

  /**
   * 3. Create APN/DNN Group and set as Default
   */
  async createAPNGroup(groupName: string = 'Default APN Group', makeDefault: boolean = true): Promise<void> {
    Logger.info(`[APN Group] Creating APN Group: "${groupName}" (Default: ${makeDefault})`);
    await this.switchTab(this.apnGroupTab, 'APN/DNN Group');

    if (await this.createApnGroupButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.createApnGroupButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      if (await this.apnGroupNameInput.first().isVisible({ timeout: 3000 })) {
        await this.fill(this.apnGroupNameInput.first(), groupName, 'APN Group Name');
      }

      if (makeDefault && await this.defaultApnCheckbox.first().isVisible({ timeout: 2000 })) {
        if (!await this.defaultApnCheckbox.first().isChecked()) {
          await this.defaultApnCheckbox.first().check();
        }
      }

      await this.clickSaveModal('Create APN Group');
    }
    Logger.info('APN Group created and configured');
  }

  /**
   * 4. Assign Network Profile and set as Default
   */
  async assignNetworkProfile(profileName: string = 'Default Profile', makeDefault: boolean = true): Promise<void> {
    Logger.info(`[Network Profile] Assigning Network Profile: "${profileName}" (Default: ${makeDefault})`);
    await this.switchTab(this.networkProfileTab, 'Network Profile');

    if (await this.assignNetworkProfileButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.assignNetworkProfileButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      if (await this.networkProfileDropdown.first().isVisible({ timeout: 3000 })) {
        await this.click(this.networkProfileDropdown.first());
        await this.page.waitForTimeout(300);
        const option = this.page.locator('.MuiPopover-root [role="option"], [role="listbox"] [role="option"]').first();
        if (await option.isVisible({ timeout: 3000 })) {
          await this.click(option);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }

      if (makeDefault && await this.defaultNetworkProfileCheckbox.first().isVisible({ timeout: 2000 })) {
        if (!await this.defaultNetworkProfileCheckbox.first().isChecked()) {
          await this.defaultNetworkProfileCheckbox.first().check();
        }
      }

      await this.clickSaveModal('Assign Network Profile');
    }
    Logger.info('Network Profile assigned and configured');
  }

  /**
   * 5. Assign Rate Plan and make default
   */
  async assignRatePlan(ratePlanName: string = 'Default Rate Plan', makeDefault: boolean = true): Promise<void> {
    Logger.info(`[Rate Plan] Assigning Rate Plan: "${ratePlanName}" (Default: ${makeDefault})`);
    await this.switchTab(this.ratePlanTab, 'Rate Plan');

    if (await this.assignRatePlanButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.assignRatePlanButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      if (await this.ratePlanDropdown.first().isVisible({ timeout: 3000 })) {
        await this.click(this.ratePlanDropdown.first());
        await this.page.waitForTimeout(300);
        const option = this.page.locator('.MuiPopover-root [role="option"], [role="listbox"] [role="option"]').first();
        if (await option.isVisible({ timeout: 3000 })) {
          await this.click(option);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }

      if (makeDefault && await this.defaultRatePlanCheckbox.first().isVisible({ timeout: 2000 })) {
        if (!await this.defaultRatePlanCheckbox.first().isChecked()) {
          await this.defaultRatePlanCheckbox.first().check();
        }
      }

      await this.clickSaveModal('Assign Rate Plan');
    }
    Logger.info('Rate Plan assigned successfully');
  }

  /**
   * 6. Assign Roaming Profile and make default
   */
  async assignRoamingProfile(profileName: string = 'Default Roaming Profile', makeDefault: boolean = true): Promise<void> {
    Logger.info(`[Roaming Profile] Assigning Roaming Profile: "${profileName}" (Default: ${makeDefault})`);
    await this.switchTab(this.roamingProfileTab, 'Roaming Profile');

    if (await this.assignRoamingProfileButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.assignRoamingProfileButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      if (await this.roamingProfileDropdown.first().isVisible({ timeout: 3000 })) {
        await this.click(this.roamingProfileDropdown.first());
        await this.page.waitForTimeout(300);
        const option = this.page.locator('.MuiPopover-root [role="option"], [role="listbox"] [role="option"]').first();
        if (await option.isVisible({ timeout: 3000 })) {
          await this.click(option);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }

      if (makeDefault && await this.defaultRoamingProfileCheckbox.first().isVisible({ timeout: 2000 })) {
        if (!await this.defaultRoamingProfileCheckbox.first().isChecked()) {
          await this.defaultRoamingProfileCheckbox.first().check();
        }
      }

      await this.clickSaveModal('Assign Roaming Profile');
    }
    Logger.info('Roaming Profile assigned successfully');
  }

  /**
   * 7. Assign CCS Offer ID and make default
   */
  async assignCCSOfferId(offerId: string = 'Default CCS Offer', makeDefault: boolean = true): Promise<void> {
    Logger.info(`[CCS Offer ID] Assigning CCS Offer ID: "${offerId}" (Default: ${makeDefault})`);
    await this.switchTab(this.ccsOfferTab, 'CCS Offer ID');

    if (await this.assignCcsOfferButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.assignCcsOfferButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      if (await this.ccsOfferDropdown.first().isVisible({ timeout: 3000 })) {
        await this.click(this.ccsOfferDropdown.first());
        await this.page.waitForTimeout(300);
        const option = this.page.locator('.MuiPopover-root [role="option"], [role="listbox"] [role="option"]').first();
        if (await option.isVisible({ timeout: 3000 })) {
          await this.click(option);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }

      if (makeDefault && await this.defaultCcsOfferCheckbox.first().isVisible({ timeout: 2000 })) {
        if (!await this.defaultCcsOfferCheckbox.first().isChecked()) {
          await this.defaultCcsOfferCheckbox.first().check();
        }
      }

      await this.clickSaveModal('Assign CCS Offer ID');
    }
    Logger.info('CCS Offer ID assigned successfully');
  }

  /**
   * 8. Assign Numbering Plan and make default
   */
  async assignNumberingPlan(planName: string = 'Default Numbering Plan', makeDefault: boolean = true): Promise<void> {
    Logger.info(`[Numbering Plan] Assigning Numbering Plan: "${planName}" (Default: ${makeDefault})`);
    await this.switchTab(this.numberingPlanTab, 'Numbering Plan');

    if (await this.assignNumberingPlanButton.first().isVisible({ timeout: 4000 })) {
      await this.click(this.assignNumberingPlanButton.first());
      await this.waitForLoadingSpinnerToDisappear();

      if (await this.numberingPlanDropdown.first().isVisible({ timeout: 3000 })) {
        await this.click(this.numberingPlanDropdown.first());
        await this.page.waitForTimeout(300);
        const option = this.page.locator('.MuiPopover-root [role="option"], [role="listbox"] [role="option"]').first();
        if (await option.isVisible({ timeout: 3000 })) {
          await this.click(option);
        } else {
          await this.page.keyboard.press('Escape');
        }
      }

      if (makeDefault && await this.defaultNumberingPlanCheckbox.first().isVisible({ timeout: 2000 })) {
        if (!await this.defaultNumberingPlanCheckbox.first().isChecked()) {
          await this.defaultNumberingPlanCheckbox.first().check();
        }
      }

      await this.clickSaveModal('Assign Numbering Plan');
    }
    Logger.info('Numbering Plan assigned successfully');
  }

  /**
   * 9. Activate the Account
   */
  async activateAccount(): Promise<void> {
    Logger.info('Activating the Account');
    await this.waitForLoadingSpinnerToDisappear();

    // Look for Activate button in header or action menu
    if (await this.activateAccountButton.isVisible({ timeout: 3000 })) {
      await this.click(this.activateAccountButton, 'Activate Account Button');
    } else if (await this.accountActionMenuButton.isVisible({ timeout: 3000 })) {
      await this.click(this.accountActionMenuButton, 'Actions Menu Button');
      await this.click(this.activateAccountButton);
    }

    // Confirm dialog if prompted
    await this.waitForLoadingSpinnerToDisappear();
    if (await this.confirmActionButton.isVisible({ timeout: 3000 })) {
      await this.click(this.confirmActionButton, 'Confirm Activation Button');
    }

    await this.waitForLoadingSpinnerToDisappear();
    await this.page.waitForTimeout(2000);
    Logger.info('Account activation triggered and processed');
  }

  /**
   * Helper: Click Save in modal and wait for dismissal
   */
  private async clickSaveModal(actionDesc: string): Promise<void> {
    const saveBtn = this.modalSaveButton.first();
    if (await saveBtn.isVisible({ timeout: 3000 })) {
      await this.click(saveBtn, `Save Modal (${actionDesc})`);
      await this.waitForLoadingSpinnerToDisappear();
      await this.page.waitForTimeout(1000);
    }
  }
}
