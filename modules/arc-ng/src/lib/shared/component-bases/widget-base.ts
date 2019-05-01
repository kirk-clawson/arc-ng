/* tslint:disable:variable-name */
import { Input } from '@angular/core';
import { UIPosition } from '../enums';
import { EsriAccessorBase } from './esri-component-base';

export abstract class WidgetBase<T extends __esri.Widget> extends EsriAccessorBase<T> {
  @Input()
  set id(value: string) {
    this.setField('id', value);
  }
  @Input()
  set container(value: string | HTMLElement) {
    this.setField('container', value);
  }
  @Input()
  set uiPosition(value: UIPosition) {
    this.__uiPosition = value;
  }

  protected __uiPosition: UIPosition = UIPosition.Manual;
}
