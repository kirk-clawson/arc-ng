import { EventEmitter } from '@angular/core';

export interface DependantChildComponent {
  childChanged: EventEmitter<void>;
}

export interface EsriCloneable<T> {
  clone(): T;
}
