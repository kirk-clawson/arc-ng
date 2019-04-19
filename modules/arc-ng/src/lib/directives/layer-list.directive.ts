import { Directive, Inject, Input, Optional } from '@angular/core';
import { WidgetBase } from '../shared/component-bases';
import { UIPosition } from '../shared/enums';
import { MapComponent, MapComponentToken } from '../components/map/map.component';
import { ExpandComponent, ExpandComponentToken } from '../components/expand/expand.component';
import { loadModules } from '../shared/utils';

@Directive({
  selector: 'arcng-layer-list'
})
export class LayerListDirective extends WidgetBase {
  @Input()
  set index(value: number) {
    this.__index = value;
  }

  @Input()
  set position(value: UIPosition) {
    this.__position = value;
  }

  private instance: import ('esri/widgets/LayerList');

  constructor(@Inject(MapComponentToken) map: MapComponent, @Optional() @Inject(ExpandComponentToken) private expand: ExpandComponent) {
    super(map);
  }

  protected async afterMapViewReady(view: __esri.MapView) {
    type modules = [typeof import ('esri/widgets/LayerList')];
    try {
      const [ LayerListWidget ] = await loadModules<modules>(['esri/widgets/LayerList']);
      if (this.expand != null) {
        this.instance = new LayerListWidget({ view, container: document.createElement('div') });
        await this.expand.initWithWidget(this.instance, view);
      } else {
        this.instance = new LayerListWidget({ view });
        view.ui.add(this.instance, this.getPosition());
      }
    } catch (e) {
      console.error('There was an error Initializing the Layer List.', e);
    }
  }
}
