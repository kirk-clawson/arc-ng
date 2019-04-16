import { EventEmitter } from '@angular/core';

export class EsriEventEmitter<T> extends EventEmitter<T> {
  private handle: IHandle;

  constructor(private esriEventName: string, isAsync?: boolean) {
    super(isAsync);
  }

  private handleCleanup(): void {
    if (this.handle != null) this.handle.remove();
    this.handle = null;
  }

  init(source: __esri.Evented) {
    if (this.observers.length > 0) {
      this.handleCleanup();
      this.handle = source.on(this.esriEventName, e => this.emit(e));
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
