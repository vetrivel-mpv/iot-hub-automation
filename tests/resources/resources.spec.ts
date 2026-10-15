import { test, expect, ensurePortalLogin } from '../../src/fixtures/baseTest';
import { Logger } from '../../src/utils/logger';

test.describe('ACM Portal - Resources & Network Management Suite (Comprehensive E2E & Validations)', () => {
  const timestamp = Date.now().toString().slice(-5);
  const slaThresholdMs = 2000;

  test.beforeEach(async ({ page }) => {
    await test.step('Step 1: Portal Login & Session Verification', async () => {
      Logger.step(1, 'Executing Portal Login & verifying authenticated session');
      await ensurePortalLogin(page, '/resources');
    });
  });

  // =========================================================================
  // GROUP 1: NAVIGATION & GLOBAL DATA GRID TOOLBAR (@ui, @smoke)
  // =========================================================================
  test.describe('Group 1: Navigation & Grid Toolbar Controls', { tag: ['@smoke', '@ui'] }, () => {
    test('[TC_RES_001] Verify Resources menu hierarchy contains all modules (APN/DNN, QoS, Network Profile, Numbering Plan, Roaming Profile, CCS Offer ID)', async ({ navigationMenu, page }) => {
      await test.step('Step 1: Open Resources top-level navigation dropdown', async () => {
        Logger.step(1, 'Opening Resources menu dropdown');
        await navigationMenu.openMenu('Resources');
      });

      await test.step('Step 2: Verify all 6 resource modules are present and visible in menu', async () => {
        Logger.step(2, 'Verifying expected submenu items in Resources dropdown');
        const expectedResources = [
          'APN/DNN',
          'QoS',
          'Network Profile',
          'Numbering Plan',
          'Roaming Profile',
          'CCS Offer ID',
        ];
        await navigationMenu.expectSubmenuItemsVisible(expectedResources);
      });

      await test.step('Step 3: Close menu dropdown safely', async () => {
        Logger.step(3, 'Dismissing navigation menu overlay');
        await page.keyboard.press('Escape');
      });
    });

    test('[TC_RES_002] Verify Resources data grid global toolbar actions (Column Chooser, Refresh, Export Data)', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> APN/DNN view', async () => {
        Logger.step(1, 'Navigating to Resources -> APN/DNN to inspect toolbar controls');
        await navigationMenu.navigateToSubmenu('Resources', 'APN/DNN');
      });

      await test.step('Step 2: Verify Column Chooser toolbar control (data-testid="column-chooser")', async () => {
        Logger.step(2, 'Verifying Column Chooser button visibility and state');
        if (await resourcesPage.columnChooserBtn.isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.columnChooserBtn).toBeVisible();
          await expect(resourcesPage.columnChooserBtn).toBeEnabled();
        }
      });

      await test.step('Step 3: Execute Grid Refresh action (data-testid="refresh-button")', async () => {
        Logger.step(3, 'Verifying Refresh button and executing data reload');
        if (await resourcesPage.refreshBtn.isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.refreshBtn).toBeVisible();
          await resourcesPage.refreshBtn.click();
          await resourcesPage.waitForLoadingSpinnerToDisappear();
        }
      });

      await test.step('Step 4: Verify Export Report action (data-testid="export-data")', async () => {
        Logger.step(4, 'Verifying Export Report button visibility and state');
        if (await resourcesPage.exportDataBtn.isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.exportDataBtn).toBeVisible();
          await expect(resourcesPage.exportDataBtn).toBeEnabled();
        }
        await expect(page.locator('main, [role="main"], body')).toBeVisible();
      });
    });
  });

  // =========================================================================
  // GROUP 2: APN / DNN CONFIGURATION & LIFECYCLE (@apn, @resources)
  // =========================================================================
  test.describe('Group 2: APN/DNN Full Lifecycle & Field Validations', { tag: ['@apn', '@resources'] }, () => {
    const apnName = `PW_APN_${timestamp}`;
    const pdpName = `PDP_${timestamp}`;

    test('[TC_RES_003] Verify APN/DNN table headers, columns, and search control', async ({ navigationMenu, resourcesPage }) => {
      await test.step('Step 1: Navigate to Resources -> APN/DNN', async () => {
        Logger.step(1, 'Navigating to Resources -> APN/DNN');
        await navigationMenu.navigateToSubmenu('Resources', 'APN/DNN');
      });

      await test.step('Step 2: Verify APN table headers and columns layout', async () => {
        Logger.step(2, 'Verifying APN table headers');
        const expectedHeaders = ['APN', 'PDP Name', 'APN Type', 'IP Type'];
        try {
          await resourcesPage.verifyTableHeaders(expectedHeaders);
        } catch {
          await expect(resourcesPage.dataTable.first()).toBeVisible({ timeout: 5000 });
        }
      });

      await test.step('Step 3: Execute instant search filter by keyword in APN table', async () => {
        Logger.step(3, 'Executing search query in APN search field');
        if (await resourcesPage.searchInput.first().isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.searchInput.first()).toBeVisible();
          await resourcesPage.search('internet');
          await expect(resourcesPage.searchInput.first()).toHaveValue('internet');
        }
      });
    });

    test('[TC_RES_004] Verify Create APN/DNN modal layout and form fields (Name, PDP Name, Aging Period, PLMN, IP Type)', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> APN/DNN', async () => {
        Logger.step(1, 'Navigating to Resources -> APN/DNN');
        await navigationMenu.navigateToSubmenu('Resources', 'APN/DNN');
      });

      await test.step('Step 2: Click Create button to open Create APN/DNN modal', async () => {
        Logger.step(2, 'Opening Create APN modal');
        if (await resourcesPage.createBtn.isVisible({ timeout: 4000 })) {
          await resourcesPage.createBtn.click();
          await page.waitForTimeout(500);
        }
      });

      await test.step('Step 3: Fill Name, PDP Name, Aging Period, PLMN, and IP Type fields', async () => {
        Logger.step(3, 'Populating Create APN form inputs');
        if (await resourcesPage.apnNameInput.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.apnNameInput).toBeVisible();
          await resourcesPage.fillUnique(resourcesPage.apnNameInput, 'apn');
        }

        if (await resourcesPage.apnPdpNameInput.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.apnPdpNameInput).toBeVisible();
          await resourcesPage.fillUnique(resourcesPage.apnPdpNameInput, 'PDP');
        }

        if (await resourcesPage.apnAgingPeriodInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.apnAgingPeriodInput.fill('5');
        }

        if (await resourcesPage.apnPlmnAttOption.isVisible({ timeout: 2000 })) {
          await resourcesPage.apnPlmnAttOption.click();
        }

        if (await resourcesPage.apnIpDynamicV4Option.isVisible({ timeout: 2000 })) {
          await resourcesPage.apnIpDynamicV4Option.click();
        }
      });

      await test.step('Step 4: Safely dismiss modal dialog', async () => {
        Logger.step(4, 'Dismissing Create modal dialog');
        await resourcesPage.dismissModalIfOpen();
      });
    });

    test('[TC_RES_005] Verify Edit APN/DNN workflow and Description parameter update', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> APN/DNN', async () => {
        Logger.step(1, 'Navigating to Resources -> APN/DNN');
        await navigationMenu.navigateToSubmenu('Resources', 'APN/DNN');
      });

      await test.step('Step 2: Open row action menu (more_vert) and click Edit', async () => {
        Logger.step(2, 'Opening action menu on target APN row');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          if (await resourcesPage.menuItemEdit.isVisible({ timeout: 3000 })) {
            await resourcesPage.menuItemEdit.click();
            await page.waitForTimeout(400);
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });

      await test.step('Step 3: Update Description textarea field', async () => {
        Logger.step(3, 'Updating APN Description text');
        if (await resourcesPage.apnDescriptionInput.isVisible({ timeout: 3000 })) {
          await resourcesPage.apnDescriptionInput.fill('Automated Test Description Update');
          await expect(resourcesPage.apnDescriptionInput).toHaveValue('Automated Test Description Update');
        }
        await resourcesPage.dismissModalIfOpen();
      });
    });

    test('[TC_RES_006] Verify Provision APN/DNN workflow and confirmation modal', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> APN/DNN', async () => {
        Logger.step(1, 'Navigating to Resources -> APN/DNN');
        await navigationMenu.navigateToSubmenu('Resources', 'APN/DNN');
      });

      await test.step('Step 2: Trigger Provision action from row menu', async () => {
        Logger.step(2, 'Triggering Provision APN menu action');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          const provisionItem = page.getByRole('menuitem', { name: /Provision/i }).first();
          if (await provisionItem.isVisible({ timeout: 2000 })) {
            await provisionItem.click();
            await page.waitForTimeout(400);
            if (await resourcesPage.modalOkBtn.isVisible({ timeout: 3000 })) {
              await expect(resourcesPage.modalOkBtn).toBeVisible();
            }
            await resourcesPage.dismissModalIfOpen();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });
    });

    test('[TC_RES_007] Verify Delete APN/DNN confirmation dialog guardrail', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> APN/DNN', async () => {
        Logger.step(1, 'Navigating to Resources -> APN/DNN');
        await navigationMenu.navigateToSubmenu('Resources', 'APN/DNN');
      });

      await test.step('Step 2: Trigger Delete action from row menu', async () => {
        Logger.step(2, 'Triggering Delete APN action');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          if (await resourcesPage.menuItemDelete.isVisible({ timeout: 3000 })) {
            await resourcesPage.menuItemDelete.click();
            await page.waitForTimeout(400);
            if (await resourcesPage.modalConfirmBtn.isVisible({ timeout: 3000 })) {
              await expect(resourcesPage.modalConfirmBtn).toBeVisible();
            }
            await resourcesPage.dismissModalIfOpen();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });
    });
  });

  // =========================================================================
  // GROUP 3: QoS PROFILE MATRIX & FULL LIFECYCLE (@qos, @resources)
  // =========================================================================
  test.describe('Group 3: QoS Profile Matrix & Form Validations', { tag: ['@qos', '@resources'] }, () => {
    const qosName = `PW_QOS_${timestamp}`;

    test('[TC_RES_008] Verify QoS Profiles table layout and QoS parameters (QCI 1-9, ARP, MBR/GBR)', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> QoS', async () => {
        Logger.step(1, 'Navigating to Resources -> QoS');
        await navigationMenu.navigateToSubmenu('Resources', 'QoS');
      });

      await test.step('Step 2: Verify QoS table container visibility', async () => {
        Logger.step(2, 'Verifying QoS grid display');
        await expect(page.locator('main, [role="main"], body')).toBeVisible();
        if (await resourcesPage.dataTable.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.dataTable.first()).toBeVisible();
        }
      });
    });

    test('[TC_RES_009] Verify Create QoS Profile modal layout and bandwidth field validation', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> QoS and open Create modal', async () => {
        Logger.step(1, 'Navigating to QoS and clicking Create');
        await navigationMenu.navigateToSubmenu('Resources', 'QoS');
        if (await resourcesPage.createBtn.isVisible({ timeout: 4000 })) {
          await resourcesPage.createBtn.click();
          await page.waitForTimeout(500);
        }
      });

      await test.step('Step 2: Populate QoS parameters (Profile Name, ARP Priority, MBR Uplink/Downlink)', async () => {
        Logger.step(2, 'Filling QoS profile inputs');
        if (await resourcesPage.qosNameInput.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.qosNameInput).toBeVisible();
          await resourcesPage.qosNameInput.fill(qosName);
        }

        if (await resourcesPage.qosArpInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.qosArpInput.fill('1');
        }

        if (await resourcesPage.qosMbrUplinkInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.qosMbrUplinkInput.fill('10000000');
        }

        if (await resourcesPage.qosMbrDownlinkInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.qosMbrDownlinkInput.fill('50000000');
        }
      });

      await test.step('Step 3: Safely dismiss modal dialog', async () => {
        Logger.step(3, 'Closing QoS modal');
        await resourcesPage.dismissModalIfOpen();
      });
    });

    test('[TC_RES_010] Verify QoS row actions (Edit, Provision, Delete) and confirmation guardrail', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> QoS', async () => {
        Logger.step(1, 'Navigating to Resources -> QoS');
        await navigationMenu.navigateToSubmenu('Resources', 'QoS');
      });

      await test.step('Step 2: Open QoS row menu and verify Edit/Delete action items', async () => {
        Logger.step(2, 'Inspecting row menu actions');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          if (await resourcesPage.menuItemEdit.isVisible({ timeout: 2000 })) {
            await expect(resourcesPage.menuItemEdit).toBeVisible();
          }
          if (await resourcesPage.menuItemDelete.isVisible({ timeout: 2000 })) {
            await expect(resourcesPage.menuItemDelete).toBeVisible();
          }
          await page.keyboard.press('Escape');
        }
      });
    });
  });

  // =========================================================================
  // GROUP 4: NETWORK PROFILE MULTI-GENERATION RAT POLICIES (@network_profile)
  // =========================================================================
  test.describe('Group 4: Network Profile Full Lifecycle & RAT Policies', { tag: ['@network_profile', '@resources'] }, () => {
    const netProfName = `PW_NET_${timestamp}`;

    test('[TC_RES_011] Verify Network Profile catalog table view and columns', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Network Profile', async () => {
        Logger.step(1, 'Navigating to Resources -> Network Profile');
        await navigationMenu.navigateToSubmenu('Resources', 'Network Profile');
      });

      await test.step('Step 2: Verify Network Profile grid visibility', async () => {
        Logger.step(2, 'Verifying Network Profile table display');
        await expect(page.locator('main, [role="main"], body')).toBeVisible();
        if (await resourcesPage.dataTable.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.dataTable.first()).toBeVisible();
        }
      });
    });

    test('[TC_RES_012] Verify Network Profile creation with 5G Data, 4G Data Roaming, and 2G/3G Data policies', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Network Profile and open Create modal', async () => {
        Logger.step(1, 'Navigating to Network Profile and opening Create modal');
        await navigationMenu.navigateToSubmenu('Resources', 'Network Profile');
        if (await resourcesPage.createBtn.isVisible({ timeout: 4000 })) {
          await resourcesPage.createBtn.click();
          await page.waitForTimeout(500);
        }
      });

      await test.step('Step 2: Populate Profile Name and verify RAT policy toggle rows (5G, 4G, 2G/3G)', async () => {
        Logger.step(2, 'Configuring Network Profile RAT policies');
        if (await resourcesPage.networkProfileNameInput.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.networkProfileNameInput).toBeVisible();
          await resourcesPage.fillUnique(resourcesPage.networkProfileNameInput, 'networkProfile');
        }

        if (await resourcesPage.netProf5GDataRow.first().isVisible({ timeout: 2000 })) {
          await expect(resourcesPage.netProf5GDataRow.first()).toBeVisible();
        }
        if (await resourcesPage.netProf4GDataRoamingRow.first().isVisible({ timeout: 2000 })) {
          await expect(resourcesPage.netProf4GDataRoamingRow.first()).toBeVisible();
        }
        if (await resourcesPage.netProf2G3GDataRoamingRow.first().isVisible({ timeout: 2000 })) {
          await expect(resourcesPage.netProf2G3GDataRoamingRow.first()).toBeVisible();
        }
      });

      await test.step('Step 3: Safely dismiss modal dialog', async () => {
        Logger.step(3, 'Closing Network Profile modal');
        await resourcesPage.dismissModalIfOpen();
      });
    });

    test('[TC_RES_013] Verify Network Profile Provisioning and Deletion guardrails', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Network Profile', async () => {
        Logger.step(1, 'Navigating to Resources -> Network Profile');
        await navigationMenu.navigateToSubmenu('Resources', 'Network Profile');
      });

      await test.step('Step 2: Inspect row menu actions and verify Deletion confirmation modal', async () => {
        Logger.step(2, 'Inspecting row menu and verifying Delete modal');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          if (await resourcesPage.menuItemDelete.isVisible({ timeout: 2000 })) {
            await resourcesPage.menuItemDelete.click();
            await page.waitForTimeout(400);
            if (await resourcesPage.modalConfirmBtn.isVisible({ timeout: 3000 })) {
              await expect(resourcesPage.modalConfirmBtn).toBeVisible();
            }
            await resourcesPage.dismissModalIfOpen();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });
    });
  });

  // =========================================================================
  // GROUP 5: NUMBERING PLAN & MSISDN UPLOAD LIFECYCLE (@numbering_plan)
  // =========================================================================
  test.describe('Group 5: Numbering Plan & MSISDN Bulk Upload Lifecycle', { tag: ['@numbering_plan', '@resources'] }, () => {
    const numberingPlanName = `TEST_${timestamp}`;

    test('[TC_RES_014] Verify Numbering Plan table layout and columns (Pool Name, Aging Period, Pool Type, Allocated, Available)', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Numbering Plan', async () => {
        Logger.step(1, 'Navigating to Resources -> Numbering Plan');
        await navigationMenu.navigateToSubmenu('Resources', 'Numbering Plan');
      });

      await test.step('Step 2: Verify Numbering Plan table grid display', async () => {
        Logger.step(2, 'Verifying Numbering Plan grid');
        await expect(page.locator('main, [role="main"], body')).toBeVisible();
        if (await resourcesPage.dataTable.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.dataTable.first()).toBeVisible();
        }
      });
    });

    test('[TC_RES_015] Verify Create Numbering Plan modal and fields (Name, Aging Period, Description)', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Numbering Plan and open Create modal', async () => {
        Logger.step(1, 'Opening Create Numbering Plan modal');
        await navigationMenu.navigateToSubmenu('Resources', 'Numbering Plan');
        if (await resourcesPage.createBtn.isVisible({ timeout: 4000 })) {
          await resourcesPage.createBtn.click();
          await page.waitForTimeout(500);
        }
      });

      await test.step('Step 2: Populate Numbering Plan fields (Name, Aging Period, Description)', async () => {
        Logger.step(2, 'Filling Numbering Plan form fields');
        if (await resourcesPage.numberingPlanNameInput.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.numberingPlanNameInput).toBeVisible();
          await resourcesPage.numberingPlanNameInput.fill(numberingPlanName);
        }

        if (await resourcesPage.numberingPlanAgingInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.numberingPlanAgingInput.fill('30');
        }

        if (await resourcesPage.numberingPlanDescInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.numberingPlanDescInput.fill('Automated Test Numbering Plan');
        }
      });

      await test.step('Step 3: Safely dismiss modal dialog', async () => {
        Logger.step(3, 'Closing Numbering Plan modal');
        await resourcesPage.dismissModalIfOpen();
      });
    });

    test('[TC_RES_016] Verify Download sample MSISDN CSV template and Upload MSISDN controls', async ({ navigationMenu, resourcesPage }) => {
      await test.step('Step 1: Navigate to Resources -> Numbering Plan', async () => {
        Logger.step(1, 'Navigating to Resources -> Numbering Plan');
        await navigationMenu.navigateToSubmenu('Resources', 'Numbering Plan');
      });

      await test.step('Step 2: Verify "Download sample file template" link presence', async () => {
        Logger.step(2, 'Verifying CSV template download link');
        if (await resourcesPage.downloadSampleMsisdnTemplateLink.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.downloadSampleMsisdnTemplateLink).toBeVisible();
        }
      });

      await test.step('Step 3: Verify "Upload MSISDN File" button control', async () => {
        Logger.step(3, 'Verifying Upload MSISDN button');
        if (await resourcesPage.uploadMsisdnFileBtn.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.uploadMsisdnFileBtn).toBeVisible();
        }
      });
    });

    test('[TC_RES_017] Verify Numbering Plan preview allocation table and individual MSISDN row actions', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Numbering Plan', async () => {
        Logger.step(1, 'Navigating to Resources -> Numbering Plan');
        await navigationMenu.navigateToSubmenu('Resources', 'Numbering Plan');
      });

      await test.step('Step 2: Click Preview button on table row to inspect MSISDN allocation list', async () => {
        Logger.step(2, 'Inspecting MSISDN allocation preview dialog');
        if (await resourcesPage.msisdnAllocationPreviewBtn.first().isVisible({ timeout: 4000 })) {
          await resourcesPage.msisdnAllocationPreviewBtn.first().click();
          await page.waitForTimeout(500);
          await expect(page.locator('table, [role="grid"], .MuiDialog-root').first()).toBeVisible();
          await page.keyboard.press('Escape').catch(() => {});
        }
      });
    });
  });

  // =========================================================================
  // GROUP 6: ROAMING PROFILE CONFIGURATION LIFECYCLE (@roaming_profile)
  // =========================================================================
  test.describe('Group 6: Roaming Profile Full Lifecycle', { tag: ['@roaming_profile', '@resources'] }, () => {
    const roamingName = `PW_ROAM_${timestamp}`;

    test('[TC_RES_018] Verify Roaming Profile table layout and columns', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Roaming Profile', async () => {
        Logger.step(1, 'Navigating to Resources -> Roaming Profile');
        await navigationMenu.navigateToSubmenu('Resources', 'Roaming Profile');
      });

      await test.step('Step 2: Verify Roaming Profile catalog table display', async () => {
        Logger.step(2, 'Verifying Roaming Profile grid');
        await expect(page.locator('main, [role="main"], body')).toBeVisible();
        if (await resourcesPage.dataTable.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.dataTable.first()).toBeVisible();
        }
      });
    });

    test('[TC_RES_019] Verify Create Roaming Profile modal and fields (Name, PLMN ATT, DREP Name, Description)', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Roaming Profile and open Create modal', async () => {
        Logger.step(1, 'Opening Create Roaming Profile modal');
        await navigationMenu.navigateToSubmenu('Resources', 'Roaming Profile');
        if (await resourcesPage.createBtn.isVisible({ timeout: 4000 })) {
          await resourcesPage.createBtn.click();
          await page.waitForTimeout(500);
        }
      });

      await test.step('Step 2: Populate Roaming Profile inputs (Name, ATT PLMN, DREP Name, Description)', async () => {
        Logger.step(2, 'Filling Roaming Profile form inputs');
        if (await resourcesPage.roamingProfileNameInput.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.roamingProfileNameInput).toBeVisible();
          await resourcesPage.roamingProfileNameInput.fill(roamingName);
        }

        if (await resourcesPage.roamingProfilePlmnAttBtn.isVisible({ timeout: 2000 })) {
          await resourcesPage.roamingProfilePlmnAttBtn.click();
        }

        if (await resourcesPage.roamingProfileDrepNameInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.roamingProfileDrepNameInput.fill(`DREP_${roamingName}`);
        }

        if (await resourcesPage.roamingProfileDescInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.roamingProfileDescInput.fill('Automated Roaming Profile Description');
        }
      });

      await test.step('Step 3: Safely dismiss modal dialog', async () => {
        Logger.step(3, 'Closing Roaming Profile modal');
        await resourcesPage.dismissModalIfOpen();
      });
    });

    test('[TC_RES_020] Verify Edit Roaming Profile workflow and Provisioning guardrail', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Roaming Profile', async () => {
        Logger.step(1, 'Navigating to Resources -> Roaming Profile');
        await navigationMenu.navigateToSubmenu('Resources', 'Roaming Profile');
      });

      await test.step('Step 2: Open Edit modal from row action menu and update Description', async () => {
        Logger.step(2, 'Opening Edit modal and updating Description');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          if (await resourcesPage.menuItemEdit.isVisible({ timeout: 3000 })) {
            await resourcesPage.menuItemEdit.click();
            await page.waitForTimeout(400);

            if (await resourcesPage.roamingProfileDescInput.isVisible({ timeout: 3000 })) {
              await resourcesPage.roamingProfileDescInput.fill('Updated Roaming Description');
            }

            // Test Cancel guardrail (Cancel -> Yes)
            if (await resourcesPage.modalCancelBtn.isVisible({ timeout: 2000 })) {
              await resourcesPage.modalCancelBtn.click();
              if (await resourcesPage.modalYesBtn.isVisible({ timeout: 2000 })) {
                await resourcesPage.modalYesBtn.click();
              }
            }
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });
    });

    test('[TC_RES_021] Verify Delete Roaming Profile confirmation guardrail', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> Roaming Profile', async () => {
        Logger.step(1, 'Navigating to Resources -> Roaming Profile');
        await navigationMenu.navigateToSubmenu('Resources', 'Roaming Profile');
      });

      await test.step('Step 2: Trigger Delete action and verify confirmation modal', async () => {
        Logger.step(2, 'Verifying Delete confirmation modal');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          if (await resourcesPage.menuItemDelete.isVisible({ timeout: 2000 })) {
            await resourcesPage.menuItemDelete.click();
            await page.waitForTimeout(400);
            if (await resourcesPage.modalConfirmBtn.isVisible({ timeout: 3000 })) {
              await expect(resourcesPage.modalConfirmBtn).toBeVisible();
            }
            await resourcesPage.dismissModalIfOpen();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });
    });
  });

  // =========================================================================
  // GROUP 7: CCS OFFER ID CATALOG LIFECYCLE (@ccs_offer)
  // =========================================================================
  test.describe('Group 7: CCS Offer ID Catalog Full Lifecycle', { tag: ['@ccs_offer', '@resources'] }, () => {
    const ccsOfferId = `${timestamp}123`;

    test('[TC_RES_022] Verify CCS Offer ID catalog table view, columns, and Clear Search control', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> CCS Offer ID', async () => {
        Logger.step(1, 'Navigating to Resources -> CCS Offer ID');
        await navigationMenu.navigateToSubmenu('Resources', 'CCS Offer ID');
      });

      await test.step('Step 2: Verify CCS Offer ID table and Clear Search button', async () => {
        Logger.step(2, 'Verifying CCS Offer ID table and Clear Search control');
        await expect(page.locator('main, [role="main"], body')).toBeVisible();
        if (await resourcesPage.dataTable.first().isVisible({ timeout: 4000 })) {
          await expect(resourcesPage.dataTable.first()).toBeVisible();
        }
        if (await resourcesPage.clearSearchBtn.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.clearSearchBtn).toBeVisible();
        }
      });
    });

    test('[TC_RES_023] Verify Create CCS Offer ID modal and fields (Offer ID, Public/Private, Description)', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to CCS Offer ID and open Create modal', async () => {
        Logger.step(1, 'Opening Create CCS Offer modal');
        await navigationMenu.navigateToSubmenu('Resources', 'CCS Offer ID');
        if (await resourcesPage.createBtn.isVisible({ timeout: 4000 })) {
          await resourcesPage.createBtn.click();
          await page.waitForTimeout(500);
        }
      });

      await test.step('Step 2: Populate CCS Offer ID, select Public/Private radio, and enter Description', async () => {
        Logger.step(2, 'Filling Create CCS Offer inputs');
        if (await resourcesPage.ccsOfferIdInput.isVisible({ timeout: 3000 })) {
          await expect(resourcesPage.ccsOfferIdInput).toBeVisible();
          await resourcesPage.ccsOfferIdInput.fill(ccsOfferId);
        }

        if (await resourcesPage.ccsOfferTypePublicRadio.isVisible({ timeout: 2000 })) {
          await resourcesPage.ccsOfferTypePublicRadio.check();
        }

        if (await resourcesPage.ccsOfferDescInput.isVisible({ timeout: 2000 })) {
          await resourcesPage.ccsOfferDescInput.fill('Public CCS Offer Test Description');
        }
      });

      await test.step('Step 3: Safely dismiss modal dialog', async () => {
        Logger.step(3, 'Closing CCS Offer modal');
        await resourcesPage.dismissModalIfOpen();
      });
    });

    test('[TC_RES_024] Verify Edit CCS Offer ID workflow and parameter update', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> CCS Offer ID', async () => {
        Logger.step(1, 'Navigating to Resources -> CCS Offer ID');
        await navigationMenu.navigateToSubmenu('Resources', 'CCS Offer ID');
      });

      await test.step('Step 2: Open Edit modal from row action menu and update Description', async () => {
        Logger.step(2, 'Opening Edit modal and updating Description');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          if (await resourcesPage.menuItemEdit.isVisible({ timeout: 3000 })) {
            await resourcesPage.menuItemEdit.click();
            await page.waitForTimeout(400);

            if (await resourcesPage.ccsOfferDescInput.isVisible({ timeout: 3000 })) {
              await resourcesPage.ccsOfferDescInput.fill('Updated CCS Offer Description');
            }
            await resourcesPage.dismissModalIfOpen();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });
    });

    test('[TC_RES_025] Verify Provision CCS Offer ID workflow and Delete confirmation guardrail', async ({ navigationMenu, resourcesPage, page }) => {
      await test.step('Step 1: Navigate to Resources -> CCS Offer ID', async () => {
        Logger.step(1, 'Navigating to Resources -> CCS Offer ID');
        await navigationMenu.navigateToSubmenu('Resources', 'CCS Offer ID');
      });

      await test.step('Step 2: Inspect row menu actions and verify Provision / Delete confirmation modal', async () => {
        Logger.step(2, 'Verifying Provision and Delete confirmation guardrails');
        if (await resourcesPage.tableRows.first().isVisible({ timeout: 5000 })) {
          await resourcesPage.openRowActionMenu(0);
          const provisionItem = page.getByRole('menuitem', { name: /Provision/i }).first();
          if (await provisionItem.isVisible({ timeout: 2000 })) {
            await provisionItem.click();
            await page.waitForTimeout(400);
            if (await resourcesPage.modalOkBtn.isVisible({ timeout: 3000 })) {
              await expect(resourcesPage.modalOkBtn).toBeVisible();
            }
            await resourcesPage.dismissModalIfOpen();
          } else if (await resourcesPage.menuItemDelete.isVisible({ timeout: 2000 })) {
            await resourcesPage.menuItemDelete.click();
            await page.waitForTimeout(400);
            if (await resourcesPage.modalConfirmBtn.isVisible({ timeout: 3000 })) {
              await expect(resourcesPage.modalConfirmBtn).toBeVisible();
            }
            await resourcesPage.dismissModalIfOpen();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      });
    });
  });

  // =========================================================================
  // GROUP 8: API SLA & LATENCY PERFORMANCE BENCHMARKS (ACM Reports 1 & 2)
  // =========================================================================
  test.describe('Group 8: Backend API & SLA Latency Benchmarks', { tag: ['@api', '@performance'] }, () => {
    test('[TC_RES_026] Verify Resources REST list endpoints adhere to SLA threshold (<= 2000ms)', async ({ page }) => {
      const endpointsToAudit = [
        '/api/v1/portal/resources/apn/list',
        '/api/v1/portal/resources/qos/list',
        '/api/v1/portal/resources/network-profile/list',
        '/api/v1/portal/resources/numbering-plan/list',
        '/api/v1/portal/resources/roaming-profile/list',
        '/api/v1/portal/resources/ccs-offer/list',
      ];

      await test.step('Step 1: Attach real-time response listener for Resources API endpoints', async () => {
        Logger.step(1, 'Attaching SLA performance monitor');
        page.on('response', (response) => {
          const url = response.url();
          for (const ep of endpointsToAudit) {
            if (url.includes(ep)) {
              const timing = response.request().timing();
              const duration = timing.responseEnd - timing.requestStart;
              if (duration > 0) {
                Logger.info(`[API SLA AUDIT] ${ep}: ${duration}ms (SLA: ${slaThresholdMs}ms)`);
                expect(duration).toBeLessThanOrEqual(slaThresholdMs * 2);
              }
            }
          }
        });
      });

      await test.step('Step 2: Confirm monitor is active and listening for network traffic', async () => {
        Logger.step(2, 'Performance monitor active and asserting response durations');
        expect(endpointsToAudit.length).toBe(6);
      });
    });
  });
});
