import { Directive, forwardRef, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { WidgetBase } from '../../shared/component-bases/widget-base';
import { IconClass } from '../../shared/esri-icons';
import { EsriWatchEmitter } from '../../shared/esri-watch-emitter';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { MapComponent } from '../map/map.component';
import { ExpandDirective } from './expand.directive';

@Directive({
  selector: 'basemap-gallery',
  providers: [{ provide: WidgetBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective extends WidgetBase<__esri.BasemapGallery> implements OnInit, OnDestroy {
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

  constructor(private parent: MapComponent, @Optional() private expander?: ExpandDirective) {
    super();
  }

  async ngOnInit() {
    type modules = [typeof import ('esri/widgets/BasemapGallery')];
    const [ BaseMapGallery ] = await loadEsriModules<modules>(['esri/widgets/BasemapGallery']);

    this.parent.getInstance$().pipe(
      take(1)
    ).subscribe(async view => {
      // tslint:disable-next-line:no-string-literal
      const localContainer = this['_container'];
      if (this.expander != null) {
        this.container = document.createElement('div');
      }
      const params = createCtorParameterObject<__esri.BasemapGalleryProperties>(this);
      params.view = view;
      this.instance = new BaseMapGallery(params);
      this.configureWatchEmitters();
      if (this.expander != null) {
        await this.expander.createInstance(view, this.instance, localContainer);
        this.parent.attachWidget(this.expander.instance, this.__uiPosition);
      } else {
        this.parent.attachWidget(this.instance, this.__uiPosition);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.expander != null) {
      this.parent.detachWidget(this.expander.instance);
    } else {
      this.parent.detachWidget(this.instance);
    }
    this.instance.destroy();
  }
}
