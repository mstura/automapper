
export type KnownType =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "function"
  | "object"
  | "nan"
  | "array"
  | "null"
  | "promise";

export function typeOf(value: any): KnownType {
  const nativeTypeOf = typeof value;

  if (nativeTypeOf !== 'object') {
    if (nativeTypeOf === 'number' && isNaN(value)) {
      return 'nan';
    }
    return nativeTypeOf;
  }

  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  if (value instanceof Promise) {
    return 'promise';
  }

  return 'object';
}

export function isNill(type: KnownType) {
  return type === 'null' || type === 'undefined';
}