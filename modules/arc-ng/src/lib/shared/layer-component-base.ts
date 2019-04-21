/* tslint:disable:variable-name */
import { Input } from '@angular/core';
import { EsriAsyncComponentBase } from './esri-component-base';
import { LayerType, ListMode } from './enums';

export const layerBuilder = (parent: __esri.LayersMixin) => async (l: LayerComponentBase<__esri.Layer>) => {
  const layer = await l.createInstance();
  if (l.listIndex == null) {
    parent.add(layer);
  } else {
    parent.add(layer, l.listIndex);
  }
};

export abstract class LayerComponentBase<T extends __esri.Layer> extends EsriAsyncComponentBase<T> {

  @Input()
  set LayerUniqueId(value: string) {
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

  get listIndex(): number {
    return this.__listIndex;
  }
  @Input()
  set listIndex(value: number) {
    this.__listIndex = value;
  }

  private __listIndex?: number;

  abstract layerType: LayerType;
}
