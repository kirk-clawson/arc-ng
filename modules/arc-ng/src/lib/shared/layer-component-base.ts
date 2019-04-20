/* tslint:disable:variable-name */
import { Input } from '@angular/core';

export const layerBuilder = (parent: __esri.LayersMixin) => async (l: LayerComponentBase) => {
  const layer = await l.createLayer();
  if (l.index == null) {
    parent.add(layer);
  } else {
    parent.add(layer, l.index);
  }
};

export abstract class LayerComponentBase {

  get index(): number {
    return this.__index;
  }
  @Input()
  set index(value: number) {
    this.__index = value;
  }

  private __index?: number;

  async abstract createLayer(): Promise<__esri.Layer>;
}
