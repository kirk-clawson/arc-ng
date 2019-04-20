import { Directive, forwardRef, Input } from '@angular/core';
import { createCtorParameterObject, loadEsriModules } from '../shared/utils';
import { LayerComponentBase } from '../shared/layer-component-base';

@Directive({
  selector: 'arcng-feature-layer',
  providers: [{ provide: LayerComponentBase, useExisting: forwardRef(() => FeatureLayerDirective)}]
})
export class FeatureLayerDirective extends LayerComponentBase<__esri.FeatureLayer> {

  @Input()
  set url(value: string) {
    this.setField('url', value);
  }

  async createLayer(): Promise<__esri.FeatureLayer> {
    type modules = [typeof import ('esri/layers/FeatureLayer')];
    const [ FeatureLayer ] = await loadEsriModules<modules>(['esri/layers/FeatureLayer']);
    const params = createCtorParameterObject(this);
    this.instance = new FeatureLayer(params);
    return this.instance;
  }
}
