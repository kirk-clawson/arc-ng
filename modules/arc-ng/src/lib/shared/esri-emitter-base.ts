import { EventEmitter } from '@angular/core';

export abstract class EsriEmitterBase<T, U> extends EventEmitter<T> {
  protected handle: IHandle;

  protected constructor(protected esriEventName: string, isAsync?: boolean) {
    super(isAsync);
  }

  protected handleCleanup(): void {
    if (this.handle != null) this.handle.remove();
    this.handle = null;
  }

  abstract init(source: U);

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
