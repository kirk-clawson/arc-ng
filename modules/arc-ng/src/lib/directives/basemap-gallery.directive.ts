import { Directive, forwardRef, Input } from '@angular/core';
import { WidgetComponentBase } from '../shared/component-bases';
import { loadModules } from '../shared/utils';
import { UIPosition } from '../shared/enums';

@Directive({
  selector: 'arcng-basemap-gallery',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective extends WidgetComponentBase {

  @Input()
  set index(value: number) {
    this.__index = value;
  }

  @Input()
  set position(value: UIPosition) {
    this.__position = value;
  }

  private instance: import ('esri/widgets/BasemapGallery');

  async createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Widget> {
    type modules = [typeof import ('esri/widgets/BasemapGallery')];
    const [ BaseMapGallery ] = await loadModules<modules>(['esri/widgets/BasemapGallery']);
    const params: __esri.BasemapGalleryProperties = { view };
    if (isHidden) {
      params.container = document.createElement('div');
    }
    this.instance = new BaseMapGallery(params);
    return this.instance;
  }
}
