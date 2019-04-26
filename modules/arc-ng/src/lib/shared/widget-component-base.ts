/* tslint:disable:variable-name */
import { UIPosition } from './enums';
import { Input } from '@angular/core';
import { EsriAccessorBase } from './esri-component-base';

export abstract class WidgetComponentBase<T extends __esri.Widget> extends EsriAccessorBase<T> {
  @Input()
  set id(value: string) {
    this.setField('id', value);
  }
  @Input()
  set container(value: string | HTMLElement) {
    this.setField('container', value);
  }
  @Input()
  set uiIndex(value: number) {
    this.__index = value;
  }
  @Input()
  set uiPosition(value: UIPosition) {
    this.__position = value;
  }

  protected __index?: number;
  protected __position: UIPosition = UIPosition.Manual;

  getPosition(): string | __esri.UIAddPosition {
    return this.__index == null ? this.__position : { position: this.__position, index: this.__index };
  }
}

