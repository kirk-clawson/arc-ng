import { AfterContentInit, Component, ContentChildren, forwardRef, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { layerBuilder, LayerComponentBase } from '../../shared/layer-component-base';
import { LayerType } from '../../shared/enums';
import { EsriEventEmitter } from '../../shared/esri-event-emitter';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

export interface GroupLayerViewEvent {
  view: __esri.View;
  layerView: __esri.LayerView;
}

export type groupVisibilityMode = 'independent' | 'inherited' | 'exclusive';

@Component({
  selector: 'group-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerComponentBase, useExisting: forwardRef(() => GroupLayerComponent)}]
})
export class GroupLayerComponent extends LayerComponentBase<__esri.GroupLayer> implements AfterContentInit, OnDestroy {
  @Input()
  set title(value: string) {
    this.setField('title', value);
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
  set visibilityMode(value: groupVisibilityMode) {
    this.setField('visibilityMode', value);
  }

  @Output() layerViewCreated = new EsriEventEmitter<GroupLayerViewEvent>('layerview-create');
  @Output() layerViewDestroyed = new EsriEventEmitter<GroupLayerViewEvent>('layerview-destroyed');

  private _portalId: string;
  private portalSet = false;
  private destroyed$ = new Subject();

  layerType: LayerType = LayerType.GroupLayer;

  @ContentChildren(LayerComponentBase) children: QueryList<LayerComponentBase<__esri.Layer>>;

  ngAfterContentInit(): void {
    this.children.changes.pipe(
      filter(() => this.instance != null),
      map((children: LayerComponentBase<__esri.Layer>[]) => children.filter(c => c !== this)),
      takeUntil(this.destroyed$)
    ).subscribe(async children => {
      this.instance.removeAll();
      await this.setupChildren(children);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  async createInstance(): Promise<__esri.GroupLayer> {
    if (this.instance != null) return this.instance;

    const realChildren = this.children.filter(c => c !== this);
    if (realChildren.length > 0 && this.portalSet) {
      throw new Error('A Group Layer may be loaded from a Portal Item, or have bespoke layers, but not both.');
    }

    type modules = [typeof import ('esri/layers/GroupLayer')];
    const [ GroupLayer ] = await loadEsriModules<modules>(['esri/layers/GroupLayer']);

    const params = createCtorParameterObject<__esri.GroupLayerProperties>(this);
    this.instance = new GroupLayer(params);
    this.instance.when(() => this.createSubscribedHandlers());
    this.layerCreated.emit(this.instance);
    await this.setupChildren(realChildren);
    return this.instance;
  }

  async setupChildren(layers: LayerComponentBase<__esri.Layer>[]) {
    await Promise.all(layers.map(layerBuilder(this.instance)));
  }
}
