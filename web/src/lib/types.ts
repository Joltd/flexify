export interface UserRecord {
  id: string;
  login: string;
  deleted: boolean;
  applications: MicroApp[];
}

export enum MicroApp {
  ADMIN = 'ADMIN',
  ENTITY = 'ENTITY',
}

export const MicroAppLabel = {
  [MicroApp.ADMIN]: 'Admin',
  [MicroApp.ENTITY]: 'Entity',
};

export function microAppLabels(applications: MicroApp[]): string | null {
  return applications.length
    ? applications.map(app => MicroAppLabel[app]).join(', ')
    : null;
}