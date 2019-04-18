import { ILoadScriptOptions, loadModules as esriLoad } from 'esri-loader';

export function loadModules<T extends any[]>(modules: string[], loadScriptOptions?: ILoadScriptOptions): Promise<T> {
  return esriLoad(modules, loadScriptOptions) as Promise<T>;
}

export function createCtorParameterObject<T extends {}>(component: {}): Partial<T> {
  const result: T = {} as T;
  Object.keys(component).forEach(k => {
    if (k.startsWith('_') && !k.startsWith('__')) {
      result[k.substring(1)] = component[k];
    }
  });
  return trimEmptyFields(result);
}

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
