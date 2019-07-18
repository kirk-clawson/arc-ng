import { Input } from '@angular/core';
import { VisualLayerConstructorTypes, VisualLayerTypes, VisualLayerViewTypes } from '../type-utils';
import { LayerBase } from './layer-base';

export abstract class VisualLayerBase<T extends VisualLayerTypes, V extends VisualLayerViewTypes, C extends VisualLayerConstructorTypes>
  extends LayerBase<T, V, C> {
  @Input()
  set maxScale(value: number) {
    if (this.instance == null) {
      this.initializeField('maxScale', value);
    } else {
      this.changeField('maxScale', value);
    }
  }
  @Input()
  set minScale(value: number) {
    if (this.instance == null) {
      this.initializeField('minScale', value);
    } else {
      this.changeField('minScale', value);
    }
  }
}
