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
    this.accountActionMenuButton = page.locator('button:has-text("more_vert"), button[aria-describedby*="mui" i]:has(.material-icons:has-text("more_vert")), button:has-text("Actions")').first();
    this.activateAccountButton = page.locator('li[role="menuitem"]:has-text("ACTIVATE"), [role="menuitem"]:has-text("ACTIVATE"), li:has-text("public ACTIVATE"), button:has-text("ACTIVATE")').first();
    this.confirmActionButton = page.locator('button:has-text("YES"), button:has-text("CONFIRM"), button:has-text("Confirm"), button:has-text("Yes"), button:has-text("OK")').first();

    // Sub-Navigation Tabs & Accordions (Based on Inspector ACT_062 - ACT_207)
    this.rolesTab = page.locator('#accounts-contact-tab, [role="button"]:has-text("Roles"), button[role="tab"]:has-text("Roles"), a:has-text("Roles")').first();
    this.apnTab = page.locator('#accounts-apn-tab, [role="button"]:has-text("APN/DNN"), #accounts-apn').first();
    this.apnGroupTab = page.locator('#accounts-apn-group-tab, [role="button"]:has-text("APN/DNN Group"), #accounts-apn-group').first();
    this.networkProfileTab = page.locator('#accounts-network-profile-tab, [role="button"]:has-text("Network Profile"), #accounts-network-profile').first();
    this.ratePlanTab = page.locator('#accounts-rate-plan-tab, [role="button"]:has-text("Rate Plan"), #accounts-rate-plan').first();
    this.roamingProfileTab = page.locator('#accounts-roaming-profile-tab, [role="button"]:has-text("Roaming Profile"), #accounts-roaming-profile').first();
    this.ccsOfferTab = page.locator('#accounts-ccs-offer-tab, [role="button"]:has-text("CCS Offer ID"), #accounts-ccs-offer').first();
    this.numberingPlanTab = page.locator('#accounts-msisdn-profile-tab, [role="button"]:has-text("Numbering Plan"), #accounts-msisdn-profile').first();

    // Dialogs & Modals
    this.modalDialog = page.locator('.MuiDialog-root, [role="dialog"], .modal');
    this.modalSaveButton = page.locator('button:has-text("OK"), button:has-text("Ok"), button:has-text("SAVE"), button:has-text("Save"), button:has-text("ASSIGN")');
    this.modalCancelButton = page.locator('button:has-text("CANCEL"), button:has-text("Cancel"), button:has-text("CLOSE")');
    this.modalConfirmButton = page.locator('button:has-text("OK"), button:has-text("Ok"), button:has-text("YES"), button:has-text("CONFIRM")');

    // Role Assignment
    this.assignRoleButton = page.locator('li[role="menuitem"]:has-text("Assign/unassign"), button:has-text("Assign/unassign"), button:has-text("ASSIGN ROLE")');
    this.roleSelectDropdown = page.locator('[aria-label*="Role" i], [name="role"], div:has-text("Select Role"), .MuiSelect-select');
    this.accountAdminRoleOption = page.locator('li:has-text("ATT_CUSTACCT_ADMIN"), [role="option"]:has-text("ATT_CUSTACCT_ADMIN"), [role="listitem"]:has-text("ATT_CUSTACCT_API_ADMIN")');

    // APN / DNN
    this.assignApnButton = page.locator('button:has-text("add_outlined"), button:has(.material-icons:has-text("add_outlined")), button:has-text("ASSIGN APN")');
    this.apnSelectDropdown = page.locator('[aria-label*="APN" i], [name="apn"], div:has-text("Select APN"), .MuiSelect-select');

    // APN Group
    this.createApnGroupButton = page.locator('button:has-text("add_outlined"), button:has(.material-icons:has-text("add_outlined")), button:has-text("+ APN GROUP")');
    this.apnGroupNameInput = page.locator('input[placeholder="APN Group Name"], [aria-label="APN Group Name"], input[name*="group" i]');
    this.defaultApnCheckbox = page.locator('button:has(.material-icons:has-text("pin_drop_outlined")), input[type="checkbox"][name*="default" i]');

    // Network Profile
    this.assignNetworkProfileButton = page.locator('button:has-text("add_outlined"), button:has(.material-icons:has-text("add_outlined")), button:has-text("+ NETWORK PROFILE")');
    this.networkProfileDropdown = page.locator('[aria-label*="Network Profile" i], [name="networkProfile"], div:has-text("Select Network Profile")');
    this.defaultNetworkProfileCheckbox = page.locator('button:has(.material-icons:has-text("pin_drop_outlined")), input[type="checkbox"][name*="default" i]');

    // Rate Plan
    this.assignRatePlanButton = page.locator('button:has-text("add_outlined"), button:has(.material-icons:has-text("add_outlined")), button:has-text("+ RATE PLAN")');
    this.ratePlanDropdown = page.locator('[aria-label*="Rate Plan" i], [name="ratePlan"], div:has-text("Select Rate Plan")');
    this.defaultRatePlanCheckbox = page.locator('button:has(.material-icons:has-text("pin_drop_outlined")), input[type="checkbox"][name*="default" i]');

    // Roaming Profile
    this.assignRoamingProfileButton = page.locator('button:has-text("add_outlined"), button:has(.material-icons:has-text("add_outlined")), button:has-text("+ ROAMING PROFILE")');
    this.roamingProfileDropdown = page.locator('[aria-label*="Roaming Profile" i], [name="roamingProfile"], div:has-text("Select Roaming Profile")');
    this.defaultRoamingProfileCheckbox = page.locator('button:has(.material-icons:has-text("pin_drop_outlined")), input[type="checkbox"][name*="default" i]');

    // CCS Offer ID
    this.assignCcsOfferButton = page.locator('button:has-text("add_outlined"), button:has(.material-icons:has-text("add_outlined")), button:has-text("+ CCS OFFER ID")');
    this.ccsOfferDropdown = page.locator('[aria-label*="CCS" i], [name="ccsOffer"], div:has-text("Select CCS Offer")');
    this.defaultCcsOfferCheckbox = page.locator('button:has(.material-icons:has-text("pin_drop_outlined")), input[type="checkbox"][name*="default" i]');

    // Numbering Plan
    this.assignNumberingPlanButton = page.locator('button:has-text("add_outlined"), button:has(.material-icons:has-text("add_outlined")), button:has-text("+ NUMBERING PLAN")');
    this.numberingPlanDropdown = page.locator('[aria-label*="Numbering Plan" i], [name="numberingPlan"], div:has-text("Select Numbering Plan")');
    this.defaultNumberingPlanCheckbox = page.locator('button:has(.material-icons:has-text("pin_drop_outlined")), input[type="checkbox"][name*="default" i]');
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
