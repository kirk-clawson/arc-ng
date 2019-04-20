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

  protected createWatchedHandlers(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriWatchEmitter) {
        v.init(this.instance);
      }
    });
  }

}
