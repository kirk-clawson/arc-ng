import { Component, ContentChildren, forwardRef, Input, QueryList } from '@angular/core';
import { LayerComponentBase } from '../../shared/component-bases';
import { createCtorParameterObject, loadModules } from '../../shared/utils';

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
    const [ GroupLayer ] = await loadModules<modules>(['esri/layers/GroupLayer']);
    const realChildren = this.children.filter(c => c !== this);
    const params = createCtorParameterObject<__esri.GroupLayerProperties>(this);
    this.instance = new GroupLayer(params);
    await this.setupChildren(realChildren);
    return this.instance;
  }

  async setupChildren(layers: LayerComponentBase[]) {
    await Promise.all(layers.map(async l => {
      const layer = await l.createLayer();
      if (l.getIndex() == null) {
        this.instance.add(layer);
      } else {
        this.instance.add(layer, l.getIndex());
      }
    }));
  }
}
