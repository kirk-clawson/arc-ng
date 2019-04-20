import { Component, ContentChildren, forwardRef, Input, QueryList } from '@angular/core';
import { IconClass, WidgetMode } from '../../shared/enums';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { WidgetComponentBase } from '../../shared/widget-component-base';

@Component({
  selector: 'arcng-expand',
  template: '<ng-content></ng-content>',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => ExpandComponent)}]
})
export class ExpandComponent extends WidgetComponentBase {
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

  @ContentChildren(WidgetComponentBase) children: QueryList<WidgetComponentBase>;

  async createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Widget> {
    type modules = [typeof import ('esri/widgets/Expand')];
    const [ Expand ] = await loadEsriModules<modules>(['esri/widgets/Expand']);
    if (this.children.filter(c => c !== this).length > 1) throw Error('An Expand widget can only display one child widget.');
    const child = this.children.filter(c => c !== this)[0];
    const params = createCtorParameterObject<__esri.ExpandProperties>(this);
    params.view = view;
    params.content = await child.createWidget(view, true);
    this.instance = new Expand(params);
    child.isAttached = true;
    return this.instance;
  }
}
