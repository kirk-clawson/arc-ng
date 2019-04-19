import { Component, forwardRef, Inject, InjectionToken, Input, Optional, SkipSelf } from '@angular/core';
import { LayerBase } from '../../shared/component-bases';
import { MapComponent, MapToken } from '../map/map.component';
import { createCtorParameterObject, loadModules } from '../../shared/utils';

export const GroupToken = new InjectionToken<GroupLayerComponent>('expand-component');

@Component({
  selector: 'arcng-group-layer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: GroupToken, useExisting: forwardRef(() => GroupLayerComponent)}]
})
export class GroupLayerComponent extends LayerBase {

  @Input()
  set title(value: string) {
    this._title = value;
  }

  private _title: string;

  private instance: import ('esri/layers/GroupLayer');

  constructor(@Inject(MapToken) map: MapComponent, @Optional() @SkipSelf() @Inject(GroupToken) private group: GroupLayerComponent) {
    super(map);
  }

  async initWithLayer<T extends __esri.Layer>(child: T, view: __esri.MapView) {
    type modules = [typeof import ('esri/layers/GroupLayer')];
    try {
      const [ GroupLayer ] = await loadModules<modules>(['esri/layers/GroupLayer']);
      if (this.instance == null) {
        const params = createCtorParameterObject<__esri.GroupLayerProperties>(this);
        params.layers = [child];
        this.instance = new GroupLayer(params);
        if (this.group == null) {
          view.map.add(this.instance);
        } else {
          await this.group.initWithLayer(this.instance, view);
        }
      } else {
        this.instance.add(child);
      }
    } catch (e) {
      console.error('There was an error Initializing the Group Layer.', e);
    }
  }

  protected async afterMapViewReady(view: __esri.MapView) {
    // do nothing
  }
}
