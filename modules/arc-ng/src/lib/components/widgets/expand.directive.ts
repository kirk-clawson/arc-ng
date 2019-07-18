import { Directive, Input, OnDestroy, Output, } from '@angular/core';
import { EsriEventedBase } from '../../shared/component-bases/esri-component-base';
import { WidgetMode } from '../../shared/enums';
import { EsriWatchEmitter } from '../../shared/esri-emitters';
import { IconClass } from '../../shared/esri-icons';
import { loadEsriModules } from '../../shared/utils';

@Directive({
  selector: '[arcngExpand]'
})
export class ExpandDirective extends EsriEventedBase<__esri.Expand, __esri.ExpandProperties> implements OnDestroy {
  @Input()
  set autoCollapse(value: boolean) {
    this.initOrChangeValueField('autoCollapse', value);
  }
  @Input()
  set collapseIconClass(value: IconClass) {
    this.initOrChangeValueField('collapseIconClass', value);
  }
  @Input()
  set collapseTooltip(value: string) {
    this.initOrChangeValueField('collapseTooltip', value);
  }
  @Input()
  set expandIconClass(value: IconClass) {
    this.initOrChangeValueField('expandIconClass', value);
  }
  @Input()
  set expandTooltip(value: string) {
    this.initOrChangeValueField('expandTooltip', value);
  }
  @Input()
  set expandGroup(value: string) {
    this.initOrChangeValueField('group', value);
  }
  @Input()
  set iconNumber(value: number) {
    this.initOrChangeValueField('iconNumber', value);
  }
  @Input()
  set expandMode(value: WidgetMode) {
    this.initOrChangeValueField('mode', value);
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

    this.initializer.view = view;
    this.initializer.content = content;
    this.initializer.id = `${content.id}-expander`;
    if (container != null) this.initializer.container = container;
    this.instance = new Expand(this.initializer);
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
