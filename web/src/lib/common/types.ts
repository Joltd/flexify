export const emptyId = '00000000-0000-0000-0000-000000000000';

export interface UserRecord {
  id: string;
  login: string;
  deleted: boolean;
  applications: MicroApp[];
}

export enum MicroApp {
  ADMIN = 'ADMIN',
  ENTITY = 'ENTITY',
  JIRIFY = 'JIRIFY',
}

export const MicroAppLabel = {
  [MicroApp.ADMIN]: 'Admin',
  [MicroApp.ENTITY]: 'Entity',
  [MicroApp.JIRIFY]: 'Jirify',
};

export function microAppLabels(applications: MicroApp[]): string | null {
  return applications.length
    ? applications.map(app => MicroAppLabel[app]).join(', ')
    : null;
}