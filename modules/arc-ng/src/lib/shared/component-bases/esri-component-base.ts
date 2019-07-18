import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EsriEmitterBase } from '../esri-emitter-base';
import { isDependantChild } from '../type-utils';
import { loadEsriModules } from '../utils';

export class EsriComponentBase<T, C> {
  get initializer(): C {
    return this._initializer;
  }
  get instance(): T {
    return this._instance;
  }
  set instance(value: T) {
    this._instance = value;
    this.instanceCreated.emit(value);
  }
  private _instance: T;
  private _initializer: C = {} as any;

  instanceCreated = new EventEmitter<T>();

  getInstance$(): Observable<T> {
    if (this._instance != null) {
      return of(this._instance);
    } else {
      return this.instanceCreated;
    }
  }

  replaceInstance(newInstance: T) {
    this._instance = newInstance;
  }

  protected initOrChangeValueField<K extends keyof T & keyof C>(fieldName: K, value: C[K] extends T[K] ? T[K] : never): void {
    if (this.instance == null) {
      this.initializeField(fieldName, value as any);
    } else {
      this.changeField(fieldName, value);
    }
  }

  protected initOrChangeConstructedField<K extends keyof T & keyof C>(fieldName: K, value: C[K], moduleName: string): void {
    if (this.instance == null) {
      this.initializeField(fieldName, value);
    } else {
      loadEsriModules<[{ new(p1: C[K]): T[K] }]>([moduleName]).then(([moduleCtor]) => {
        this.changeField(fieldName, new moduleCtor(value));
      });
    }
  }

  protected initializeField<K extends keyof C>(fieldName: K, value: C[K]): void {
    this._initializer[fieldName] = value;
  }

  protected changeField<K extends keyof T>(fieldName: K, value: T[K]): void {
    if (this._instance != null) {
      this._instance[fieldName] = value;
      if (isDependantChild(this)) {
        this.childChanged.emit();
      }
    }
  }
}

export type EsriEventedTypes = __esri.Accessor | (__esri.Accessor & __esri.Evented) | __esri.MapView;
export class EsriEventedBase<T extends EsriEventedTypes, C> extends EsriComponentBase<T, C> {
  protected configureEsriEvents(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriEmitterBase) {
        v.init(this.instance);
      }
    });
  }
}
