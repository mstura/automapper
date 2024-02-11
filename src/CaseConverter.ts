const enc = new TextEncoder();
const dec = new TextDecoder();

export enum CaseType {
  CAMELCASE = 0,
  PASCALCASE = 1,
  SNAKECASE = 2,
  PARAMCASE = 3,
  SPACE_SEPARATED = 4,
  DOT_SEPARATED = 5,
  CONST = 6,
  LOWER = 7,
  UPPER = 8,
  KEBABCASE = 9,
};

const SPACE = 0x20;
const DASH = 0x2d;
const UNDERSCORE = 0x5f;
const DOT = 0x2e;

function isSymbol(charValue: number) {
  return charValue === DOT || charValue === DASH || charValue === UNDERSCORE;
}

function isLowerCase(charValue: number) {
  return charValue >= 0x61 && charValue <= 0x7a;
}

function isUpperCase(charValue: number) {
  return charValue >= 0x41 && charValue <= 0x5a;
}

function toUpper(charValue: number) {
  return isLowerCase(charValue)
    ? charValue - 0x20
    : charValue;
}

function toLower(charValue: number) {
  return isUpperCase(charValue)
    ? charValue + 0x20
    : charValue;
}

function Uint8ArrayEquals(arr1: Uint8Array, arr2: Uint8Array): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let index = 0; index < arr1.length; index++) {
    if(arr1[index] !== arr2[index]) {
      return false
    }
  }

  return true;
}

function Uint8ArrayCompare(arr1: Uint8Array, arr2: Uint8Array): 0 | -1 | 1 {
  if (arr1.length !== arr2.length) {
    return arr1.length > arr2.length ? 1 : -1;
  }

  for (let index = 0; index < arr1.length; index++) {

    if(arr1[index] !== arr2[index]) {
      return arr1[index] > arr2[index] ? 1 : -1;
    }
  }

  return 0;
}

function tokenify(str: string): Uint8Array {
  const buff = enc.encode(str);
  const buffl = buff.length;
  const out = new Uint8Array(buffl * 2);
  let rl = 0;

  for (let index = 0; index < buffl; index++) {
    const char = buff[index];

    if (isSymbol(char)) {
      out[rl++] = SPACE;
    } else if (index !== 0 && isUpperCase(char)) {
      out[rl++] = SPACE;
      out[rl++] = char + 0x20;
    } else {
      out[rl++] = toLower(char);
    }
  }

  return out.subarray(0, rl);
}

function seperatorBasedCase(tkns: Uint8Array, seperator: number, valueTransform: number = 0): string {
  const tknsl = tkns.length;
  const output = new Uint8Array(tknsl);
  let prevWasSep = false;

  for (let index = 0; index < tknsl; index++) {
    const tkn = tkns[index];

    if (tkn === SPACE) {
      if (prevWasSep) {
        continue;
      } else {
        output[index] = seperator;
      }
      prevWasSep = true;
    } else {
      output[index] = tkn + valueTransform;
      prevWasSep = false;
    }
  }

  return Uint8ArrayToString(trimOutput(output));
}

function capitalizationBasedCase(tkns: Uint8Array, capitalize: boolean): string {
  const tknsl = tkns.length;
  const output = new Uint8Array(tknsl);
  let offset = 0;

  for (let index = 0; index < tknsl; index++) {
    let tkn = tkns[index];

    if (tkn === SPACE) {
      capitalize = true;
      offset++;
      continue;
    }

    output[index - offset] = capitalize ? toUpper(tkn) : tkn;
    capitalize = false;
  }

  return Uint8ArrayToString(trimOutput(output));
}

function seperatorTrimmed(tkns: Uint8Array, valueTransform: number = 0): Uint8Array {
  const tknsl = tkns.length;
  const output = new Uint8Array(tknsl);
  let offset = 0;

  for (let index = 0; index < tknsl; index++) {
    let tkn = tkns[index];

    if (tkn === SPACE) {
      offset++;
      continue;
    }

    output[index - offset] = tkn + valueTransform;
  }

  return output;
}

function toSpaceSeparated(tokenArray: Uint8Array) {
  return seperatorBasedCase(tokenArray, SPACE);
}

function toParamCase(tokenArray: Uint8Array) {
  return seperatorBasedCase(tokenArray, DASH);
}

function toSnakeCase(tokenArray: Uint8Array) {
  return seperatorBasedCase(tokenArray, UNDERSCORE);
}

function toDotCase(tokenArray: Uint8Array) {
  return seperatorBasedCase(tokenArray, DOT);
}

function toConstantCase(tokenArray: Uint8Array) {
  return seperatorBasedCase(tokenArray, UNDERSCORE, -0x20);
}

function toPascalCase(tokenArray: Uint8Array) {
  return capitalizationBasedCase(tokenArray, true);
}

function toCamelCase(tokenArray: Uint8Array) {
  return capitalizationBasedCase(tokenArray, false);
}

function toLowerCase(tokenArray: Uint8Array) {
  return seperatorTrimmed(tokenArray);
}

function toLowerCaseString(tokenArray: Uint8Array) {
  return Uint8ArrayToString(seperatorTrimmed(tokenArray));
}

function toUpperCase(tokenArray: Uint8Array) {
  return seperatorTrimmed(tokenArray, -0x20);
}

function toUpperCaseString(tokenArray: Uint8Array) {
  return Uint8ArrayToString(seperatorTrimmed(tokenArray, -0x20));
}

function trimOutput(buff: Uint8Array) {
  return buff.filter(_ => _ !== 0x00);
}

function Uint8ArrayToString(buff: Uint8Array) {
  return dec.decode(buff);
}

function strcmp(a: string, b: string): 0 | 1 | -1 {
  return (a < b ? -1 : (a > b ? 1 : 0));
}

export type ICaseGenerator = (tokenArray: Uint8Array) => string

export interface ICaseConverterOptions {
  parseOnInit?: boolean,
}

export function mergeDefaultCaseConverterOptions(options: ICaseConverterOptions = {}): ICaseConverterOptions {
  return {
    parseOnInit: true,
    ...options,
  }
}

export class CaseConverter {

  private value: string;
  private tokens: Uint8Array;
  private outputs: Map<CaseType, string>;
  private options: ICaseConverterOptions;

  constructor(str: string, options?: ICaseConverterOptions) {
    this.options = mergeDefaultCaseConverterOptions(options);
    this.value = str;
    this.tokens = this.options.parseOnInit ? tokenify(str) : null;
    this.outputs = new Map<CaseType, string>();
  }

  public parse(types: CaseType[]): void;
  public parse(types: CaseType): void;
  public parse(types: CaseType[] | CaseType): void {
    if (Array.isArray(types)) {
      for (const type of types) {
        const generator = this.getGenerator(type);
        this.outputs.set(type, generator(this.tokens));
      }
    } else if (types !== undefined) {
      const generator = this.getGenerator(types);
      this.outputs.set(types, generator(this.tokens));
    }
  }

  public equals(obj: CaseConverter): boolean;
  public equals(obj: CaseConverter, type: CaseType): boolean;
  public equals(obj: CaseConverter, type?: CaseType): boolean {

    switch (type) {
      case CaseType.UPPER:
        return Uint8ArrayEquals(toUpperCase(this.tokens), toUpperCase(obj.getUint8Array()));
      case CaseType.LOWER:
        return Uint8ArrayEquals(toLowerCase(this.tokens), toLowerCase(obj.getUint8Array()));
      case CaseType.CONST:
      case CaseType.CAMELCASE:
      case CaseType.PASCALCASE:
      case CaseType.SNAKECASE:
      case CaseType.PARAMCASE:
      case CaseType.KEBABCASE:
      case CaseType.SPACE_SEPARATED:
      case CaseType.DOT_SEPARATED:
        return this.toCaseType(type) === obj.toCaseType(type);
      default:
        return Uint8ArrayEquals(this.tokens, obj.getUint8Array());
    }
  }

  public compare(obj: CaseConverter): 0 | 1 | -1;
  public compare(obj: CaseConverter, type: CaseType): 0 | 1 | -1;
  public compare(obj: CaseConverter, type?: CaseType): 0 | 1 | -1 {
    switch (type) {
      case CaseType.UPPER:
        return Uint8ArrayCompare(toUpperCase(this.tokens), toUpperCase(obj.getUint8Array()));
      case CaseType.LOWER:
        return Uint8ArrayCompare(toLowerCase(this.tokens), toLowerCase(obj.getUint8Array()));
      case CaseType.CONST:
      case CaseType.CAMELCASE:
      case CaseType.PASCALCASE:
      case CaseType.SNAKECASE:
      case CaseType.PARAMCASE:
      case CaseType.KEBABCASE:
      case CaseType.SPACE_SEPARATED:
      case CaseType.DOT_SEPARATED:
        return strcmp(this.toCaseType(type), obj.toCaseType(type));
      default:
        return Uint8ArrayCompare(this.tokens, obj.getUint8Array());
    }
  }

  protected getGenerator(type: CaseType): ICaseGenerator {
    switch (type) {
      case CaseType.CAMELCASE:
        return toCamelCase;
      case CaseType.PASCALCASE:
        return toPascalCase;
      case CaseType.SNAKECASE:
        return toSnakeCase;
      case CaseType.PARAMCASE:
      case CaseType.KEBABCASE:
        return toParamCase;
      case CaseType.SPACE_SEPARATED:
        return toSpaceSeparated;
      case CaseType.DOT_SEPARATED:
        return toDotCase;
      case CaseType.CONST:
        return toConstantCase;
      case CaseType.LOWER:
        return toLowerCaseString;
      case CaseType.UPPER:
        return toUpperCaseString;
      default:
        return toCamelCase;
    }
  }

  /**
   * Only available if the requested case has already been parsed or accessed previously using safe accessors
   */
  public unsafeToCaseType(type: CaseType): string | never {
    return this.outputs.get(type);
  }

  protected toCaseType(type: CaseType): string {
    if (!this.outputs.has(type)) {
      this.outputs.set(type, this.getGenerator(type)(this.tokens));
    }

    return this.outputs.get(type)
  }

  public getValue(): string {
    return this.value;
  }

  protected getUint8Array() {
    return this.tokens;
  }

  public toSpaceSeparated(): string {
    return this.toCaseType(CaseType.SPACE_SEPARATED);
  }

  public toParamCase(): string {
    return this.toCaseType(CaseType.PARAMCASE);
  }

  public toKebabCase(): string {
    return this.toCaseType(CaseType.KEBABCASE);
  }


  public toSnakeCase(): string {
    return this.toCaseType(CaseType.SNAKECASE);
  }

  public toDotCase(): string {
    return this.toCaseType(CaseType.DOT_SEPARATED);
  }

  public toPascalCase(): string {
    return this.toCaseType(CaseType.PASCALCASE);
  }

  public toCamelCase(): string {
    return this.toCaseType(CaseType.CAMELCASE);
  }

  public toLowerCase(): string {
    return this.toCaseType(CaseType.LOWER);
  }

  public toUpperCase(): string {
    return this.toCaseType(CaseType.UPPER);
  }

  public toConstantCase(): string {
    return this.toCaseType(CaseType.CONST);
  }
}

export function convert(str: string = '') {
  return new CaseConverter(str);
}

export class ConverterLibrary {

  private hashMap: Map<string, CaseConverter>;

  constructor() {
    this.hashMap = new Map();
  }

  public clear(): void {
    this.hashMap.clear();
  }

  public delete(entry: string): boolean {
    return this.hashMap.delete(entry);
  }

  public get(entry: string): CaseConverter | never {
    return this.hashMap.get(entry);
  }

  public getOrRegister(entry): CaseConverter {
    return this.has(entry)
      ? this.get(entry)
      : this.register(entry).get(entry);
  }

  public has(entry: string): boolean {
    return this.hashMap.has(entry);
  }

  public register(entry: string): this {
    this.hashMap.set(entry, new CaseConverter(entry));

    return this;
  }

  public entries(): IterableIterator<string> {
    return this.hashMap.keys();
  }

  public getSize(): number {
    return this.hashMap.size;
  }

  public equals(str1: string, str2: string): boolean;
  public equals(str1: string, str2: string, type: CaseType): boolean;
  public equals(str1: string, str2: string, type?: CaseType): boolean {
    const string1 = this.has(str1) ? this.get(str1) : this.register(str1).get(str1);
    const string2 = this.has(str2) ? this.get(str2) : this.register(str2).get(str2);

    return string1.equals(string2, type);
  }

  public compare(str1: string, str2: string): 0 | 1 | -1;
  public compare(str1: string, str2: string, type: CaseType): 0 | 1 | -1;
  public compare(str1: string, str2: string, type?: CaseType): 0 | 1 | -1 {
    const string1 = this.has(str1) ? this.get(str1) : this.register(str1).get(str1);
    const string2 = this.has(str2) ? this.get(str2) : this.register(str2).get(str2);

    return string1.compare(string2, type);
  }

  public parseAll(): void;
  public parseAll(types: CaseType[]): void;
  public parseAll(types?: CaseType[]): void {
    for (const entry of this.hashMap.keys()) {
      this.parse(entry, types);
    }
  }

  public parse(entry: string): void;
  public parse(entry: string, types: CaseType[]): void;
  public parse(entry: string, types?: CaseType[]): void {
    if (this.has(entry)) {
      const converter = this.hashMap.get(entry);

      if (!types) {
        types = [CaseType.CAMELCASE, CaseType.DOT_SEPARATED, CaseType.PARAMCASE, CaseType.PASCALCASE, CaseType.SNAKECASE, CaseType.SPACE_SEPARATED];
      }

      converter.parse(types);
    }
  }
}
