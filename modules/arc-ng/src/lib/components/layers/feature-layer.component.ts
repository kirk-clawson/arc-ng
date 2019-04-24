import { AfterContentInit, Component, ContentChildren, forwardRef, Input, OnDestroy, OnInit, Output, QueryList } from '@angular/core';
import { createCtorParameterObject, groupBy, loadEsriModules } from '../../shared/utils';
import { LayerComponentBase } from '../../shared/layer-component-base';
import { LayerType } from '../../shared/enums';
import { LabelClassComponent } from './support/label-class.component';
import { loadAsyncChildren } from '../../shared/esri-component-base';
import { Subject } from 'rxjs';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { filter, takeUntil } from 'rxjs/operators';
import { ActionDirective } from '../support/action.directive';
import { EsriEventEmitter } from '../../shared/esri-event-emitter';

export interface FeatureLayerViewEvent {
  view: __esri.View;
  layerView: __esri.FeatureLayerView;
}

@Component({
  selector: 'feature-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerComponentBase, useExisting: forwardRef(() => FeatureLayerComponent)}]
})
export class FeatureLayerComponent extends LayerComponentBase<__esri.FeatureLayer> implements OnInit, AfterContentInit, OnDestroy {

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
        throw new Error(`You cannot 'set' the source value after the layer has been created.`);
      } else {
        this.updateFeatures(value);
      }
    }
    this._source = value;
    this.sourceSet = true;
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
    if (this.instance != null) {
      throw new Error(`You cannot ${this.urlSet ? 'change' : 'set'} the url value after the layer has been created.`);
    }
    this._url = value;
    this.urlSet = true;
  }

  @Output() layerViewCreated = new EsriEventEmitter<FeatureLayerViewEvent>('layerview-create');
  @Output() layerViewDestroyed = new EsriEventEmitter<FeatureLayerViewEvent>('layerview-destroyed');

  private sourceSet = false;
  private portalSet = false;
  private urlSet = false;
  // noinspection JSMismatchedCollectionQueryUpdate
  private _source: __esri.Graphic[];
  private _portalId: string;
  private _url: string;
  private destroyed$ = new Subject();

  private get isValid() { return (Number(this.sourceSet) + Number(this.portalSet) + Number(this.urlSet)) === 1; }
  layerType: LayerType = LayerType.FeatureLayer;

  @ContentChildren(LabelClassComponent) labelChildren: QueryList<LabelClassComponent>;
  @ContentChildren(ActionDirective) actions: QueryList<ActionDirective>;

  constructor(private dispatcher: ActionDispatcherService) {
    super();
  }

  ngOnInit(): void {
    this.dispatcher.updateListItem$.pipe(
      filter(li => li.layer === this.instance),
      takeUntil(this.destroyed$)
    ).subscribe(li => this.createListItem(li));
  }

  ngAfterContentInit() {
    this.labelChildren.changes.pipe(
      filter(() => this.instance != null),
      takeUntil(this.destroyed$)
    ).subscribe(async (labels: LabelClassComponent[]) => {
      this.instance.labelingInfo = [];
      for (const labelComp of labels) {
        this.instance.labelingInfo.push(await labelComp.createInstance());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  async createInstance(): Promise<__esri.FeatureLayer> {
    if (this.instance != null) return this.instance;

    if (!this.isValid) return Promise.reject('A feature layer must have one and only one data source (url, portalId, or source)');

    type modules = [typeof import ('esri/layers/FeatureLayer')];
    const [ FeatureLayer ] = await loadEsriModules<modules>(['esri/layers/FeatureLayer']);

    const params = createCtorParameterObject<__esri.FeatureLayerProperties>(this);
    if (this.labelChildren.length > 0) {
      params.labelingInfo = await loadAsyncChildren(this.labelChildren.toArray());
    }
    this.instance = new FeatureLayer(params);
    this.instance.when(() => this.createSubscribedHandlers());
    this.layerCreated.emit(this.instance);
    return this.instance;
  }

  private createListItem(item: __esri.ListItem): void {
    const groups = groupBy(this.actions.toArray(), 'sectionNumber');
    const groupKeys: number[] = Array.from(groups.keys());
    groupKeys.sort();
    const result = [];
    for (const key of groupKeys) {
      const currentActions = groups.get(key);
      currentActions.sort((a, b) => a.sortOrder - b.sortOrder);
      result.push(currentActions.map(a => a.createInstance()));
    }
    item.actionsSections = result as any;
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
