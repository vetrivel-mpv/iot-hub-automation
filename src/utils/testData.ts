export class TestDataGenerator {
  /**
   * Generates a random alphanumeric string of specified length
   */
  static randomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random test email
   */
  static randomEmail(domain: string = 'nokiawing.com'): string {
    return `test_auto_${Date.now()}_${this.randomString(4)}@${domain}`;
  }

  /**
   * Generates invalid credentials test suite data
   */
  static getInvalidCredentials() {
    return [
      {
        description: 'Empty username and empty password',
        username: '',
        password: '',
      },
      {
        description: 'Invalid username format',
        username: 'invalid-user-no-domain',
        password: 'Password123!',
      },
      {
        description: 'Non-existent user with standard password',
        username: 'nonexistent.user999@nokiawing.com',
        password: 'WrongPassword999!',
      },
      {
        description: 'Valid format user with wrong password',
        username: 'testuser@nokiawing.com',
        password: 'IncorrectPassword!#',
      },
    ];
  }
}
