import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { loadModules, trimEmptyFields } from '../../shared/utils';
import { EsriEventEmitter } from '../../shared/esri-event-emitter';

export type resizeAlign = 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type baseMapNames = 'topo' | 'streets' | 'satellite' | 'hybrid' | 'dark-gray' | 'gray' | 'national-geographic' | 'oceans' |
                           'osm' | 'terrain' | 'dark-gray-vector' | 'gray-vector' | 'streets-vector' | 'streets-night-vector' |
                           'streets-navigation-vector' | 'topo-vector' | 'streets-relief-vector';

@Component({
  selector: 'arcng-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
  @Input()
  set zoom(value: number) {
    this._zoom = value;
  }

  @Input()
  set viewpoint(value: __esri.ViewpointProperties) {
    this._viewpoint = value;
  }

  @Input()
  set spatialReference(value: __esri.SpatialReferenceProperties) {
    this._spatialReference = value;
  }

  @Input()
  set scale(value: number) {
    this._scale = value;
  }

  @Input()
  set rotation(value: number) {
    this._rotation = value;
  }

  @Input()
  set resizeAlign(value: resizeAlign) {
    this._resizeAlign = value;
  }

  @Input()
  set popup(value: __esri.PopupProperties) {
    this._popup = value;
  }

  @Input()
  set padding(value: __esri.ViewPadding) {
    this._padding = value;
  }

  @Input()
  set highlightOptions(value: __esri.MapViewHighlightOptionsProperties) {
    this._highlightOptions = value;
  }

  @Input()
  set extent(value: __esri.ExtentProperties) {
    this._extent = value;
  }

  @Input()
  set constraints(value: __esri.MapViewConstraints) {
    this._constraints = value;
  }

  @Input()
  set center(value: __esri.PointProperties | number[]) {
    this._center = value;
  }

  @Input()
  set breakpoints(value: __esri.BreakpointsOwnerBreakpoints) {
    this._breakpoints = value;
  }

  @Input()
  set baseMap(value: __esri.Basemap | baseMapNames) {
    this._baseMap = value;
  }

  @Output() mapReady            = new EventEmitter();
  @Output() mapBlur             = new EsriEventEmitter<__esri.MapViewBlurEvent>('blur');
  @Output() mapClick            = new EsriEventEmitter<__esri.MapViewClickEvent>('click');
  @Output() mapDoubleClick      = new EsriEventEmitter<__esri.MapViewDoubleClickEvent>('double-click');
  @Output() mapDrag             = new EsriEventEmitter<__esri.MapViewDragEvent>('drag');
  @Output() mapFocus            = new EsriEventEmitter<__esri.MapViewFocusEvent>('focus');
  @Output() mapHold             = new EsriEventEmitter<__esri.MapViewHoldEvent>('hold');
  @Output() mapImmediateClick   = new EsriEventEmitter<__esri.MapViewImmediateClickEvent>('immediate-click');
  @Output() mapKeyDown          = new EsriEventEmitter<__esri.MapViewKeyDownEvent>('key-down');
  @Output() mapKeyUp            = new EsriEventEmitter<__esri.MapViewKeyUpEvent>('key-up');
  @Output() mapLayerViewCreate  = new EsriEventEmitter<__esri.MapViewLayerviewCreateEvent>('layerview-create');
  @Output() mapLayerViewDestroy = new EsriEventEmitter<__esri.MapViewLayerviewDestroyEvent>('layerview-destroy');
  @Output() mapMousewheel       = new EsriEventEmitter<__esri.MapViewMouseWheelEvent>('mousewheel');
  @Output() mapPointerDown      = new EsriEventEmitter<__esri.MapViewPointerDownEvent>('pointer-down');
  @Output() mapPointerEnter     = new EsriEventEmitter<__esri.MapViewPointerEnterEvent>('pointer-enter');
  @Output() mapPointerLeave     = new EsriEventEmitter<__esri.MapViewPointerLeaveEvent>('pointer-leave');
  @Output() mapPointerMove      = new EsriEventEmitter<__esri.MapViewPointerMoveEvent>('pointer-move');
  @Output() mapPointerUp        = new EsriEventEmitter<__esri.MapViewPointerUpEvent>('pointer-up');
  @Output() mapResize           = new EsriEventEmitter<__esri.MapViewResizeEvent>('resize');

  private map: import ('esri/Map');
  private mapView: import ('esri/views/MapView');

  private _baseMap: __esri.Basemap | baseMapNames;
  private _breakpoints: __esri.BreakpointsOwnerBreakpoints;
  private _center: __esri.PointProperties | number[];
  private _constraints: __esri.MapViewConstraints;
  private _extent: __esri.ExtentProperties;
  private _highlightOptions: __esri.MapViewHighlightOptionsProperties;
  private _padding: __esri.ViewPadding;
  private _popup: __esri.PopupProperties;
  private _resizeAlign: resizeAlign;
  private _rotation: number;
  private _scale: number;
  private _spatialReference: __esri.SpatialReferenceProperties;
  private _viewpoint: __esri.ViewpointProperties;
  private _zoom: number;

  @ViewChild('mapContainer') mapContainer: ElementRef;

  constructor() { }

  async ngOnInit() {
    type ModuleTypes = [ typeof import ('esri/Map'), typeof import ('esri/views/MapView')];
    const [Map, MapView] = await loadModules<ModuleTypes>(['esri/Map', 'esri/views/MapView']);
    const mapParams = trimEmptyFields({ basemap: this._baseMap });
    this.map = Object.keys(mapParams).length === 0 ? new Map() : new Map(mapParams);
    const viewParams = this.createConstructorParameters();
    this.mapView = Object.keys(viewParams).length === 0 ? new MapView() : new MapView(viewParams);
    await this.mapView.when();
    this.createSubscribedHandlers();
    this.mapReady.emit();
  }

  private createConstructorParameters(): __esri.MapViewProperties {
    const result: __esri.MapViewProperties = {
      map: this.map,
      breakpoints: this._breakpoints,
      center: this._center,
      constraints: this._constraints,
      container: this.mapContainer.nativeElement,
      extent: this._extent,
      padding: this._padding,
      popup: this._popup,
      resizeAlign: this._resizeAlign,
      rotation: this._rotation,
      scale: this._scale,
      spatialReference: this._spatialReference,
      viewpoint: this._viewpoint,
      zoom: this._zoom
    };
    return trimEmptyFields(result);
  }

  private createSubscribedHandlers(): void {
    this.mapBlur.init(this.mapView);
    this.mapClick.init(this.mapView);
    this.mapDoubleClick.init(this.mapView);
    this.mapDrag.init(this.mapView);
    this.mapFocus.init(this.mapView);
    this.mapHold.init(this.mapView);
    this.mapImmediateClick.init(this.mapView);
    this.mapKeyDown.init(this.mapView);
    this.mapKeyUp.init(this.mapView);
    this.mapLayerViewCreate.init(this.mapView);
    this.mapLayerViewDestroy.init(this.mapView);
    this.mapMousewheel.init(this.mapView);
    this.mapPointerDown.init(this.mapView);
    this.mapPointerEnter.init(this.mapView);
    this.mapPointerLeave.init(this.mapView);
    this.mapPointerMove.init(this.mapView);
    this.mapPointerUp.init(this.mapView);
    this.mapResize.init(this.mapView);
  }
}
