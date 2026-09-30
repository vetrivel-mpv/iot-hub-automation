import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvironmentDefinition {
  id: string;
  name: string;
  category: 'SIT' | 'UAT' | 'PROD' | 'DEV' | 'CUSTOM';
  baseUrl: string;
  description: string;
  auth: {
    username: string;
    password?: string;
  };
  isDefault?: boolean;
  isProtected?: boolean;
  timeouts?: {
    short: number;
    medium: number;
    long: number;
    pageLoad: number;
  };
}

export interface EnvironmentsRegistry {
  activeEnvironmentId: string;
  environments: EnvironmentDefinition[];
}

/**
 * Loads environments from environments.json
 */
export function loadEnvironmentsRegistry(): EnvironmentsRegistry {
  try {
    const envPath = path.resolve(__dirname, 'environments.json');
    if (fs.existsSync(envPath)) {
      const data = fs.readFileSync(envPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('[EnvironmentConfig] Warning: Unable to parse environments.json, using defaults', error);
  }

  return {
    activeEnvironmentId: 'sit-stg2',
    environments: [
      {
        id: 'sit-stg2',
        name: 'SIT - STG 2 (Default)',
        category: 'SIT',
        baseUrl: 'https://wdh-sitstg2.nokiawing.com',
        description: 'IoT Hub System Integration 2',
        auth: {
          username: process.env.WDH_USERNAME || 'vetrivel_m',
          password: process.env.WDH_PASSWORD || 'DH@328bEfrz2@pG',
        },
        isDefault: true,
      },
    ],
  };
}

const registry = loadEnvironmentsRegistry();
const activeEnv = registry.environments.find((e) => e.id === registry.activeEnvironmentId) || registry.environments[0];

export const config = {
  activeEnvironmentId: registry.activeEnvironmentId,
  baseUrl: process.env.WDH_BASE_URL || activeEnv.baseUrl,
  credentials: {
    username: process.env.WDH_USERNAME || activeEnv.auth.username,
    password: process.env.WDH_PASSWORD || activeEnv.auth.password || '',
  },
  environment: process.env.WDH_ENV || activeEnv.category || 'SIT',
  timeouts: activeEnv.timeouts || {
    short: 5000,
    medium: 15000,
    long: 30000,
    pageLoad: 45000,
  },
};
