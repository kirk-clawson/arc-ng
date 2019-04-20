import { Component, ContentChildren, forwardRef, Input, Output, QueryList } from '@angular/core';
import { IconClass, WidgetMode } from '../../shared/enums';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { WidgetComponentBase } from '../../shared/widget-component-base';
import { EsriWatchEmitter } from '../../shared/esri-watch-emitter';

@Component({
  selector: 'arcng-expand',
  template: '<ng-content></ng-content>',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => ExpandComponent)}]
})
export class ExpandComponent extends WidgetComponentBase<__esri.Expand> {
  @Input()
  set autoCollapse(value: boolean) {
    this.setField('autoCollapse', value);
  }
  @Input()
  set collapseIconClass(value: IconClass) {
    this.setField('collapseIconClass', value);
  }
  @Input()
  set collapseTooltip(value: string) {
    this.setField('collapseTooltip', value);
  }
  @Input()
  set expandIconClass(value: IconClass) {
    this.setField('expandIconClass', value);
  }
  @Input()
  set expandTooltip(value: string) {
    this.setField('expandTooltip', value);
  }
  @Input()
  set group(value: string) {
    this.setField('group', value);
  }
  @Input()
  set iconNumber(value: number) {
    this.setField('iconNumber', value);
  }
  @Input()
  set mode(value: WidgetMode) {
    this.setField('mode', value);
  }

  @Input()
  set expanded(value: boolean) {
    if (this._expanded !== value) {
      this._expanded = value;
      this.handleStateChange(value);
    }
  }
  @Output() expandedChange = new EsriWatchEmitter<boolean>('expanded');

  private _expanded: boolean;

  @ContentChildren(WidgetComponentBase) children: QueryList<WidgetComponentBase<any>>;

  async createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Expand> {
    type modules = [typeof import ('esri/widgets/Expand')];
    const [ Expand ] = await loadEsriModules<modules>(['esri/widgets/Expand']);
    if (this.children.filter(c => c !== this).length > 1) throw Error('An Expand widget can only display one child widget.');
    const child = this.children.filter(c => c !== this)[0];
    const params = createCtorParameterObject<__esri.ExpandProperties>(this);
    params.view = view;
    params.content = await child.createWidget(view, true);
    this.instance = new Expand(params);
    this.createWatchedHandlers();
    child.isAttached = true;
    return this.instance;
  }

  private handleStateChange(isExpanded: boolean): void {
    if (this.instance != null) {
      if (isExpanded) {
        this.instance.expand();
      } else {
        this.instance.collapse();
      }
    }
  }
}
