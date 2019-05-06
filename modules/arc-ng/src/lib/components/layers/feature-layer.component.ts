import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { FeatureishLayerBase } from '../../shared/component-bases/featureish-layer-base';
import { LayerBase } from '../../shared/component-bases/layer-base';
import { LayerType } from '../../shared/enums';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';

@Component({
  selector: 'feature-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerBase, useExisting: forwardRef(() => FeatureLayerComponent)}]
})
export class FeatureLayerComponent
  extends FeatureishLayerBase<__esri.FeatureLayer, __esri.FeatureLayerView>
  implements OnInit {

  @Input()
  set layerId(value: number) {
    this.setField('layerId', value);
  }
  @Input()
  set legendEnabled(value: boolean) {
    this.setField('legendEnabled', value);
  }
  @Input()
  set outFields(value: string | string[]) {
    const items = Array.isArray(value) ? value : value.split(',');
    this.setField('outFields', items);
  }
  @Input()
  set portalId(value: string) {
    if (this.instance != null) {
      throw new Error(`You cannot ${this.portalSet ? 'change' : 'set'} the portalId value after the layer has been created.`);
    }
    this._portalId = value;
    this.portalSet = true;
  }
  @Input()
  set refreshInterval(value: number) {
    this.setField('refreshInterval', value);
  }
  @Input()
  set source(value: __esri.Graphic[]) {
    if (this.instance != null) {
      if (!this.sourceSet) {
        throw new Error(`You cannot change the source value after the layer has been created.`);
      } else {
        this.updateFeatures(value);
      }
    }
    this._source = value;
    this.sourceSet = true;
  }
  @Input()
  set url(value: string) {
    if (this.instance != null) {
      throw new Error(`You cannot ${this.urlSet ? 'change' : 'set'} the url value after the layer has been created.`);
    }
    this._url = value;
    this.urlSet = true;
  }

  private sourceSet = false;
  private portalSet = false;
  private urlSet = false;
  // noinspection JSMismatchedCollectionQueryUpdate
  private _source: __esri.Graphic[];
  private _portalId: string;
  private _url: string;

  private get isValid() { return (Number(this.sourceSet) + Number(this.portalSet) + Number(this.urlSet)) === 1; }
  layerType: LayerType = LayerType.FeatureLayer;

  constructor(dispatcher: ActionDispatcherService) {
    super(dispatcher);
  }

  async ngOnInit() {
    if (!this.isValid) throw new Error('A feature layer must have one and only one data source (url, portalId, or source)');

    type modules = [typeof import ('esri/layers/FeatureLayer')];
    const [ FeatureLayer ] = await loadEsriModules<modules>(['esri/layers/FeatureLayer']);
    const params = createCtorParameterObject<__esri.FeatureLayerProperties>(this);
    this.instance = new FeatureLayer(params);
    this.configureEsriEvents();
  }

  private updateFeatures(features: __esri.Graphic[]): void {
    const oid = this.instance.objectIdField;
    this.instance.queryFeatures().then(featureSet => {
      const currentGraphics: __esri.Graphic[] = featureSet.features;
      const currentGraphicIds = new Set<string>(currentGraphics.map(g => g.attributes[oid].toString()));
      const newGraphicIds = new Set<string>(features.map(g => g.attributes[oid].toString()));
      const adds = features.filter(g => !currentGraphicIds.has(g.attributes[oid].toString()));
      const deletes = currentGraphics.filter(g => !newGraphicIds.has(g.attributes[oid]));
      const updates = features.filter(g => currentGraphicIds.has(g.attributes[oid].toString()));
      const edits: __esri.FeatureLayerApplyEditsEdits = {};
      if (adds.length > 0) edits.addFeatures = adds;
      if (deletes.length > 0) edits.deleteFeatures = deletes;
      if (updates.length > 0) edits.updateFeatures = updates;
      if (edits.hasOwnProperty('addFeatures') || edits.hasOwnProperty('deleteFeatures') || edits.hasOwnProperty('updateFeatures')) {
        this.instance.applyEdits(edits);
      }
    });
  }
}
