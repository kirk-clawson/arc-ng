import { Directive, forwardRef } from '@angular/core';
import { WidgetComponentBase } from '../shared/widget-component-base';
import { loadEsriModules } from '../shared/utils';

@Directive({
  selector: 'arcng-layer-list',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => LayerListDirective)}]
})
export class LayerListDirective extends WidgetComponentBase<__esri.LayerList> {

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
