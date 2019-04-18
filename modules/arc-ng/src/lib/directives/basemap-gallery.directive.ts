import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { MapChildBase, UIPositions } from '../shared/component-bases';
import { loadModules } from '../shared/utils';

@Directive({
  selector: 'arcng-basemap-gallery',
  providers: [{ provide: MapChildBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective implements MapChildBase, OnInit {
  @Input()
  set index(value: number) {
    this._index = value;
  }

  @Input()
  set position(value: UIPositions) {
    this._position = value;
  }

  private BaseMapGalleryCtor: typeof import ('esri/widgets/BasemapGallery');
  private basemapGallery: import ('esri/widgets/BasemapGallery');

  private _index?: number;
  private _position: UIPositions = 'manual';

  constructor() { }

  async ngOnInit() {
    type modules = [typeof import ('esri/widgets/BasemapGallery')];
    try {
      [this.BaseMapGalleryCtor] = await loadModules<modules>(['esri/widgets/BasemapGallery']);
    } catch (e) {
      console.error('There was an error Initializing the Basemap Gallery constructor function.', e);
    }
  }

  initMap(parent: __esri.MapView) {
    try {
      this.basemapGallery = new this.BaseMapGalleryCtor({ view: parent });
      const positionParams = this._index == null ? this._position : { position: this._position, index: this._index };
      parent.ui.add(this.basemapGallery, positionParams);
    } catch (e) {
      console.error('There was an error creating the Basemap Gallery.', e);
    }
  }
}
