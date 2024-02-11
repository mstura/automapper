
export function getPrototype(obj: Object): any {
  return Object.getPrototypeOf(obj);
}

export function getPrototypeMetadata(property: string, context: Object): any {
  return Reflect.getOwnMetadata(property, context);
}

export function getInstanceMetadata(property: string, context: Object): any {
  return getPrototypeMetadata(property, getPrototype(context));
}

export function Type<T>(type: T): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    let _metadata = Reflect.getOwnMetadata(propertyKey, target);
    if (!_metadata) {
      _metadata = { type: null, ignore: false };
    }

    _metadata.type = type;

    Reflect.defineMetadata(propertyKey, _metadata, target);

  }
}

export function Ignore(foreignKey?: string) {
  return (target: any, propertyKey: string) => {
    let _metadata = Reflect.getOwnMetadata(propertyKey, target);
    if (!_metadata) {
      _metadata = { type: null, ignore: false };
    }

    _metadata.ignore = foreignKey ? foreignKey : propertyKey;

    Reflect.defineMetadata(propertyKey, _metadata, target);
  }
}