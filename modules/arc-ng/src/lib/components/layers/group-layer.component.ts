import { AfterContentInit, Component, ContentChildren, forwardRef, Input, OnInit, Output, QueryList } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LayerType } from '../../shared/enums';
import { EsriEventEmitter } from '../../shared/esri-event-emitter';
import { LayerComponentBase } from '../../shared/layer-component-base';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';

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
export class GroupLayerComponent extends LayerComponentBase<__esri.GroupLayer> implements OnInit, AfterContentInit {
  @Input()
  set title(value: string) {
    this.setField('title', value);
  }
  @Input()
  set portalId(value: string) {
    this.setAutoCastField('portalItem', { id: value }, true);
    this.portalSet = true;
  }
  @Input()
  set visibilityMode(value: groupVisibilityMode) {
    this.setField('visibilityMode', value);
  }

  @Output() layerViewCreated = new EsriEventEmitter<GroupLayerViewEvent>('layerview-create');
  @Output() layerViewDestroyed = new EsriEventEmitter<GroupLayerViewEvent>('layerview-destroyed');

  private portalSet = false;

  layerType: LayerType = LayerType.GroupLayer;

  @ContentChildren(LayerComponentBase) children: QueryList<LayerComponentBase<__esri.Layer>>;

  async ngOnInit() {
    type modules = [typeof import ('esri/layers/GroupLayer')];
    const [ GroupLayer ] = await loadEsriModules<modules>(['esri/layers/GroupLayer']);

    const params = createCtorParameterObject<__esri.GroupLayerProperties>(this);
    this.instance = new GroupLayer(params);
    this.configureEventEmitters();
    this.configureWatchEmitters();
  }

  ngAfterContentInit() {
    this.getInstance$().pipe(
      take(1)
    ).subscribe(() => {
      const layers = this.children.filter(lc => lc !== this).map(lc => lc.getInstance$());
      if (layers.length > 0 && this.portalSet) {
        throw new Error('A Group Layer may be loaded from a Portal Item, or have bespoke layers, but not both.');
      }
      this.watchLayerChanges(layers);
      this.setupChildWatchers();
    });
  }

  setupChildWatchers(): void {
    this.children.changes.pipe(
      map((layerComponents: LayerComponentBase<__esri.Layer>[]) => layerComponents.filter(lc => lc !== this).map(lc => lc.getInstance$()))
    ).subscribe(layers => {
      this.instance.layers.removeAll();
      this.watchLayerChanges(layers);
    });
  }

  private watchLayerChanges(children: Observable<__esri.Layer>[]) {
    combineLatest(children).pipe(take(1)).subscribe(layers => this.instance.addMany(layers));
  }
}
