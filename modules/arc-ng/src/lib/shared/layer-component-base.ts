/* tslint:disable:variable-name */
import { Input } from '@angular/core';
import { EsriComponentBase } from './esri-component-base';

export const layerBuilder = (parent: __esri.LayersMixin) => async (l: LayerComponentBase<__esri.Layer>) => {
  const layer = await l.createLayer();
  if (l.index == null) {
    parent.add(layer);
  } else {
    parent.add(layer, l.index);
  }
};

export abstract class LayerComponentBase<T extends __esri.Layer> extends EsriComponentBase<T> {

  get index(): number {
    return this.__index;
  }
  @Input()
  set index(value: number) {
    this.__index = value;
  }

  private __index?: number;

  async abstract createLayer(): Promise<T>;
}
