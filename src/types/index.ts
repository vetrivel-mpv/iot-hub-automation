export interface UserCredentials {
  username: string;
  password?: string;
}

export interface NavMenuItem {
  name: string;
  route?: string;
  subItems?: string[];
}

export interface DashboardWidget {
  title: string;
  locator?: string;
}

export interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
