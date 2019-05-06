import { EsriEmitterBase } from './esri-emitter-base';

export class EsriEventEmitter<T> extends EsriEmitterBase<T, __esri.Evented> {

  constructor(esriEventName: string, isAsync?: boolean) {
    super(esriEventName, isAsync);
  }

  init(source: __esri.Evented) {
    if (this.observers.length > 0) {
      this.handleCleanup();
      this.handle = source.on(this.esriEventName, e => this.emit(e));
    }
  }
}

export class EsriWatchEmitter<T> extends EsriEmitterBase<T, __esri.Accessor> {

  constructor(esriEventName: string, isAsync?: boolean) {
    super(esriEventName, isAsync);
  }

  init(source: __esri.Accessor) {
    if (this.observers.length > 0) {
      this.handleCleanup();
      this.handle = source.watch(this.esriEventName, newValue => this.emit(newValue));
    }
  }
}

export class EsriHitTestEmitter extends EsriEmitterBase<__esri.HitTestResult, __esri.MapView> {

  constructor(esriEventName: string, isAsync?: boolean) {
    super(esriEventName, isAsync);
  }

  init(source: __esri.MapView) {
    if (this.observers.length > 0) {
      this.handleCleanup();
      this.handle = source.on(this.esriEventName, e => {
        source.hitTest(e).then(r => this.emit(r));
      });
    }
  }
}
