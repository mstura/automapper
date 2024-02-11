import { CaseType, ConverterLibrary } from './CaseConverter';
import { IMapperOptions, Newable, Metadata, ValidatorFn } from "./interfaces";
import { getMetadata, getPrototype } from './metadata';
import { typeOf } from './typeof';

export class RegistredType<T> {

  protected type: Newable<T>;
  protected mapperOptions: IMapperOptions<T>;
  protected ignoredKeys: Set<string>;
  protected sourceMappings: Map<string, string>;
  protected foreignMappings: Map<string, string>;
  protected typeMappings: Map<string, any>;
  protected dataTransformers: Map<string, Function>;
  protected propertyValidators: Map<string, ValidatorFn<any>>;
  protected validator: ValidatorFn<T>;
  protected caseConverter: ConverterLibrary;
  protected internalInstance: T;
  private parsed: boolean;

  constructor(type: Newable<T>);
  constructor(type: Newable<T>, mapperOptions: IMapperOptions<T>);
  constructor(type: Newable<T>, mapperOptions: IMapperOptions<T>, caseConverter: ConverterLibrary)
  constructor(type: Newable<T>, mapperOptions?: IMapperOptions<T>, caseConverter?: ConverterLibrary) {
    this.type = type;
    this.sourceMappings = new Map();
    this.foreignMappings = new Map();
    this.typeMappings = new Map();
    this.dataTransformers = new Map();
    this.propertyValidators = new Map();
    this.validator = null;
    this.ignoredKeys = new Set();
    this.mapperOptions = mapperOptions;
    this.parsed = false;

    if (!caseConverter) {
      caseConverter = new ConverterLibrary();
    }

    this.caseConverter = caseConverter;;
    this.internalInstance = this.mapperOptions.factory(this.type);
  }

  public parse(): void {
    if (this.parsed) {
      return;
    }

    const properties = Object.keys(this.internalInstance);
    const propertyLength = properties.length;

    for (let index = 0; index < propertyLength; index++) {
      const propertyName = properties[index];

      if (!this.sourceMappings.has(propertyName)) {
        const metadata = this.getPropertyMetadata(propertyName);

        if (metadata.ignore) {
          this.ignoredKeys.add(propertyName);
        }

        if (!this.caseConverter.has(propertyName)) {
          this.caseConverter.register(propertyName);
          this.caseConverter.get(propertyName).parse(this.mapperOptions.convention);
        }

        const targetKey = this.caseConverter.get(propertyName).unsafeToCaseType(this.mapperOptions.convention);
        this.sourceMappings.set(propertyName, targetKey);
        this.foreignMappings.set(targetKey, propertyName);

        if (metadata.type) {
          this.typeMappings.set(propertyName, metadata.type);
        } else if (this.mapperOptions.deriveType) {
          const instancePropertyValue = this.internalInstance[propertyName];

          if (typeOf(instancePropertyValue) === 'function') {

            this.typeMappings.set(propertyName, instancePropertyValue);
          }
        }
      }
    }

    this.parsed = true;
  }

  public getTypePropertyNames(): string[] {
    return Object.keys(this.internalInstance);
  }

  protected getPropertyMetadata(property: string): Metadata {
    const metadata = getMetadata(property, getPrototype(this.internalInstance));

    if (metadata) {
      return metadata;
    }

    return { type: null, ignore: false };
  }

  public getPropertyValidator(property: string): ValidatorFn<any> {
    return this.propertyValidators.get(property)
  }

  public match(key: string): string | never {
    const foreign = this.caseConverter.getOrRegister(key);

    for (const sourceKey of this.sourceMappings.keys()) {
      const source = this.caseConverter.getOrRegister(sourceKey);

      if (source.equals(foreign, CaseType.LOWER)) {
        this.foreignMappings.set(key, sourceKey);

        return sourceKey;
      }
    }

    return null;
  }

  public ignore(property: string): this {
    this.ignoredKeys.add(property);

    return this;
  }

  public isIgnored(property: string): boolean {
    return this.ignoredKeys.has(property);
  }

  public validate<Y>(property: string, validator: ValidatorFn<Y>): this {
    if (this.propertyValidators.has(property)) {
      throw new ReferenceError(`key ${property} already has a validator defined`);
    }
    
    this.propertyValidators.set(property, validator);

    return this;
  }

  public transform(foreignKey: string, transformCb: Function): this {
    if (this.dataTransformers.has(foreignKey)) {
      throw new ReferenceError(`key ${foreignKey} already has a transformation defined`);
    }
    
    this.dataTransformers.set(foreignKey, transformCb);

    return this;
  }

  public define(foreignKey: string, sourceKey: string): this
  public define<Y>(foreignKey: string, sourceKey: string, type: Y): this
  public define<Y>(foreignKey: string, type: Y): this
  public define<Y>(foreignKey: string, sourceKey: string, type?: Y): this {
    if (typeof sourceKey !== 'string') {
      type = sourceKey;
      sourceKey = foreignKey;
    }

    if (!Object.hasOwnProperty.call(this.internalInstance, sourceKey)) {
      throw new ReferenceError(`key ${sourceKey} not found on ${this.type.name}`);
    }

    if (!this.foreignMappings.has(foreignKey)) {

      if (!this.sourceMappings.has(sourceKey)) {
        this.sourceMappings.set(sourceKey, foreignKey);
      }

      this.foreignMappings.set(foreignKey, sourceKey);

      if (type) {
        this.typeMappings.set(sourceKey, type);
      }
    }

    return this;
  }

  public getKeyMapping(key: string): string {
    if (this.isKeyMapped(key)) {
      return this.foreignMappings.get(key);
    }

    return null;
  }

  public getMappedKeyType(sourceKey: string): any | never {
    if (this.typeMappings.has(sourceKey)) {
      return this.typeMappings.get(sourceKey);
    }

    return null;
  }

  public getDataTransformer(key: string) {
    if (this.dataTransformers.has(key)) {
      return this.dataTransformers.get(key);
    }

    return null;
  }

  public isKeyMapped(key: string) {
    return this.foreignMappings.has(key);
  }

  public getOptions(): IMapperOptions<T> {
    return this.mapperOptions;
  }
}
