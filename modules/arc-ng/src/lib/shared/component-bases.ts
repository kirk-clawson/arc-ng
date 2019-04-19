/* tslint:disable:variable-name */
import { UIPosition } from './enums';

export abstract class WidgetComponentBase {

  isAttached = false;

  protected __index?: number;
  protected __position: UIPosition = UIPosition.Manual;

  async abstract createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Widget>;

  getPosition(): string | __esri.UIAddPosition {
    return this.__index == null ? this.__position : { position: this.__position, index: this.__index };
  }
}

export abstract class LayerComponentBase {

  protected __index?: number;

  async abstract createLayer(): Promise<__esri.Layer>;

  getIndex(): number | null {
    return this.__index;
  }
}
