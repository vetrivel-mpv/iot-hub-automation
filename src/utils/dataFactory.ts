import { faker } from '@faker-js/faker';

export interface GeneratedSubscriberData {
  iccid: string;
  imsi: string;
  msisdn: string;
  accountName: string;
  ratePlanName: string;
  tag: string;
  apn: string;
  ipAddress: string;
}

export interface GeneratedAccountData {
  accountName: string;
  adminEmail: string;
  contactName: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  creditLimit: number;
}

export interface GeneratedResourceData {
  apnName: string;
  pdpName: string;
  networkProfileName: string;
  qosProfileName: string;
  roamingProfileName: string;
  numberingPlanName: string;
  ccsOfferId: string;
  sliceName: string;
}

/**
 * Enterprise Test Data Factory & Builder Engine
 * Generates dynamic, realistic telecom & IoT Hub data payloads with worker isolation
 * and guaranteed uniqueness for collision-free parallel test execution.
 */
export class DataFactory {
  private static sequenceCounter: number = 0;
  private static readonly generatedRegistry = new Set<string>();
  public static readonly registeredEntities: Array<{
    id: string;
    type: string;
    value: string;
    timestamp: string;
    workerToken: string;
  }> = [];

  private static getWorkerToken(workerIndex?: number): string {
    const idx = workerIndex !== undefined 
      ? workerIndex 
      : (process.env.TEST_PARALLEL_INDEX ? parseInt(process.env.TEST_PARALLEL_INDEX, 10) : 0);
    return `W${idx}`;
  }

  private static getTimestampToken(): string {
    return Date.now().toString(36).toUpperCase();
  }

  private static getSequenceToken(): string {
    this.sequenceCounter = (this.sequenceCounter + 1) % 100000;
    return this.sequenceCounter.toString(36).toUpperCase().padStart(3, '0');
  }

  private static getRandomToken(len: number = 4): string {
    return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
  }

  /**
   * Tracks an entity in the collision-free audit registry
   */
  public static trackEntity(type: string, value: string, workerIndex?: number): string {
    const workerToken = this.getWorkerToken(workerIndex);
    if (this.generatedRegistry.has(value)) {
      throw new Error(`[FATAL DATA COLLISION DETECTED] Entity '${value}' of type '${type}' was previously generated!`);
    }
    this.generatedRegistry.add(value);
    const ent = {
      id: `ENT_${this.registeredEntities.length + 1}`,
      type,
      value,
      timestamp: new Date().toISOString(),
      workerToken,
    };
    this.registeredEntities.push(ent);

    // Emit structured execution telemetry for Server & UI Live Dashboards
    console.log(`[RESOURCE_CREATED] ${JSON.stringify({ type, value, worker: workerToken, timestamp: ent.timestamp })}`);

    try {
      const { DataSweeper } = require('./dataSweeper');
      const mappedType = type === 'ACCOUNT' ? 'ACCOUNT' : type.includes('SIM') || type.includes('ICCID') || type === 'SUBSCRIBER' ? 'SIM_PROFILE' : 'ORDER';
      DataSweeper.registerEntity({
        type: mappedType,
        entityId: value,
        name: value,
        metadata: { workerToken, type }
      });
    } catch {
      // Safe fallback if dataSweeper is unavailable
    }

    return value;
  }

  /**
   * Generates a guaranteed-unique Account Name with worker isolation & atomic sequencing
   * e.g., "ATT_ACC_W0_LZZ92_00A_A4B8"
   */
  static uniqueAccountName(prefix: string = 'ATT_ACC', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const rand = this.getRandomToken(4);
    const value = `${prefix}_${worker}_${ts}_${seq}_${rand}`;
    return this.trackEntity('ACCOUNT', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique telecom APN / DNN string
   * e.g., "att.iot.apn.w0.lzz92.00a.a4b8.net"
   */
  static uniqueApnName(prefix: string = 'att.iot', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex).toLowerCase();
    const ts = this.getTimestampToken().toLowerCase();
    const seq = this.getSequenceToken().toLowerCase();
    const rand = this.getRandomToken(4).toLowerCase();
    const value = `${prefix}.apn.${worker}.${ts}.${seq}.${rand}.net`;
    return this.trackEntity('APN', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique SIM ICCID string
   */
  static uniqueIccid(workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = Date.now().toString().slice(-6);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const value = `8901410${worker.replace(/\D/g, '0')}${ts}${rand}`;
    return this.trackEntity('SIM_ICCID', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique Network Profile Name
   * e.g., "ATT_NETPROF_W0_LZZ92_00A_B3F1"
   */
  static uniqueNetworkProfileName(prefix: string = 'ATT_NETPROF', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const rand = this.getRandomToken(4);
    const value = `${prefix}_${worker}_${ts}_${seq}_${rand}`;
    return this.trackEntity('NETWORK_PROFILE', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique QoS Profile Name
   */
  static uniqueQosProfileName(prefix: string = 'ATT_QOS', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const value = `${prefix}_${worker}_${ts}_${seq}`;
    return this.trackEntity('QOS_PROFILE', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique Roaming Profile Name
   */
  static uniqueRoamingProfileName(prefix: string = 'ATT_ROAM', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const value = `${prefix}_${worker}_${ts}_${seq}`;
    return this.trackEntity('ROAMING_PROFILE', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique Numbering Plan Name
   */
  static uniqueNumberingPlanName(prefix: string = 'ATT_NUMPLAN', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const value = `${prefix}_${worker}_${ts}_${seq}`;
    return this.trackEntity('NUMBERING_PLAN', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique CCS Offer ID
   */
  static uniqueCcsOfferId(prefix: string = 'OFFER', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = Date.now().toString().slice(-6);
    const seq = this.getSequenceToken();
    const value = `${prefix}_${worker}_${ts}_${seq}`;
    return this.trackEntity('CCS_OFFER', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique 5G Slice Resource Name
   */
  static uniqueSliceName(prefix: string = 'ATT_SLICE_5G', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const value = `${prefix}_${worker}_${ts}_${seq}`;
    return this.trackEntity('SLICE_5G', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique Rate Plan Name
   */
  static uniqueRatePlanName(prefix: string = 'ATT_PLAN', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const value = `${prefix}_5G_${worker}_${ts}_${seq}`;
    return this.trackEntity('RATE_PLAN', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique Automation Rule Name
   */
  static uniqueAutomationRuleName(prefix: string = 'RULE', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const value = `${prefix}_${worker}_${ts}_${seq}`;
    return this.trackEntity('AUTOMATION_RULE', value, workerIndex);
  }

  /**
   * Generates a guaranteed-unique Email address
   */
  static uniqueEmail(domain: string = 'att-iot.com', workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex).toLowerCase();
    const ts = this.getTimestampToken().toLowerCase();
    const seq = this.getSequenceToken().toLowerCase();
    const rand = this.getRandomToken(4).toLowerCase();
    const value = `qa_${worker}_${ts}_${seq}_${rand}@${domain}`;
    return this.trackEntity('EMAIL', value, workerIndex);
  }

  /**
   * Generates a generic unique string with specified prefix
   */
  static uniqueString(prefix: string = 'VAL', maxLen: number = 32, workerIndex?: number): string {
    const worker = this.getWorkerToken(workerIndex);
    const ts = this.getTimestampToken();
    const seq = this.getSequenceToken();
    const rand = this.getRandomToken(3);
    const full = `${prefix}_${worker}_${ts}_${seq}_${rand}`;
    const value = full.slice(0, maxLen);
    return this.trackEntity('GENERIC', value, workerIndex);
  }

  /**
   * Returns audit summary of all generated entities across the current execution
   */
  static getAuditSummary(): { total: number; byType: Record<string, number>; sample: typeof DataFactory.registeredEntities } {
    const byType: Record<string, number> = {};
    for (const ent of this.registeredEntities) {
      byType[ent.type] = (byType[ent.type] || 0) + 1;
    }
    return {
      total: this.registeredEntities.length,
      byType,
      sample: this.registeredEntities.slice(-10),
    };
  }

  /**
   * Generates a full bundle of unique Resources test data
   */
  static createResourceBundle(workerIndex: number = 0): GeneratedResourceData {
    return {
      apnName: this.uniqueApnName('att.iot', workerIndex),
      pdpName: this.uniqueString('PDP', 20, workerIndex),
      networkProfileName: this.uniqueNetworkProfileName('ATT_NETPROF', workerIndex),
      qosProfileName: this.uniqueQosProfileName('ATT_QOS', workerIndex),
      roamingProfileName: this.uniqueRoamingProfileName('ATT_ROAM', workerIndex),
      numberingPlanName: this.uniqueNumberingPlanName('ATT_NUMPLAN', workerIndex),
      ccsOfferId: this.uniqueCcsOfferId('OFFER', workerIndex),
      sliceName: this.uniqueSliceName('ATT_SLICE', workerIndex),
    };
  }

  /**
   * Generates isolated SIM & Subscription dataset
   */
  static createSubscriber(workerIndex: number = 0): GeneratedSubscriberData {
    const timestamp = Date.now().toString().slice(-4);
    const prefix = `W${workerIndex}_`;

    return {
      iccid: `8901${faker.string.numeric(15)}`,
      imsi: `310410${faker.string.numeric(9)}`,
      msisdn: `+1${faker.string.numeric(10)}`,
      accountName: this.uniqueAccountName('AC', workerIndex),
      ratePlanName: `${faker.commerce.productAdjective()} Unlimited 5G Tier ${timestamp}`,
      tag: `TAG_${faker.word.noun().toUpperCase()}_${timestamp}`,
      apn: this.uniqueApnName('iot.hub', workerIndex),
      ipAddress: faker.internet.ipv4(),
    };
  }

  /**
   * Generates isolated Enterprise Tenant Account dataset
   */
  static createAccount(workerIndex: number = 0): GeneratedAccountData {
    return {
      accountName: this.uniqueAccountName('Tenant', workerIndex),
      adminEmail: this.uniqueEmail('att-iot-qa.com', workerIndex),
      contactName: faker.person.fullName(),
      billingCycle: faker.helpers.arrayElement(['MONTHLY', 'QUARTERLY', 'ANNUAL']),
      creditLimit: faker.number.int({ min: 10000, max: 250000 }),
    };
  }

  /**
   * Creates a batch of subscriber records for bulk testing
   */
  static createSubscriberBatch(count: number = 5, workerIndex: number = 0): GeneratedSubscriberData[] {
    return Array.from({ length: count }, () => this.createSubscriber(workerIndex));
  }
}
