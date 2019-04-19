import { Directive, forwardRef, Input } from '@angular/core';
import { LayerComponentBase } from '../shared/component-bases';
import { loadModules } from '../shared/utils';

@Directive({
  selector: 'arcng-feature-layer',
  providers: [{ provide: LayerComponentBase, useExisting: forwardRef(() => FeatureLayerDirective)}]
})
export class FeatureLayerDirective extends LayerComponentBase {

  @Input()
  set url(value: string) {
    this._url = value;
  }

  private _url: string;

  private instance: import ('esri/layers/FeatureLayer');

  async createLayer(): Promise<__esri.Layer> {
    type modules = [typeof import ('esri/layers/FeatureLayer')];
    const [ FeatureLayer ] = await loadModules<modules>(['esri/layers/FeatureLayer']);
    this.instance = new FeatureLayer({ url: this._url });
    return this.instance;
  }
}
