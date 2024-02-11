import { CaseType } from "./CaseConverter"
import { RegistredType } from "./RegisteredType";

export interface Newable<T>{
  new(...args: any): T
}

export type Metadata = {
  type: any;
  ignore: boolean;
}

export interface IMapperFactory<T> {
  (Cntr?: Newable<T>, value?: any, ...params: any[]) : T
}

export interface ValidatorFn<T> {
  (value: T): boolean
}

export interface IErrorHandler {
  (error: Error): any
}

export interface IMapperOptions<T> {
  convention?: CaseType;
  factory?: IMapperFactory<T>;
  deriveType?: boolean;
  noKeyMapping?: boolean;
  errorHandler?: IErrorHandler;
  keyAutoMatch?: boolean
  relativeKey?: string
  validator?: ValidatorFn<T>;
}
