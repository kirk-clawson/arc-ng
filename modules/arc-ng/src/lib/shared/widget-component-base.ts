/* tslint:disable:variable-name */
import { UIPosition } from './enums';
import { Input } from '@angular/core';
import { EsriWatchEmitter } from './esri-watch-emitter';

export const widgetBuilder = (view: __esri.MapView) => async <T extends __esri.Accessor>(w: WidgetComponentBase<T>) => {
  const widget = await w.createWidget(view);
  view.ui.add(widget, w.getPosition());
  w.isAttached = true;
};

export abstract class WidgetComponentBase<T extends __esri.Accessor> {
  @Input()
  set widgetId(value: string) {
    this._id = value;
  }
  @Input()
  set container(value: string | HTMLElement) {
    this._container = value;
  }
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
  protected _container: string | HTMLElement;
  protected _id: string;

  isAttached = false;
  protected instance: T;

  async abstract createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Widget>;

  getPosition(): string | __esri.UIAddPosition {
    return this.__index == null ? this.__position : { position: this.__position, index: this.__index };
  }

  protected setField<K extends keyof T>(fieldName: K, value: T[K]): void {
    const localField = '_' + fieldName;
    if (this[localField] !== value) {
      this[localField] = value;
      if (this.instance != null) this.instance[fieldName] = value;
    }
  }

  protected createWatchedHandlers(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriWatchEmitter) {
        v.init(this.instance);
      }
    });
  }
}

