import typeSchemas from './type-schemas.json';

export type AtomType = keyof typeof typeSchemas.types;

export interface TypeSchema {
  floor_stage: number;
  default_module: string;
  has_body_schema: boolean;
  body_schema: Record<string, any> | null;
  extensions: string[];
  naming: string;
  drive_dest: string;
  usage_notes: string;
}

export function getTypeSchema(type: AtomType): TypeSchema {
  return typeSchemas.types[type];
}

export function getFloorStage(type: AtomType): number {
  return typeSchemas.types[type].floor_stage;
}

export function getDefaultModule(type: AtomType): string {
  return typeSchemas.types[type].default_module;
}

export function getExtensions(type: AtomType): string[] {
  return typeSchemas.types[type].extensions;
}

export function hasBodySchema(type: AtomType): boolean {
  return typeSchemas.types[type].has_body_schema;
}

export const ALL_TYPES = Object.keys(typeSchemas.types) as AtomType[];
