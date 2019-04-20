import { Directive, forwardRef, Input } from '@angular/core';
import { WidgetComponentBase } from '../shared/component-bases';
import { UIPosition } from '../shared/enums';
import { loadEsriModules } from '../shared/utils';

@Directive({
  selector: 'arcng-layer-list',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => LayerListDirective)}]
})
export class LayerListDirective extends WidgetComponentBase {
  @Input()
  set index(value: number) {
    this.__index = value;
  }

  @Input()
  set position(value: UIPosition) {
    this.__position = value;
  }

  private instance: import ('esri/widgets/LayerList');

  async createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Widget> {
    type modules = [typeof import ('esri/widgets/LayerList')];
    const [ LayerListWidget ] = await loadEsriModules<modules>(['esri/widgets/LayerList']);
    const params: __esri.LayerListProperties = { view };
    if (isHidden) {
      params.container = document.createElement('div');
    }
    this.instance = new LayerListWidget(params);
    return this.instance;
  }
}
