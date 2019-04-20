import { Directive, forwardRef, Input, Output } from '@angular/core';
import { WidgetComponentBase } from '../shared/widget-component-base';
import { createCtorParameterObject, loadEsriModules } from '../shared/utils';
import { IconClass } from '../shared/enums';
import { EsriWatchEmitter } from '../shared/esri-watch-emitter';

@Directive({
  selector: 'arcng-basemap-gallery',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective extends WidgetComponentBase<__esri.BasemapGallery> {
  @Input()
  set label(value: string) {
    this.setField('label', value);
  }
  @Input()
  set iconClass(value: IconClass) {
    this.setField('iconClass', value);
  }
  @Input()
  set activeBasemap(value: __esri.Basemap) {
    this.setField('activeBasemap', value);
  }
  @Output() activeBasemapChange = new EsriWatchEmitter<__esri.Basemap>('activeBasemap');

  async createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.BasemapGallery> {
    type modules = [typeof import ('esri/widgets/BasemapGallery')];
    const [ BaseMapGallery ] = await loadEsriModules<modules>(['esri/widgets/BasemapGallery']);
    if (isHidden) {
      this.container = document.createElement('div');
    }
    const params = createCtorParameterObject<__esri.BasemapGalleryProperties>(this);
    params.view = view;
    this.instance = new BaseMapGallery(params);
    this.createWatchedHandlers();
    return this.instance;
  }
}
