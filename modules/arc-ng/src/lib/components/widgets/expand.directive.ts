import { Directive, Input, OnDestroy, Output, } from '@angular/core';
import { EsriAccessorBase } from '../../shared/component-bases/esri-component-base';
import { WidgetMode } from '../../shared/enums';
import { IconClass } from '../../shared/esri-icons';
import { EsriWatchEmitter } from '../../shared/esri-watch-emitter';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';

@Directive({
  selector: '[arcngExpand]'
})
export class ExpandDirective extends EsriAccessorBase<__esri.Expand> implements OnDestroy {
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
  set expandGroup(value: string) {
    this.setField('group', value);
  }
  @Input()
  set iconNumber(value: number) {
    this.setField('iconNumber', value);
  }
  @Input()
  set expandMode(value: WidgetMode) {
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

  ngOnDestroy(): void {
    this.instance.destroy();
  }

  async createInstance(view: __esri.MapViewProperties | __esri.SceneViewProperties,
                       content: __esri.WidgetProperties,
                       container?: string | HTMLElement) {
    type modules = [typeof import ('esri/widgets/Expand')];
    const [ Expand ] = await loadEsriModules<modules>(['esri/widgets/Expand']);

    const params = createCtorParameterObject<__esri.ExpandProperties>(this);
    params.view = view;
    params.content = content;
    params.id = `${content.id}-expander`;
    if (container != null) params.container = container;
    this.instance = new Expand(params);
    this.configureWatchEmitters();
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
