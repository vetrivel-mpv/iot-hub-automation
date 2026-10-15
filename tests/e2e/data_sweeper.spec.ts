import { test, expect } from '../../src/fixtures/baseTest';
import { DataSweeper } from '../../src/utils/dataSweeper';
import { DataFactory } from '../../src/utils/dataFactory';
import { Logger } from '../../src/utils/logger';

test.describe('IoT Hub Portal - 20: Collision-Free Data Teardown & Quarantine Sweeper Suite (Option D)', { tag: ['@teardown', '@sweeper', '@cleanup'] }, () => {
  test.describe.configure({ mode: 'serial' });

  test('[TC_SWP_001] Verify Test Data Entity Registration & Auto-Tracking via DataFactory', async ({ dataSweeper }) => {
    await test.step('Step 1: Generate unique accounts and SIM profiles via DataFactory', async () => {
      Logger.step(1, 'Generating test data using DataFactory unique generators');
      const account1 = DataFactory.uniqueAccountName('wdh_test_acc', 0);
      const account2 = DataFactory.uniqueAccountName('wdh_test_acc', 1);

      // Verify that DataFactory registered both entities into DataSweeper
      const entities = dataSweeper.getAllEntities();
      const found1 = entities.find(e => e.entityId === account1);
      const found2 = entities.find(e => e.entityId === account2);

      expect(found1).toBeDefined();
      expect(found2).toBeDefined();
      expect(found1?.status).toBe('ACTIVE');
      expect(found1?.type).toBe('ACCOUNT');

      Logger.info(`Successfully tracked test accounts: ${account1}, ${account2}`);
    });
  });

  test('[TC_SWP_002] Verify Quarantine Identification of Test-Prefixed and Ephemeral Entities', async ({ dataSweeper }) => {
    await test.step('Step 1: Register entities with test vs protected seed identifiers', async () => {
      Logger.step(1, 'Registering mixed test and protected entities');
      // Ephemeral test account
      dataSweeper.registerEntity({
        type: 'ACCOUNT',
        entityId: 'wdh_mock_customer_corp_99',
        name: 'Ephemeral Test Account',
      });

      // Seed production account (must NOT be swept)
      dataSweeper.registerEntity({
        type: 'ACCOUNT',
        entityId: 'PROD_SEED_PRIMARY_OPERATOR_001',
        name: 'Master Seed Account',
      });
    });

    await test.step('Step 2: Scan quarantine and assert seed preservation', async () => {
      Logger.step(2, 'Scanning quarantine targets');
      const quarantine = dataSweeper.scanQuarantine(0);

      const hasTestEntity = quarantine.some(e => e.entityId === 'wdh_mock_customer_corp_99');
      const hasSeedEntity = quarantine.some(e => e.entityId === 'PROD_SEED_PRIMARY_OPERATOR_001');

      expect(hasTestEntity).toBeTruthy();
      expect(hasSeedEntity).toBeFalsy(); // Seeds must be protected!

      Logger.info('Quarantine correctly flagged test entity while preserving production seed.');
    });
  });

  test('[TC_SWP_003] Verify Dry-Run Preview vs Live Teardown Quarantine Sweep', async ({ dataSweeper }) => {
    await test.step('Step 1: Execute Dry-Run sweep preview', async () => {
      Logger.step(1, 'Executing dry-run preview sweep');
      dataSweeper.registerEntity({
        type: 'ACCOUNT',
        entityId: 'wdh_sweep_target_corp_77',
        name: 'Target Sweep Corp',
      });

      const preview = dataSweeper.runSweep({ dryRun: true });

      expect(preview.dryRun).toBe(true);
      expect(preview.status).toBe('DRY_RUN');
      expect(preview.entitiesSwept).toBeGreaterThanOrEqual(1);
      expect(preview.reclaimedEstimateKb).toBeGreaterThan(0);

      // Verify that entities remain ACTIVE after dry-run
      const entities = dataSweeper.getAllEntities();
      const testItem = entities.find(e => e.entityId === 'wdh_sweep_target_corp_77');
      expect(testItem?.status).toBe('ACTIVE');

      Logger.info(`Dry run completed: ${preview.entitiesSwept} entities detected in quarantine without destructive deletion.`);
    });

    await test.step('Step 2: Execute Live Quarantine Sweep and assert status change to SWEPT', async () => {
      Logger.step(2, 'Executing live quarantine sweep');
      const liveSweep = dataSweeper.runSweep({ dryRun: false });

      expect(liveSweep.dryRun).toBe(false);
      expect(liveSweep.status).toBe('COMPLETED');
      expect(liveSweep.entitiesSwept).toBeGreaterThanOrEqual(1);

      // Verify entity status updated to SWEPT
      const entities = dataSweeper.getAllEntities();
      const testItem = entities.find(e => e.entityId === 'wdh_sweep_target_corp_77');
      expect(testItem?.status).toBe('SWEPT');
      expect(testItem?.sweptAt).toBeDefined();

      const stats = dataSweeper.getStats();
      expect(stats.sweptCount).toBeGreaterThanOrEqual(1);

      Logger.info(`Live sweep successful. Cleaned ${liveSweep.entitiesSwept} test entities and preserved ${liveSweep.entitiesPreserved} protected seeds.`);
    });
  });
});
