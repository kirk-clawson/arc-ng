import { ILoadScriptOptions, loadModules as esriLoad } from 'esri-loader';

export function loadModules<T extends any[]>(modules: string[], loadScriptOptions?: ILoadScriptOptions): Promise<T> {
  return esriLoad(modules, loadScriptOptions) as Promise<T>;
}
