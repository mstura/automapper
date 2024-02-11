
export function getPrototype(obj: Object) {
  return Object.getPrototypeOf(obj);
}

export function getObjectProperties(obj: Object) {
  const proto = getPrototype(obj);
  return Object.getOwnPropertyNames(proto)
    .filter(_ => _ !== 'constructor' && typeof (obj[_]) !== 'function');
}

export function getMetadata(property: string, context: Object) {
  return Reflect.getOwnMetadata(property, context);
}

export function setMetadata(metadata) {
  return (target: any, propertyKey: string) => {
    let _metadata = getMetadata(propertyKey, target);

    _metadata = metadata;

    Reflect.defineMetadata(propertyKey, _metadata, target);
  };
}

export function defineType<T>(type: T) {
  return (target: any, propertyKey: string) => {
    let _metadata = getMetadata(propertyKey, target);
    if (!_metadata) {
      _metadata = { type: null, ignore: false };
    }

    _metadata.type = type;

    Reflect.defineMetadata(propertyKey, _metadata, target);

  }
}

export function ignore(foreignKey?: string) {
  return (target: any, propertyKey: string) => {
    let _metadata = getMetadata(propertyKey, target);
    if (!_metadata) {
      _metadata = { type: null, ignore: false };
    }

    _metadata.ignore = foreignKey ? foreignKey : propertyKey;

    Reflect.defineMetadata(propertyKey, _metadata, target);
  }
}