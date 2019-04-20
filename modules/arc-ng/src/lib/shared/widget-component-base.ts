/* tslint:disable:variable-name */
import { UIPosition } from './enums';
import { Input } from '@angular/core';

export const widgetBuilder = (view: __esri.MapView) => async (w: WidgetComponentBase) => {
  const widget = await w.createWidget(view);
  view.ui.add(widget, w.getPosition());
  w.isAttached = true;
};

export abstract class WidgetComponentBase {

  @Input()
  set index(value: number) {
    this.__index = value;
  }

  @Input()
  set position(value: UIPosition) {
    this.__position = value;
  }

  protected __index?: number;
  protected __position: UIPosition = UIPosition.Manual;

  isAttached = false;

  async abstract createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Widget>;

  getPosition(): string | __esri.UIAddPosition {
    return this.__index == null ? this.__position : { position: this.__position, index: this.__index };
  }
}

