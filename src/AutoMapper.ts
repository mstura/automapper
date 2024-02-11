import 'reflect-metadata';
import { ConverterLibrary } from './CaseConverter';
import { IMapperFactory, IMapperOptions, Newable } from './interfaces';
import { RegistredType } from './RegisteredType';
import { isNill, typeOf } from './typeof';
import { mergeDefaultMapperOptions } from './utils';

export class AutoMapper {

  protected options: IMapperOptions<any>;
  protected registredTypes: Map<Newable<any>, RegistredType<any>>;
  protected converterLibrary: ConverterLibrary;

  constructor()
  constructor(options: IMapperOptions<any>)
  constructor(options?: IMapperOptions<any>) {
    this.options = mergeDefaultMapperOptions(options);
    this.registredTypes = new Map();
    this.converterLibrary = new ConverterLibrary();
  }

  public register<T, Y>(Cntr: Newable<T>): RegistredType<T>;
  public register<T>(Cntr: Newable<T>, factory: IMapperFactory<T>): RegistredType<T>;
  public register<T>(Cntr: Newable<T>, options: IMapperOptions<T>): RegistredType<T>;
  public register<T>(Cntr: Newable<T>, options?: IMapperOptions<T> | IMapperFactory<T>): RegistredType<T> {
    const optionType = typeOf(options);

    if (this.registredTypes.has(Cntr)) {
      throw new ReferenceError(`${Cntr.name} already registered, extend the class with a new name to register it with a different mapping`);
    }

    if (optionType === 'function') {
      options = { ...this.options, factory: options as IMapperFactory<T> };
    } else {
      if (optionType === 'object') {
        options = { ...this.options, ...options } as IMapperOptions<T>
      } else {
        options = this.options;
      }
    }

    const registeredType = new RegistredType<T>(Cntr, options, this.converterLibrary);

    this.registredTypes.set(Cntr, registeredType);

    return registeredType;
  }

  public override<T, Y>(Cntr: Newable<T>): RegistredType<T>;
  public override<T>(Cntr: Newable<T>, factory: IMapperFactory<T>): RegistredType<T>;
  public override<T>(Cntr: Newable<T>, options: IMapperOptions<T>): RegistredType<T>;
  public override<T>(Cntr: Newable<T>, options?: IMapperOptions<T> | IMapperFactory<T>): RegistredType<T> {
    const optionType = typeOf(options);

    if (!this.registredTypes.has(Cntr)) {
      throw new ReferenceError(`${Cntr.name} not registered, use register instead`);
    }

    const previousRegisteredType = this.registredTypes.get(Cntr);

    if (optionType === 'function') {
      options = { ...previousRegisteredType.getOptions(), factory: options as IMapperFactory<T> };
    } else {
      if (optionType === 'object') {
        options = { ...previousRegisteredType.getOptions(), ...options } as IMapperOptions<T>
      } else {
        options = previousRegisteredType.getOptions();
      }
    }

    const registeredType = new RegistredType<T>(Cntr, options, this.converterLibrary);

    this.registredTypes.set(Cntr, registeredType);

    return registeredType;
  }

  protected getOrRegisteredType<T>(Model: Newable<T>): RegistredType<T> {
    if (!this.isRegistered(Model)) {
      return this.register(Model, this.options);
    }
    return this.getRegistered(Model)
  }

  public isRegistered<T>(type: Newable<T>): boolean {
    return this.registredTypes.has(type);
  }

  public getRegistered<T>(Model: Newable<T>): RegistredType<T> | never {
    return this.registredTypes.get(Model);
  }

  map<T, Y>(data: Y, Model: Newable<T>, ...params: any[]): (Y extends Array<any> ? T[] : T);
  map<T, Y>(data: Y[], Model: Newable<T>, ...params: any[]): (Y extends Array<any> ? T[] : T);
  map<T, Y>(data: Y[] | Y, Model: Newable<T>, ...params: any[]): (Y extends Array<any> ? T[] : T) {
    const dataType = typeOf(data);

    if (dataType === 'array') {
      return this.mapArray(data as any[], Model, ...params) as (Y extends Array<any> ? T[] : T);
    } else if (dataType === 'object') {
      return this.internalMap(data, Model, ...params) as (Y extends Array<any> ? T[] : T);
    } else if (!isNill(dataType)) {
      return this.mapValue(data, Model, ...params) as (Y extends Array<any> ? T[] : T);
    }

    return null;
  }

  protected internalMap<T extends Newable<any>, Y extends Object>(obj: Y, Model: T, ...params: any[]): T {
    const registeredType = this.getOrRegisteredType(Model);
    const { factory, noKeyMapping, errorHandler, keyAutoMatch, relativeKey, validator }: IMapperOptions<T> = registeredType.getOptions();
    let instance: T;
    registeredType.parse();

    if (relativeKey) {
      obj = obj[relativeKey];
    }

    try {
      instance = factory(Model, obj, ...params);
    } catch (error) {
      if (errorHandler) {
        instance = errorHandler(error);
      } else {
        throw error;
      }
    }

    if (!noKeyMapping) {

      for (const key in obj) {

        if (registeredType.isIgnored(key)) {
          continue;
        }

        const sourceKey = registeredType.isKeyMapped(key)
          ? registeredType.getKeyMapping(key)
          : (keyAutoMatch
            ? registeredType.match(key)
            : null);

        if (!sourceKey) {
          continue;
        }

        const Type = registeredType.getMappedKeyType(sourceKey);
        const dataTransformer = registeredType.getDataTransformer(key);
        const dataToMap = dataTransformer ? dataTransformer(obj[key]) : obj[key];
        const propValidator = registeredType.getPropertyValidator(key);

        if (Type) {
          instance[sourceKey] = this.map(dataToMap, Type, ...params);
        } else {
          instance[sourceKey] = dataToMap;
        }

        if (propValidator) {
          if (!propValidator(instance[sourceKey])) {
            // what to do ? 
            // - throw and stop mapping?
            // - store validation errors and allow user to flush to retrieve the errors
          }
        }
      }

      if (validator) {
        if (validator) {
          // what to do ? 
          // - throw and stop mapping?
          // - store validation errors and allow user to flush to retrieve the errors
        }
      }
    }

    return instance;
  }

  protected mapValue<T extends Newable<any>>(value: any, Model: T, ...params: any[]): T {
    const registeredType = this.getOrRegisteredType(Model);
    const { factory, errorHandler }: IMapperOptions<T> = registeredType.getOptions();
    let instance: T;

    try {
      instance = factory(Model, value, ...params);
    } catch (error) {
      if (errorHandler) {
        instance = errorHandler(error);
      } else {
        throw error;
      }
    }

    return instance;
  }

  protected mapArray<T>(array: any[], Model: Newable<T>, ...params: any[]): T[] {
    const list: T[] = [];
    const arrLen = array.length;

    for (let index = 0; index < arrLen; index++) {
      const data = array[index];
      const mapped = this.map(data, Model, index, ...params) as T;

      list.push(mapped);
    }

    return list as T[];
  }

  public optimize(): void {
    const registeredTypes = this.registredTypes.values();

    for (const registredType of registeredTypes) {
      registredType.parse();
    }
  }
}