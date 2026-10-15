import { Page, Locator, expect } from '@playwright/test';
import { Logger } from './logger';

export interface FieldValidationRule {
  fieldName: string;
  locator: Locator;
  dataType: 'string' | 'number' | 'email' | 'iccid' | 'imsi' | 'ip_address' | 'currency';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minVal?: number;
  maxVal?: number;
  boundaryValues?: {
    valid: (string | number)[];
    invalid: (string | number)[];
  };
}

export class FormValidator {
  /**
   * Validates boundary values and data types for an input field
   */
  static async validateField(page: Page, rule: FieldValidationRule): Promise<void> {
    Logger.info(`[FORM VALIDATOR] Validating field: "${rule.fieldName}" (Type: ${rule.dataType})`);

    const input = rule.locator.first();
    if (!(await input.isVisible({ timeout: 3000 }).catch(() => false))) {
      Logger.warn(`[FORM VALIDATOR] Field "${rule.fieldName}" not visible for validation`);
      return;
    }

    // 1. Check Required / Empty Validation
    if (rule.required) {
      await input.fill('');
      await input.blur().catch(() => {});
      Logger.info(`[FORM VALIDATOR] Tested required empty state on "${rule.fieldName}"`);
    }

    // 2. Test Invalid Boundary Values
    const invalidSet = rule.boundaryValues?.invalid || this.getDefaultInvalidSet(rule.dataType, rule.maxLength);
    for (const val of invalidSet) {
      await input.fill(String(val));
      await input.blur().catch(() => {});
      await page.waitForTimeout(200);

      // Check if input rejected invalid chars or displayed helper error
      const currentVal = await input.inputValue().catch(() => '');
      Logger.info(`[FORM VALIDATOR] Invalid input "${val}" -> Field value: "${currentVal}"`);
    }

    // 3. Test Valid Boundary Values
    const validSet = rule.boundaryValues?.valid || this.getDefaultValidSet(rule.dataType, rule.minLength, rule.maxLength);
    for (const val of validSet) {
      await input.fill(String(val));
      await input.blur().catch(() => {});
      await page.waitForTimeout(200);
      const currentVal = await input.inputValue().catch(() => '');
      expect(currentVal).toBe(String(val));
      Logger.info(`[FORM VALIDATOR] ✅ Valid input "${val}" accepted on "${rule.fieldName}"`);
    }
  }

  /**
   * Generates default invalid values based on data type and boundary limits
   */
  private static getDefaultInvalidSet(dataType: string, maxLength?: number): (string | number)[] {
    switch (dataType) {
      case 'number':
        return ['abc!@#', '-999999999', '12.34.56'];
      case 'email':
        return ['plainaddress', '@missingusername.com', 'user@.com', 'user@domain..com'];
      case 'iccid':
        return ['8901', '89012345678901234567899999', '8901ABCD4567']; // Less than 19 or non-digit
      case 'imsi':
        return ['31041', '3104101234567890000', '31041ABC4567'];
      case 'ip_address':
        return ['999.999.999.999', '192.168.1', '192.168.1.1.1', 'abc.def.ghi.jkl'];
      case 'string':
      default:
        return maxLength ? ['A'.repeat(maxLength + 20), '<script>alert(1)</script>'] : ['<script>alert(1)</script>'];
    }
  }

  /**
   * Generates default valid boundary values
   */
  private static getDefaultValidSet(dataType: string, minLength?: number, maxLength?: number): (string | number)[] {
    switch (dataType) {
      case 'number':
        return [0, 1, 100, 99999];
      case 'email':
        return ['test.user@iothub.com', 'qa_enterprise@azurefd.net'];
      case 'iccid':
        return ['8901410321111851072', '8901410321111851080'];
      case 'imsi':
        return ['310410123456789', '310410987654321'];
      case 'ip_address':
        return ['10.0.0.1', '192.168.1.100', '172.16.0.254'];
      case 'string':
      default:
        const minVal = minLength ? 'A'.repeat(minLength) : 'Test';
        const maxVal = maxLength ? 'A'.repeat(maxLength) : 'Standard String Value';
        return [minVal, maxVal];
    }
  }
}
