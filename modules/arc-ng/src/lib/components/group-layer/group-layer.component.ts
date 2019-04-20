import { Component, ContentChildren, forwardRef, Input, QueryList } from '@angular/core';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { layerBuilder, LayerComponentBase } from '../../shared/layer-component-base';

@Component({
  selector: 'arcng-group-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerComponentBase, useExisting: forwardRef(() => GroupLayerComponent)}]
})
export class GroupLayerComponent extends LayerComponentBase {
  @Input()
  set title(value: string) {
    this._title = value;
  }

  private _title: string;

  private instance: import ('esri/layers/GroupLayer');

  @ContentChildren(LayerComponentBase) children: QueryList<LayerComponentBase>;

  async createLayer(): Promise<__esri.Layer> {
    type modules = [typeof import ('esri/layers/GroupLayer')];
    const [ GroupLayer ] = await loadEsriModules<modules>(['esri/layers/GroupLayer']);
    const realChildren = this.children.filter(c => c !== this);
    const params = createCtorParameterObject<__esri.GroupLayerProperties>(this);
    this.instance = new GroupLayer(params);
    await this.setupChildren(realChildren);
    return this.instance;
  }

  async setupChildren(layers: LayerComponentBase[]) {
    await Promise.all(layers.map(layerBuilder(this.instance)));
  }
}
