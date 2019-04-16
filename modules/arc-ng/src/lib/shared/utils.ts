import { ILoadScriptOptions, loadModules as esriLoad } from 'esri-loader';

export function loadModules<T extends any[]>(modules: string[], loadScriptOptions?: ILoadScriptOptions): Promise<T> {
  return esriLoad(modules, loadScriptOptions) as Promise<T>;
}

export function trimEmptyFields<T>(item: T, undefinedOnly: boolean = true): Partial<T> {
  Object.keys(item).forEach(k => {
    if (item[k] === undefined || (!undefinedOnly && item[k] === null)) delete item[k];
  });
  return item;
}
