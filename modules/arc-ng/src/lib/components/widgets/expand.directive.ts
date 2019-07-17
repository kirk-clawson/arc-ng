import { Directive, Input, OnDestroy, Output, } from '@angular/core';
import { EsriEventedBase } from '../../shared/component-bases/esri-component-base';
import { WidgetMode } from '../../shared/enums';
import { EsriWatchEmitter } from '../../shared/esri-emitters';
import { IconClass } from '../../shared/esri-icons';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';

@Directive({
  selector: '[arcngExpand]'
})
export class ExpandDirective extends EsriEventedBase<__esri.Expand> implements OnDestroy {
  @Input()
  set autoCollapse(value: boolean) {
    this.changeField('autoCollapse', value);
  }
  @Input()
  set collapseIconClass(value: IconClass) {
    this.changeField('collapseIconClass', value);
  }
  @Input()
  set collapseTooltip(value: string) {
    this.changeField('collapseTooltip', value);
  }
  @Input()
  set expandIconClass(value: IconClass) {
    this.changeField('expandIconClass', value);
  }
  @Input()
  set expandTooltip(value: string) {
    this.changeField('expandTooltip', value);
  }
  @Input()
  set expandGroup(value: string) {
    this.changeField('group', value);
  }
  @Input()
  set iconNumber(value: number) {
    this.changeField('iconNumber', value);
  }
  @Input()
  set expandMode(value: WidgetMode) {
    this.changeField('mode', value);
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
    this.configureEsriEvents();
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
