// export enum 

export interface IObjectToArrayCallback {
  (key: string, value: any): any
}

export function fromObjectToArray(callback: IObjectToArrayCallback) {
  return (obj) => {
    const out = [];

    for (const [key, value] of Object.entries(obj)) {
      out.push(callback(key, value));
    }
    
    return out;
  }
}