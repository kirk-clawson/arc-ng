import { Directive, forwardRef, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { WidgetBase } from '../../shared/component-bases/widget-base';
import { EsriWatchEmitter } from '../../shared/esri-emitters';
import { IconClass } from '../../shared/esri-icons';
import { loadEsriModules } from '../../shared/utils';
import { MapComponent } from '../map/map.component';
import { ExpandDirective } from './expand.directive';
import { isBasemapArray } from '../../shared/type-utils';

@Directive({
  selector: 'basemap-gallery',
  providers: [{ provide: WidgetBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective
  extends WidgetBase<__esri.BasemapGallery, __esri.BasemapGalleryProperties>
  implements OnInit, OnDestroy {

  @Input()
  set label(value: string) {
    this.initOrChangeValueField('label', value);
  }
  @Input()
  set iconClass(value: IconClass) {
    this.initOrChangeValueField('iconClass', value);
  }
  @Input()
  set activeBasemap(value: __esri.BasemapProperties) {
    this.initOrChangeConstructedField('activeBasemap', value, 'esri/Basemap');
  }
  @Input()
  set Basemaps(value: string | string[] | __esri.Basemap[]) {
    const items: string[] | __esri.Basemap[] = Array.isArray(value) ? value : value.split(',');
    if (isBasemapArray(items)) {
      this._basemaps = items;
    } else {
      this._basemapIds = items.map(b => b.trim());
    }
  }
  @Output() activeBasemapChange = new EsriWatchEmitter<__esri.Basemap>('activeBasemap');

  private _basemaps: __esri.Basemap[];
  private _basemapIds: string[];

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
      if (this.expander != null) {
        this.container = document.createElement('div');
      }
      this.initializer.view = view;
      if (this._basemapIds != null && this._basemapIds.length > 0) {
        this._basemaps = this._basemapIds.map(id => Basemap.fromId(id));
      }
      if (this._basemaps != null && this._basemaps.length > 0) {
        this.initializer.source = new BasemapSource({ basemaps: this._basemaps });
      }
      this.instance = new BaseMapGallery(this.initializer);
      this.configureEsriEvents();
      if (this.expander != null) {
        await this.expander.createInstance(view, this.instance, this.initializer.container);
        this.parent.attachWidget(this.expander.instance, this._uiPosition);
      } else {
        this.parent.attachWidget(this.instance, this._uiPosition);
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
