import { CaseType } from "./CaseConverter";
import { IMapperOptions, Newable } from "./interfaces";
import { isNill, typeOf } from "./typeof";

export function defaultFactory<T>(obj: T): T;
export function defaultFactory<T, Y>(obj: T, value: Y): T;
export function defaultFactory<T, Y>(obj: T, value: Y, ...params: any[]): T;
export function defaultFactory<T>(Model: Newable<T>): InstanceType<Newable<T>>;
export function defaultFactory<T, Y>(Model: Newable<T>, value: Y): InstanceType<Newable<T>>;
export function defaultFactory<T, Y>(Model: Newable<T>, value: Y, ...params: any[]): InstanceType<Newable<T>>;
export function defaultFactory<T, Y>(Model: Newable<T>, value?: Y, ...params: any[]): InstanceType<Newable<T>> {
  const modelType = typeOf(Model);

  if (isNill(modelType) || modelType === 'array') {
    return null;
  } else if (Model instanceof Object && Model.constructor.name === 'Object') {
    return Object.create(Model as Object);
  } else if (modelType === 'function') {
    return new Model(value, ...params);
  }

  return null;
}

export function mergeDefaultMapperOptions(options: IMapperOptions<any> = {}): IMapperOptions<any> {
  return {
    factory: defaultFactory,
    deriveType: false,
    convention: CaseType.CAMELCASE,
    noKeyMapping: false,
    errorHandler: null,
    keyAutoMatch: false,
    relativeKey: null,
    ...options,
  }
}

export function isNull(value: any): boolean {
  const typeOfVal = typeOf(value);

  return isNill(typeOfVal);
}
