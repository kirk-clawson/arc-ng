import { EventEmitter } from '@angular/core';

export class EsriWatchEmitter<T> extends EventEmitter<T> {
  protected handle: __esri.WatchHandle;

  constructor(protected esriFieldName: string, isAsync?: boolean) {
    super(isAsync);
  }

  protected handleCleanup(): void {
    if (this.handle != null) this.handle.remove();
    this.handle = null;
  }

  init(source: __esri.Accessor) {
    if (this.observers.length > 0) {
      this.handleCleanup();
      this.handle = source.watch(this.esriFieldName, newValue => this.emit(newValue));
    }
  }

  error(err: any): void {
    this.handleCleanup();
    super.error(err);
  }

  complete(): void {
    this.handleCleanup();
    super.complete();
  }

  unsubscribe(): void {
    this.handleCleanup();
    super.unsubscribe();
  }
}
