import { EsriWatchEmitter } from './esri-watch-emitter';

export class EsriComponentBase<T extends __esri.Accessor> {

  protected instance: T;

  protected setField<K extends keyof T>(fieldName: K, value: T[K]): void {
    const localField = '_' + fieldName;
    if (this[localField] !== value) {
      this[localField] = value;
      if (this.instance != null) this.instance[fieldName] = value;
    }
  }

  protected setAutoCastField<K extends keyof T>(fieldName: K, value: any): void {
    const localField = '_' + fieldName;
    if (this[localField] !== value) {
      this[localField] = value;
      if (this.instance != null) this.instance[fieldName] = value;
    }
  }

  protected createWatchedHandlers(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriWatchEmitter) {
        v.init(this.instance);
      }
    });
  }

}

export const loadAsyncChildren = async <C extends __esri.Accessor>(children: EsriAsyncComponentBase<C>[]): Promise<C[]> => {
  return await Promise.all(children.map(async c => await c.createInstance()));
};
export abstract class EsriAsyncComponentBase<T extends __esri.Accessor> extends EsriComponentBase<T> {
  abstract async createInstance(): Promise<T>;
}

export const loadAutoCastChildren = <C extends __esri.Accessor>(children: EsriAutoCastComponentBase<C>[]): any[] => {
  return children.map(c => c.createInstance());
};
export abstract class EsriAutoCastComponentBase<T extends __esri.Accessor> extends EsriComponentBase<T> {
  abstract createInstance(): any;
}
