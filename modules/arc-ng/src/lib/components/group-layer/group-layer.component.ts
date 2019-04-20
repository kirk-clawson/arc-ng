import { Component, ContentChildren, forwardRef, Input, QueryList } from '@angular/core';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { layerBuilder, LayerComponentBase } from '../../shared/layer-component-base';

@Component({
  selector: 'arcng-group-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerComponentBase, useExisting: forwardRef(() => GroupLayerComponent)}]
})
export class GroupLayerComponent extends LayerComponentBase<__esri.GroupLayer> {
  @Input()
  set title(value: string) {
    this.setField('title', value);
  }

  @ContentChildren(LayerComponentBase) children: QueryList<LayerComponentBase<__esri.Layer>>;

  async createLayer(): Promise<__esri.GroupLayer> {
    type modules = [typeof import ('esri/layers/GroupLayer')];
    const [ GroupLayer ] = await loadEsriModules<modules>(['esri/layers/GroupLayer']);
    const realChildren = this.children.filter(c => c !== this);
    const params = createCtorParameterObject<__esri.GroupLayerProperties>(this);
    this.instance = new GroupLayer(params);
    await this.setupChildren(realChildren);
    return this.instance;
  }

  async setupChildren(layers: LayerComponentBase<__esri.Layer>[]) {
    await Promise.all(layers.map(layerBuilder(this.instance)));
  }
}
