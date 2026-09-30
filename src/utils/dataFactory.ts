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

/**
 * Enterprise Test Data Factory & Builder Engine
 * Generates dynamic, realistic telecom & IoT Hub data payloads with worker isolation
 */
export class DataFactory {
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
      accountName: `${prefix}AC_${faker.company.name().replace(/[^a-zA-Z0-9]/g, '')}_${timestamp}`,
      ratePlanName: `${faker.commerce.productAdjective()} Unlimited 5G Tier ${timestamp}`,
      tag: `TAG_${faker.word.noun().toUpperCase()}_${timestamp}`,
      apn: `iot.${faker.word.sample().toLowerCase()}.nokia.net`,
      ipAddress: faker.internet.ipv4(),
    };
  }

  /**
   * Generates isolated Enterprise Tenant Account dataset
   */
  static createAccount(workerIndex: number = 0): GeneratedAccountData {
    return {
      accountName: `Tenant_${faker.company.name().replace(/[^a-zA-Z0-9]/g, '')}_W${workerIndex}_${Date.now().toString().slice(-4)}`,
      adminEmail: faker.internet.email({ provider: 'nokiawing-qa.com' }),
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
