import { Directive, Inject, Input } from '@angular/core';
import { LayerBase } from '../shared/component-bases';
import { MapComponent, MapComponentToken } from '../components/map/map.component';
import { loadModules } from '../shared/utils';

@Directive({
  selector: 'arcng-feature-layer'
})
export class FeatureLayerDirective extends LayerBase {

  @Input()
  set url(value: string) {
    this._url = value;
  }

  private _url: string;

  private instance: import ('esri/layers/FeatureLayer');

  constructor(@Inject(MapComponentToken) map: MapComponent) {
    super(map);
  }

  protected async afterMapViewReady(view: __esri.MapView) {
    type modules = [typeof import ('esri/layers/FeatureLayer')];
    try {
      const [ FeatureLayer ] = await loadModules<modules>(['esri/layers/FeatureLayer']);
      this.instance = new FeatureLayer({ url: this._url });
      view.map.add(this.instance);
    } catch (e) {
      console.error('There was an error Initializing the Basemap Gallery.', e);
    }
  }

}
