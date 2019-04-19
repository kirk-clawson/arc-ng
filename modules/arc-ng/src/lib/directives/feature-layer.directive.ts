import { Directive, Inject, Input, Optional } from '@angular/core';
import { LayerBase } from '../shared/component-bases';
import { MapComponent, MapToken } from '../components/map/map.component';
import { loadModules } from '../shared/utils';
import { GroupLayerComponent, GroupToken } from '../components/group-layer/group-layer.component';

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

  constructor(@Inject(MapToken) map: MapComponent, @Optional() @Inject(GroupToken) private group: GroupLayerComponent) {
    super(map);
  }

  protected async afterMapViewReady(view: __esri.MapView) {
    type modules = [typeof import ('esri/layers/FeatureLayer')];
    try {
      const [ FeatureLayer ] = await loadModules<modules>(['esri/layers/FeatureLayer']);
      this.instance = new FeatureLayer({ url: this._url });
      if (this.group == null) {
        view.map.add(this.instance);
      } else {
        await this.group.initWithLayer(this.instance, view);
      }
    } catch (e) {
      console.error('There was an error Initializing the Feature Layer.', e);
    }
  }
}
