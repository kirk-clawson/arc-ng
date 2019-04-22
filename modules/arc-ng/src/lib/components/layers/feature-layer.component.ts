import { AfterContentInit, Component, ContentChildren, forwardRef, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { createCtorParameterObject, groupBy, loadEsriModules } from '../../shared/utils';
import { LayerComponentBase } from '../../shared/layer-component-base';
import { LayerType } from '../../shared/enums';
import { LabelClassComponent } from './support/label-class.component';
import { loadAsyncChildren } from '../../shared/esri-component-base';
import { Subject } from 'rxjs';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { filter, takeUntil } from 'rxjs/operators';
import { ActionDirective } from '../support/action.directive';

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
  private isValid = true;
  private destroyed$ = new Subject();
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

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngAfterContentInit(): void {
    let sources = 0;
    if (this._url != null) ++sources;
    if (this._portalId != null) ++sources;
    if (this._source != null) ++sources;
    if (sources === 0 || sources > 1) {
      this.isValid = false;
      throw new Error('A feature layer must have one and only one data source (url, portalId, or source)');
    }
  }

  async createInstance(): Promise<__esri.FeatureLayer> {
    type modules = [typeof import ('esri/layers/FeatureLayer')];
    if (!this.isValid) return Promise.reject('Invalid Feature Layer');
    const [ FeatureLayer ] = await loadEsriModules<modules>(['esri/layers/FeatureLayer']);
    const params = createCtorParameterObject<__esri.FeatureLayerProperties>(this);
    if (this.labelChildren.length > 0) {
      params.labelingInfo = await loadAsyncChildren(this.labelChildren.toArray());
    }
    this.instance = new FeatureLayer(params);
    this.instanceCreated.emit(this.instance);
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
}
