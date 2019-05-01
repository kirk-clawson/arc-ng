import { Input } from '@angular/core';
import { VisualLayerTypes } from '../type-utils';
import { LayerBase } from './layer-base';

export abstract class VisualLayerBase<T extends VisualLayerTypes, V extends __esri.LayerView> extends LayerBase<T, V> {
  @Input()
  set maxScale(value: number) {
    this.setField('maxScale', value);
  }
  @Input()
  set minScale(value: number) {
    this.setField('minScale', value);
  }
}
