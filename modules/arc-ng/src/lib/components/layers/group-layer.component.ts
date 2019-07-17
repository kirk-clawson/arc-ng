import { AfterContentInit, Component, ContentChildren, forwardRef, Input, OnInit, QueryList } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { LayerBase } from '../../shared/component-bases/layer-base';
import { LayerType } from '../../shared/enums';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { MapComponent } from '../map/map.component';

export type groupVisibilityMode = 'independent' | 'inherited' | 'exclusive';

@Component({
  selector: 'group-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: LayerBase, useExisting: forwardRef(() => GroupLayerComponent)}]
})
export class GroupLayerComponent extends LayerBase<__esri.GroupLayer, __esri.LayerView> implements OnInit, AfterContentInit {
  @Input()
  set portalId(value: string) {
    this.setAutoCastField('portalItem', { id: value }, true);
    this.portalSet = true;
  }
  @Input()
  set visibilityMode(value: groupVisibilityMode) {
    this.changeField('visibilityMode', value);
  }

  private portalSet = false;

  layerType: LayerType = LayerType.GroupLayer;

  @ContentChildren(LayerBase) children: QueryList<LayerBase>;

  constructor(private mapRoot: MapComponent, dispatcher: ActionDispatcherService) {
    super(dispatcher);
  }

  async ngOnInit() {
    type modules = [typeof import ('esri/layers/GroupLayer')];
    const [ GroupLayer ] = await loadEsriModules<modules>(['esri/layers/GroupLayer']);

    const params = createCtorParameterObject<__esri.GroupLayerProperties>(this);
    this.instance = new GroupLayer(params);
    this.configureEsriEvents();
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
      this.setupLayerWatch();
    });
  }

  setupLayerWatch(): void {
    this.children.changes.pipe(
      map((layerComponents: LayerBase[]) => layerComponents.filter(lc => lc !== this).map(lc => lc.getInstance$()))
    ).subscribe(layers => {
      this.instance.layers.removeAll();
      this.watchLayerChanges(layers);
    });
  }

  private watchLayerChanges(children: Observable<__esri.Layer>[]) {
    combineLatest(children).pipe(
      take(1),
      map(layers => this.mapRoot.layersReversed ? layers.reverse() : layers)
    ).subscribe(layers => this.instance.addMany(layers));
  }
}
