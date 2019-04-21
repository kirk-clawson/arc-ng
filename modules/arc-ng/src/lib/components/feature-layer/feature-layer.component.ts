import { Component, ContentChildren, forwardRef, Input, QueryList } from '@angular/core';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { LayerComponentBase } from '../../shared/layer-component-base';
import { LayerType } from '../../shared/enums';
import { LabelClassComponent } from '../label-class/label-class.component';
import { loadAsyncChildren } from '../../shared/esri-component-base';

@Component({
  selector: 'feature-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerComponentBase, useExisting: forwardRef(() => FeatureLayerComponent)}]
})
export class FeatureLayerComponent extends LayerComponentBase<__esri.FeatureLayer> {

  @Input()
  set copyright(value: string) {
    this.setField('copyright', value);
  }
  @Input()
  set definitionExpression(value: string) {
    this.setField('definitionExpression', value);
  }
  @Input()
  set labelsVisible(value: boolean) {
    this.setField('labelsVisible', value);
  }
  @Input()
  set layerId(value: number) {
    this.setField('layerId', value);
  }
  @Input()
  set legendEnabled(value: boolean) {
    this.setField('legendEnabled', value);
  }
  @Input()
  set maxScale(value: number) {
    this.setField('maxScale', value);
  }
  @Input()
  set minScale(value: number) {
    this.setField('minScale', value);
  }
  @Input()
  set objectIdField(value: string) {
    this.setField('objectIdField', value);
  }
  @Input()
  set outFields(value: string | string[]) {
    const items = Array.isArray(value) ? value : value.split(',');
    this.setField('outFields', items);
  }
  @Input()
  set popupEnabled(value: boolean) {
    this.setField('popupEnabled', value);
  }
  @Input()
  set portalId(value: string) {
    this._portalId = value;
  }
  @Input()
  set refreshInterval(value: number) {
    this.setField('refreshInterval', value);
  }
  @Input()
  set source(value: __esri.Graphic[]) {
    this._source = value;
  }
  @Input()
  set spatialReference(value: __esri.SpatialReference) {
    this.setField('spatialReference', value);
  }
  @Input()
  set title(value: string) {
    this.setField('title', value);
  }
  @Input()
  set url(value: string) {
    this._url = value;
  }

  private _portalId: string;
  // noinspection JSMismatchedCollectionQueryUpdate
  private _source: __esri.Graphic[];
  private _url: string;
  layerType: LayerType = LayerType.FeatureLayer;

  @ContentChildren(LabelClassComponent) labelChildren: QueryList<LabelClassComponent>;

  async createInstance(): Promise<__esri.FeatureLayer> {
    type modules = [typeof import ('esri/layers/FeatureLayer')];
    const [ FeatureLayer ] = await loadEsriModules<modules>(['esri/layers/FeatureLayer']);
    const params = createCtorParameterObject<__esri.FeatureLayerProperties>(this);
    if (this.labelChildren.length > 0) {
      params.labelingInfo = await loadAsyncChildren(this.labelChildren.toArray());
    }
    this.instance = new FeatureLayer(params);
    return this.instance;
  }
}
