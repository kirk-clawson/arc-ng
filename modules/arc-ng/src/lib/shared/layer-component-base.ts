import { Input } from '@angular/core';
import { EsriEventedBase } from './esri-component-base';
import { LayerType, ListMode } from './enums';

export abstract class LayerComponentBase<T extends __esri.Layer> extends EsriEventedBase<T> {
  @Input()
  set id(value: string) {
    this.setField('id', value);
  }
  @Input()
  set listMode(value: ListMode) {
    this.setField('listMode', value);
  }
  @Input()
  set opacity(value: number) {
    this.setField('opacity', value);
  }
  @Input()
  set visible(value: boolean) {
    this.setField('visible', value);
  }

  abstract layerType: LayerType;
}
