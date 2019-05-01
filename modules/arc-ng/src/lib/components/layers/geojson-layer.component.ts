import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { FeatureishLayerBase } from '../../shared/component-bases/featureish-layer-base';
import { LayerBase } from '../../shared/component-bases/layer-base';
import { LayerType } from '../../shared/enums';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';

@Component({
  selector: 'geo-json-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerBase, useExisting: forwardRef(() => GeoJSONLayerComponent)}]
})
export class GeoJSONLayerComponent
  extends FeatureishLayerBase<__esri.GeoJSONLayer, __esri.GeoJSONLayerView>
  implements OnInit {

  @Input()
  set legendEnabled(value: boolean) {
    this.setField('legendEnabled', value);
  }
  @Input()
  set url(value: string) {
    this.setField('url', value);
  }

  layerType: LayerType = LayerType.GeoJSONLayer;

  constructor(dispatcher: ActionDispatcherService) {
    super(dispatcher);
  }

  async ngOnInit() {
    type modules = [typeof import ('esri/layers/GeoJSONLayer')];
    const [ GeoJsonLayer ] = await loadEsriModules<modules>(['esri/layers/GeoJSONLayer']);
    const params = createCtorParameterObject<__esri.FeatureLayerProperties>(this);
    this.instance = new GeoJsonLayer(params);
    this.configureEventEmitters();
    this.configureWatchEmitters();
  }
}
