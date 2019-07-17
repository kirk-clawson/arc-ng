import { Directive, forwardRef, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { WidgetBase } from '../../shared/component-bases/widget-base';
import { EsriWatchEmitter } from '../../shared/esri-emitters';
import { IconClass } from '../../shared/esri-icons';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { MapComponent } from '../map/map.component';
import { ExpandDirective } from './expand.directive';
import { isBasemapArray } from '../../shared/type-utils';

@Directive({
  selector: 'basemap-gallery',
  providers: [{ provide: WidgetBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective extends WidgetBase<__esri.BasemapGallery> implements OnInit, OnDestroy {
  @Input()
  set label(value: string) {
    this.changeField('label', value);
  }
  @Input()
  set iconClass(value: IconClass) {
    this.changeField('iconClass', value);
  }
  @Input()
  set activeBasemap(value: __esri.Basemap) {
    this.changeField('activeBasemap', value);
  }
  @Input()
  set Basemaps(value: string | string[] | __esri.Basemap[]) {
    const items: string[] | __esri.Basemap[] = Array.isArray(value) ? value : value.split(',');
    if (isBasemapArray(items)) {
      this.__basemaps = items;
    } else {
      this.__basemapIds = items.map(b => b.trim());
    }
  }
  @Output() activeBasemapChange = new EsriWatchEmitter<__esri.Basemap>('activeBasemap');

  // tslint:disable-next-line:variable-name
  private __basemaps: __esri.Basemap[];
  // tslint:disable-next-line:variable-name
  private __basemapIds: string[];

  constructor(private parent: MapComponent, @Optional() private expander?: ExpandDirective) {
    super();
  }

  async ngOnInit() {
    type modules = [
      typeof import ('esri/widgets/BasemapGallery'),
      typeof import ('esri/Basemap'),
      typeof import ('esri/widgets/BasemapGallery/support/LocalBasemapsSource')
    ];
    const moduleNames = [
      'esri/widgets/BasemapGallery',
      'esri/Basemap',
      'esri/widgets/BasemapGallery/support/LocalBasemapsSource'
    ];
    const [ BaseMapGallery, Basemap, BasemapSource ] = await loadEsriModules<modules>(moduleNames);

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
      if (this.__basemapIds != null && this.__basemapIds.length > 0) {
        this.__basemaps = this.__basemapIds.map(id => Basemap.fromId(id));
      }
      if (this.__basemaps != null && this.__basemaps.length > 0) {
        params.source = new BasemapSource({ basemaps: this.__basemaps });
      }
      this.instance = new BaseMapGallery(params);
      this.configureEsriEvents();
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
