/* tslint:disable:variable-name */
import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EsriEmitterBase } from '../esri-emitter-base';
import { EsriAutoCast, isDependantChild } from '../type-utils';

export class EsriComponentBase<T> {
  get instance(): T {
    return this.__instance;
  }
  set instance(value: T) {
    this.__instance = value;
    this.instanceCreated.emit(value);
  }
  private __instance: T;

  instanceCreated = new EventEmitter<T>();

  getInstance$(): Observable<T> {
    if (this.__instance != null) {
      return of(this.__instance);
    } else {
      return this.instanceCreated;
    }
  }

  replaceInstance(newInstance: T) {
    this.__instance = newInstance;
  }

  protected setField<K extends keyof T>(fieldName: K, value: T[K]): void {
    const localField = '_' + fieldName;
    if (this[localField] !== value) {
      this[localField] = value;
      if (this.__instance != null) {
        this.__instance[fieldName] = value;
        if (isDependantChild(this)) {
          this.childChanged.emit();
        }
      }
    }
  }

  protected setAutoCastField<K extends keyof T>(fieldName: K, value: EsriAutoCast<T[K]>): void;
  protected setAutoCastField<K extends keyof T>(fieldName: K, value: any, constructionOnly: true): void;
  protected setAutoCastField<K extends keyof T>(fieldName: K, value: EsriAutoCast<T[K]> | any, constructionOnly?: boolean): void {
    const localField = '_' + fieldName;
    if (this[localField] !== value) {
      this[localField] = value;
      if (this.__instance != null) {
        if (constructionOnly === true) throw new Error(`'${fieldName} cannot be set after the object has been constructed`);
        this.__instance[fieldName] = value;
        if (isDependantChild(this)) {
          this.childChanged.emit();
        }
      }
    }
  }
}

export type EsriEventedTypes = __esri.Accessor | (__esri.Accessor & __esri.Evented) | __esri.MapView;
export class EsriEventedBase<T extends EsriEventedTypes> extends EsriComponentBase<T> {
  protected configureEsriEvents(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriEmitterBase) {
        v.init(this.instance);
      }
    });
  }
}
