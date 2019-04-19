import { Component, forwardRef, Inject, InjectionToken, Input } from '@angular/core';
import { IconClass, UIPosition, WidgetMode } from '../../shared/enums';
import { createCtorParameterObject, loadModules } from '../../shared/utils';
import { WidgetBase } from '../../shared/component-bases';
import { MapComponent, MapToken } from '../map/map.component';

export const ExpandToken = new InjectionToken<ExpandComponent>('expand-component');

@Component({
  selector: 'arcng-expand',
  template: '<ng-content></ng-content>',
  providers: [{ provide: ExpandToken, useExisting: forwardRef(() => ExpandComponent)}]
})
export class ExpandComponent extends WidgetBase {
  @Input()
  set autoCollapse(value: boolean) {
    this._autoCollapse = value;
  }
  @Input()
  set collapseIconClass(value: IconClass) {
    this._collapseIconClass = value;
  }
  @Input()
  set collapseTooltip(value: string) {
    this._collapseTooltip = value;
  }
  @Input()
  set expanded(value: boolean) {
    this._expanded = value;
  }
  @Input()
  set expandIconClass(value: IconClass) {
    this._expandIconClass = value;
  }
  @Input()
  set expandTooltip(value: string) {
    this._expandTooltip = value;
  }
  @Input()
  set group(value: string) {
    this._group = value;
  }
  @Input()
  set iconNumber(value: number) {
    this._iconNumber = value;
  }
  @Input()
  set mode(value: WidgetMode) {
    this._mode = value;
  }
  @Input()
  set index(value: number) {
    this.__index = value;
  }
  @Input()
  set position(value: UIPosition) {
    this.__position = value;
  }

  private instance: import ('esri/widgets/Expand');

  private _autoCollapse: boolean;
  private _collapseIconClass: IconClass;
  private _collapseTooltip: string;
  private _expanded: boolean;
  private _expandIconClass: IconClass;
  private _expandTooltip: string;
  private _group: string;
  private _iconNumber: number;
  private _mode: WidgetMode;

  constructor(@Inject(MapToken) map: MapComponent) {
    super(map);
  }

  async initWithWidget<T extends __esri.Widget>(child: T, view: __esri.MapView) {
    type modules = [typeof import ('esri/widgets/Expand')];
    try {
      const [ Expand ] = await loadModules<modules>(['esri/widgets/Expand']);
      const params = createCtorParameterObject<__esri.ExpandProperties>(this);
      params.view = view;
      params.content = child;
      this.instance = new Expand(params);
      view.ui.add(this.instance, this.getPosition());
    } catch (e) {
      console.error('There was an error Initializing the Expand Widget.', e);
    }
  }

  protected async afterMapViewReady(view: __esri.MapView) {
    // do nothing
  }
}
