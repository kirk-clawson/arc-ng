/* tslint:disable:variable-name */
import { EsriWatchEmitter } from './esri-watch-emitter';
import { EsriEventEmitter } from './esri-event-emitter';
import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EsriAutoCast } from './type-utils';

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

  protected setField<K extends keyof T>(fieldName: K, value: T[K]): void {
    const localField = '_' + fieldName;
    if (this[localField] !== value) {
      this[localField] = value;
      if (this.__instance != null) this.__instance[fieldName] = value;
    }
  }

  protected setAutoCastField<K extends keyof T>(fieldName: K, value: EsriAutoCast<T[K]>): void;
  protected setAutoCastField<K extends keyof T>(fieldName: K, value: any, constructionOnly: true): void;
  protected setAutoCastField<K extends keyof T>(fieldName: K, value: EsriAutoCast<T[K]> | any, constructionOnly?: boolean): void {
    const localField = '_' + fieldName;
    if (this[localField] !== value) {
      this[localField] = value;
      if (this.__instance != null) {
        if (constructionOnly === true) throw new Error(`'${fieldName} cannot be set after the object ahs been constructed`);
        this.__instance[fieldName] = value as any;
      }
    }
  }
}

export class EsriAccessorBase<T extends __esri.Accessor> extends EsriComponentBase<T> {
  protected configureWatchEmitters(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriWatchEmitter) {
        v.init(this.instance);
      }
    });
  }
}

export abstract class EsriEventedBase<T extends __esri.Evented & __esri.Accessor> extends EsriAccessorBase<T> {
  protected configureEventEmitters(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriEventEmitter) {
        v.init(this.instance);
      }
    });
  }
}
