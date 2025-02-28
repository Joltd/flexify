export interface EntityMetadata {
  name: string
  fields: EntityFieldMetadata[]
}

export enum EntityFieldKind {
  ID = 'ID',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  ENUM = 'ENUM',
  REFERENCE = 'REFERENCE',
  JSON = 'JSON',
}

export interface EntityFieldMetadata {
  name: string
  kind: EntityFieldKind
  operators: string[]
  entity: string
  options: string[]
}

export interface EntityListPage {
  total: number
  page: number
  size: number
  data: Record<string, any>[]
}

export interface ReferenceValue {
  id: string
  label: string
}

export enum EntityFieldOperator {
  EQUALS = 'EQUALS',
  GREATER = 'GREATER',
  GREATER_EQUALS = 'GREATER_EQUALS',
  LESS = 'LESS',
  LESS_EQUALS = 'LESS_EQUALS',
  LIKE = 'LIKE',
  IN_LIST = 'IN_LIST',
  IS_NULL = 'IS_NULL',
}