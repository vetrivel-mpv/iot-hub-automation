import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

export type EntityType = 'ACCOUNT' | 'SIM_PROFILE' | 'SUBSCRIPTION' | 'ORDER' | 'AUTOMATION_RULE' | 'INVOICE_FEED';

export interface TrackedEntity {
  id: string;
  type: EntityType;
  entityId: string;
  name?: string;
  testTitle?: string;
  createdAt: number;
  status: 'ACTIVE' | 'QUARANTINED' | 'SWEPT';
  sweptAt?: number;
  metadata?: Record<string, any>;
}

export interface SweepResult {
  sweepId: string;
  timestamp: number;
  dryRun: boolean;
  entitiesScanned: number;
  entitiesSwept: number;
  entitiesPreserved: number;
  reclaimedEstimateKb: number;
  sweptEntities: Array<{ id: string; type: EntityType; entityId: string }>;
  status: 'COMPLETED' | 'PARTIAL' | 'DRY_RUN';
}

export interface SweeperStats {
  totalTracked: number;
  activeCount: number;
  quarantinedCount: number;
  sweptCount: number;
  lastSweep?: SweepResult;
  recentEntities: TrackedEntity[];
}

/**
 * Enterprise Collision-Free Test Data Teardown & Quarantine Sweeper (Option D)
 * Tracks lifecycle of ephemeral test entities, protects seed production data,
 * and executes collision-free post-test or on-demand quarantine sweeps.
 */
export class DataSweeper {
  private static registryPath = path.resolve('reports/teardown/active_entities.json');
  private static auditPath = path.resolve('reports/teardown/sweeper-audit.json');

  private static ensureStorageDirs(): void {
    const dir = path.resolve('reports/teardown');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public static registerEntity(params: {
    type: EntityType;
    entityId: string;
    name?: string;
    testTitle?: string;
    metadata?: Record<string, any>;
  }): TrackedEntity {
    this.ensureStorageDirs();
    const entities = this.getAllEntities();

    const entity: TrackedEntity = {
      id: `ent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: params.type,
      entityId: params.entityId,
      name: params.name || params.entityId,
      testTitle: params.testTitle,
      createdAt: Date.now(),
      status: 'ACTIVE',
      metadata: params.metadata,
    };

    entities.unshift(entity);
    if (entities.length > 500) entities.pop();
    fs.writeFileSync(this.registryPath, JSON.stringify(entities, null, 2), 'utf-8');
    Logger.info(`🧹 [DATA SWEEPER TRACKER] Registered new ${params.type}: "${params.entityId}"`);
    return entity;
  }

  public static getAllEntities(): TrackedEntity[] {
    try {
      this.ensureStorageDirs();
      if (fs.existsSync(this.registryPath)) {
        return JSON.parse(fs.readFileSync(this.registryPath, 'utf-8'));
      }
    } catch {
      // Ignore
    }
    return [];
  }

  public static getSweepAuditHistory(): SweepResult[] {
    try {
      this.ensureStorageDirs();
      if (fs.existsSync(this.auditPath)) {
        return JSON.parse(fs.readFileSync(this.auditPath, 'utf-8'));
      }
    } catch {
      // Ignore
    }
    return [];
  }

  /**
   * Scans tracked entities and detects orphaned or stale test entities
   * (e.g. entities older than maxAgeMs or matching test prefix 'wdh_', 'test_')
   * Explicitly protects seeds starting with 'PROD_SEED_' or flagged with isSeed.
   */
  public static scanQuarantine(maxAgeMs: number = 60 * 1000): TrackedEntity[] {
    const entities = this.getAllEntities();
    const now = Date.now();

    return entities.filter((e) => {
      if (e.status === 'SWEPT') return false;
      // Protected Seeds are IMMUNE to quarantine sweeps
      if (e.entityId.startsWith('PROD_SEED_') || e.metadata?.isSeed) return false;

      const isTestPrefixed = /^(wdh_|test_|temp_|mock_|e2e_)/i.test(e.entityId) || /^(wdh_|test_|temp_)/i.test(e.name || '');
      const isAged = maxAgeMs > 0 && now - e.createdAt > maxAgeMs;
      return isTestPrefixed || isAged;
    });
  }

  /**
   * Executes a collision-free teardown sweep
   */
  public static runSweep(options: { dryRun?: boolean; forceAll?: boolean } = {}): SweepResult {
    this.ensureStorageDirs();
    const isDryRun = options.dryRun ?? false;
    const entities = this.getAllEntities();
    const quarantine = options.forceAll 
      ? entities.filter((e) => e.status !== 'SWEPT' && !e.entityId.startsWith('PROD_SEED_') && !e.metadata?.isSeed) 
      : this.scanQuarantine();

    const quarantineIds = new Set(quarantine.map((q) => q.id));
    const sweptList: Array<{ id: string; type: EntityType; entityId: string }> = [];

    if (!isDryRun) {
      for (const ent of entities) {
        if (quarantineIds.has(ent.id)) {
          ent.status = 'SWEPT';
          ent.sweptAt = Date.now();
          sweptList.push({ id: ent.id, type: ent.type, entityId: ent.entityId });
        }
      }
      fs.writeFileSync(this.registryPath, JSON.stringify(entities, null, 2), 'utf-8');
    } else {
      for (const ent of quarantine) {
        sweptList.push({ id: ent.id, type: ent.type, entityId: ent.entityId });
      }
    }

    const sweepResult: SweepResult = {
      sweepId: `sweep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      dryRun: isDryRun,
      entitiesScanned: entities.length,
      entitiesSwept: sweptList.length,
      entitiesPreserved: entities.length - sweptList.length,
      reclaimedEstimateKb: sweptList.length * 4.2, // ~4.2KB per simulated telecom payload
      sweptEntities: sweptList,
      status: isDryRun ? 'DRY_RUN' : 'COMPLETED',
    };

    const auditHistory = this.getSweepAuditHistory();
    auditHistory.unshift(sweepResult);
    if (auditHistory.length > 50) auditHistory.pop();
    fs.writeFileSync(this.auditPath, JSON.stringify(auditHistory, null, 2), 'utf-8');

    Logger.info(
      `🧹 [DATA SWEEPER] ${isDryRun ? '[DRY RUN] ' : ''}Sweep finished. Swept: ${sweptList.length} entities | Preserved: ${sweepResult.entitiesPreserved}`
    );
    return sweepResult;
  }

  public static getStats(): SweeperStats {
    const entities = this.getAllEntities();
    const active = entities.filter((e) => e.status === 'ACTIVE').length;
    const swept = entities.filter((e) => e.status === 'SWEPT').length;
    const quarantined = this.scanQuarantine().length;
    const audits = this.getSweepAuditHistory();

    return {
      totalTracked: entities.length,
      activeCount: active,
      quarantinedCount: quarantined,
      sweptCount: swept,
      lastSweep: audits[0],
      recentEntities: entities.slice(0, 15),
    };
  }
}
