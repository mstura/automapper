import { RegistredType } from "./RegisteredType";
import { Newable } from "./interfaces";

export class TypeComparator<T> {
  private type: RegistredType<T>;
  private registredTypes: Map<Newable<any>, RegistredType<any>>

  constructor(type: RegistredType<T>, registredTypes: Map<Newable<any>, RegistredType<any>>) {
    this.type = type;
    this.registredTypes = registredTypes;
  }

  public equals(mdl1: T, mdl2: T): boolean {
    const registry = this.type;
    const properties = Object.keys(registry.internalInstance);

      for (const property of properties) {
        const type = registry.getMappedKeyType(property);

        if (typeOf(this[property]) === 'array') {
          continue;
        }

        if ((type && this[property].$Equals$(model[property])) || this[property] === model[property]) {
          continue;
        }

        return false;
      }

      return true;
  }
}