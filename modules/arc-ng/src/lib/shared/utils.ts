/* tslint:disable:max-line-length */
/* tslint:disable:no-bitwise */
import { ILoadScriptOptions, loadModules } from 'esri-loader';

export function loadEsriModules<T extends any[]>(modules: string[], loadScriptOptions?: ILoadScriptOptions): Promise<T> {
  return loadModules(modules, loadScriptOptions) as Promise<T>;
}

// export function createCtorParameterObject<T extends {}>(component: {}): Partial<T> {
//   const result: T = {} as T;
//   Object.keys(component).forEach(k => {
//     if (k.startsWith('_') && !k.startsWith('__')) {
//       result[k.substring(1)] = component[k];
//     }
//   });
//   return trimEmptyFields(result);
// }

export function trimEmptyFields<T>(item: T, undefinedOnly: boolean = true): Partial<T> {
  Object.keys(item).forEach(k => {
    if (item[k] === undefined || (!undefinedOnly && item[k] === null)) delete item[k];
  });
  return item;
}

export function isEmpty(item: string | {}): boolean {
  if (typeof item === 'string') {
    return item.length === 0;
  } else {
    return item == null || Object.keys(item).length === 0;
  }
}

// noinspection JSCommentMatchesSignature
/**
 * Groups an array by the contents of a field identified by its name
 * @param items: The array to group
 * @param fieldName: The name of the field to extract grouping info from
 * @param valueSelector: Optional callback to transform each item before the final grouping
 */
export function groupBy<T extends { [key: string]: any }, K extends keyof T, R>(items: T[] | ReadonlyArray<T>, fieldName: K): Map<T[K], T[]>;
export function groupBy<T extends { [key: string]: any }, K extends keyof T, R>(items: T[] | ReadonlyArray<T>, fieldName: K, valueSelector: (item: T) => R): Map<T[K], R[]>;
export function groupBy<T extends { [key: string]: any }, K extends keyof T, R>(items: T[] | ReadonlyArray<T>, fieldName: K, valueSelector?: (item: T) => R): Map<T[K], (T | R)[]> {
  return groupByExtended(items, (i) => i[fieldName], valueSelector);
}

// noinspection JSCommentMatchesSignature
/**
 * Groups an array by the result of a keySelector function
 * @param items: The array to group
 * @param keySelector: A callback function that is used to generate the keys for the dictionary
 * @param valueSelector: Optional callback to transform each item before the final grouping
 */
export function groupByExtended<T, K, R>(items: T[] | ReadonlyArray<T>, keySelector: (item: T) => K): Map<K, T[]>;
export function groupByExtended<T, K, R>(items: T[] | ReadonlyArray<T>, keySelector: (item: T) => K, valueSelector: (item: T) => R): Map<K, R[]>;
export function groupByExtended<T, K, R>(items: T[] | ReadonlyArray<T>, keySelector: (item: T) => K, valueSelector?: (item: T) => R): Map<K, (T | R)[]> {
  const result = new Map<K, (T | R)[]>();
  if (items == null || items.length === 0) return result;
  const tx: ((item: T) => T | R) = valueSelector != null ? valueSelector : (i) => i;
  for (const i of items) {
    const currentKey = keySelector(i);
    const currentValue = tx(i);
    if (result.has(currentKey)) {
      result.get(currentKey).push(currentValue);
    } else {
      result.set(currentKey, [currentValue]);
    }
  }
  return result;
}

export function getUuid(): string {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
