import { Input } from '@angular/core';
import { UIPosition } from '../enums';
import { EsriEventedBase } from './esri-component-base';

export abstract class WidgetBase<T extends __esri.Widget, C extends __esri.WidgetProperties> extends EsriEventedBase<T, C> {
  @Input()
  set id(value: string) {
    this.changeField('id', value);
  }
  @Input()
  set container(value: string | HTMLElement) {
    this.changeField('container', value);
  }
  @Input()
  set uiPosition(value: UIPosition) {
    this._uiPosition = value;
  }

  protected _uiPosition: UIPosition = UIPosition.Manual;
}

