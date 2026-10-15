import { test, expect } from '../../src/fixtures/baseTest';
import { DataFactory } from '../../src/utils/dataFactory';
import { Logger } from '../../src/utils/logger';

test.describe('Verification: Automated Unique Inputs Engine', () => {
  test('Verify DataFactory unique generators produce distinct, collision-free values', async () => {
    Logger.info('Generating sample unique entity values across workers...');

    const accountW0 = DataFactory.uniqueAccountName('ATT_ACC', 0);
    const accountW1 = DataFactory.uniqueAccountName('ATT_ACC', 1);
    const apnW0 = DataFactory.uniqueApnName('att.iot', 0);
    const apnW1 = DataFactory.uniqueApnName('att.iot', 1);
    const netProfW0 = DataFactory.uniqueNetworkProfileName('ATT_NETPROF', 0);
    const netProfW1 = DataFactory.uniqueNetworkProfileName('ATT_NETPROF', 1);
    const qosW0 = DataFactory.uniqueQosProfileName('ATT_QOS', 0);
    const sliceW0 = DataFactory.uniqueSliceName('ATT_SLICE', 0);
    const emailW0 = DataFactory.uniqueEmail('att-iot.com', 0);

    Logger.info(`Generated Account W0: ${accountW0}`);
    Logger.info(`Generated Account W1: ${accountW1}`);
    Logger.info(`Generated APN W0:     ${apnW0}`);
    Logger.info(`Generated APN W1:     ${apnW1}`);
    Logger.info(`Generated NetProf W0: ${netProfW0}`);
    Logger.info(`Generated NetProf W1: ${netProfW1}`);
    Logger.info(`Generated QoS W0:     ${qosW0}`);
    Logger.info(`Generated Slice W0:   ${sliceW0}`);
    Logger.info(`Generated Email W0:   ${emailW0}`);

    expect(accountW0).not.toBe(accountW1);
    expect(apnW0).not.toBe(apnW1);
    expect(netProfW0).not.toBe(netProfW1);

    // Collision check over 500 iterations
    const set = new Set<string>();
    for (let i = 0; i < 500; i++) {
      set.add(DataFactory.uniqueAccountName());
      set.add(DataFactory.uniqueApnName());
      set.add(DataFactory.uniqueNetworkProfileName());
    }
    expect(set.size).toBe(1500);
    Logger.info('✅ Collision check passed: 1500 distinct values generated with 0 duplicates.');
  });

  test('Verify BasePage fillUnique and autoFillFormUnique in DOM context', async ({ page, accountsPage }) => {
    // Inject a sample form with standard IoT Hub input fields
    await page.setContent(`
      <form id="test-form">
        <label for="acc-name">Account Name</label>
        <input type="text" id="acc-name" name="accountName" placeholder="Enter Account Name" />

        <label for="apn-name">APN / DNN Name</label>
        <input type="text" id="apn-name" name="apnName" placeholder="e.g. att.iot.custom" />

        <label for="net-prof">Network Profile</label>
        <input type="text" id="net-prof" name="networkProfile" placeholder="Network Profile Name" />

        <label for="contact-email">Admin Email</label>
        <input type="email" id="contact-email" name="adminEmail" placeholder="admin@enterprise.com" />
      </form>
    `);

    // 1. Explicit entityType fillUnique
    const valAcc = await accountsPage.fillUnique(page.locator('#acc-name'), 'account');
    expect(valAcc).toMatch(/^ATT_ACC_W\d+_[A-Z0-9]+_[A-Z0-9]+$/);
    await expect(page.locator('#acc-name')).toHaveValue(valAcc);

    // 2. APN fillUnique
    const valApn = await accountsPage.fillUnique(page.locator('#apn-name'), 'apn');
    expect(valApn).toMatch(/^att\.iot\.apn\.w\d+\.[a-z0-9]+\.[a-z0-9]+\.net$/);
    await expect(page.locator('#apn-name')).toHaveValue(valApn);

    // 3. Auto-detect from input attributes
    const valNetProf = await accountsPage.fillUnique(page.locator('#net-prof'));
    expect(valNetProf).toMatch(/^ATT_NETPROF_W\d+_[A-Z0-9]+_[A-Z0-9]+$/);
    await expect(page.locator('#net-prof')).toHaveValue(valNetProf);

    // 4. Auto-detect email from input attributes
    const valEmail = await accountsPage.fillUnique(page.locator('#contact-email'));
    expect(valEmail).toMatch(/^qa_w\d+_[a-z0-9]+_[a-z0-9]+@att-iot\.com$/);
    await expect(page.locator('#contact-email')).toHaveValue(valEmail);

    Logger.info('✅ DOM fillUnique test passed: all inputs received distinct, valid enterprise payloads.');
  });
});
