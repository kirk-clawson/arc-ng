import { Directive, forwardRef } from '@angular/core';
import { WidgetComponentBase } from '../shared/widget-component-base';
import { loadEsriModules } from '../shared/utils';

@Directive({
  selector: 'arcng-basemap-gallery',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective extends WidgetComponentBase {

  private instance: import ('esri/widgets/BasemapGallery');

  async createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.Widget> {
    type modules = [typeof import ('esri/widgets/BasemapGallery')];
    const [ BaseMapGallery ] = await loadEsriModules<modules>(['esri/widgets/BasemapGallery']);
    const params: __esri.BasemapGalleryProperties = { view };
    if (isHidden) {
      params.container = document.createElement('div');
    }
    this.instance = new BaseMapGallery(params);
    return this.instance;
  }
}
