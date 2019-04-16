import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { loadModules } from '../../shared/utils';

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
export class MapComponent implements OnInit, OnDestroy {
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
  @Output() mapBlur             = new EventEmitter<__esri.MapViewBlurEvent>();
  @Output() mapClick            = new EventEmitter<__esri.MapViewClickEvent>();
  @Output() mapDoubleClick      = new EventEmitter<__esri.MapViewDoubleClickEvent>();
  @Output() mapDrag             = new EventEmitter<__esri.MapViewDragEvent>();
  @Output() mapFocus            = new EventEmitter<__esri.MapViewFocusEvent>();
  @Output() mapHold             = new EventEmitter<__esri.MapViewHoldEvent>();
  @Output() mapImmediateClick   = new EventEmitter<__esri.MapViewImmediateClickEvent>();
  @Output() mapKeyDown          = new EventEmitter<__esri.MapViewKeyDownEvent>();
  @Output() mapKeyUp            = new EventEmitter<__esri.MapViewKeyUpEvent>();
  @Output() mapLayerViewCreate  = new EventEmitter<__esri.MapViewLayerviewCreateEvent>();
  @Output() mapLayerViewDestroy = new EventEmitter<__esri.MapViewLayerviewDestroyEvent>();
  @Output() mapMousewheel       = new EventEmitter<__esri.MapViewMouseWheelEvent>();
  @Output() mapPointerDown      = new EventEmitter<__esri.MapViewPointerDownEvent>();
  @Output() mapPointerEnter     = new EventEmitter<__esri.MapViewPointerEnterEvent>();
  @Output() mapPointerLeave     = new EventEmitter<__esri.MapViewPointerLeaveEvent>();
  @Output() mapPointerMove      = new EventEmitter<__esri.MapViewPointerMoveEvent>();
  @Output() mapPointerUp        = new EventEmitter<__esri.MapViewPointerUpEvent>();
  @Output() mapResize           = new EventEmitter<__esri.MapViewResizeEvent>();

  private handles: IHandle[] = [];
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
    this.map = this._baseMap === undefined ? new Map() : new Map({ basemap: this._baseMap });
    this.mapView = new MapView(this.createConstructorParameters());
    await this.mapView.when();
    this.createSubscribedHandlers();
    this.mapReady.emit();
  }

  ngOnDestroy(): void {
    this.handles.forEach(h => h.remove());
  }

  private createConstructorParameters(): __esri.MapViewProperties {
    const result: __esri.MapViewProperties = {
      map: this.map,
      container: this.mapContainer.nativeElement
    };
    if (this._breakpoints !== undefined) {
      result.breakpoints = this._breakpoints;
    }
    if (this._center !== undefined) {
      result.center = this._center;
    }
    if (this._constraints !== undefined) {
      result.constraints = this._constraints;
    }
    if (this._extent !== undefined) {
      result.extent = this._extent;
    }
    if (this._padding !== undefined) {
      result.padding = this._padding;
    }
    if (this._popup !== undefined) {
      result.popup = this._popup;
    }
    if (this._resizeAlign !== undefined) {
      result.resizeAlign = this._resizeAlign;
    }
    if (this._rotation !== undefined) {
      result.rotation = this._rotation;
    }
    if (this._scale !== undefined) {
      result.scale = this._scale;
    }
    if (this._spatialReference !== undefined) {
      result.spatialReference = this._spatialReference;
    }
    if (this._viewpoint !== undefined) {
      result.viewpoint = this._viewpoint;
    }
    if (this._zoom !== undefined) {
      result.zoom = this._zoom;
    }
    return result;
  }

  private createSubscribedHandlers(): void {
    if (this.mapBlur.observers.length > 0) {
      this.handles.push(this.mapView.on('blur', e => this.mapBlur.emit(e)));
    }
    if (this.mapClick.observers.length > 0) {
      this.handles.push(this.mapView.on('click', e => this.mapClick.emit(e)));
    }
    if (this.mapDoubleClick.observers.length > 0) {
      this.handles.push(this.mapView.on('double-click', e => this.mapDoubleClick.emit(e)));
    }
    if (this.mapDrag.observers.length > 0) {
      this.handles.push(this.mapView.on('drag', e => this.mapDrag.emit(e)));
    }
    if (this.mapFocus.observers.length > 0) {
      this.handles.push(this.mapView.on('focus', e => this.mapFocus.emit(e)));
    }
    if (this.mapHold.observers.length > 0) {
      this.handles.push(this.mapView.on('hold', e => this.mapHold.emit(e)));
    }
    if (this.mapImmediateClick.observers.length > 0) {
      this.handles.push(this.mapView.on('immediate-click', e => this.mapImmediateClick.emit(e)));
    }
    if (this.mapKeyDown.observers.length > 0) {
      this.handles.push(this.mapView.on('key-down', e => this.mapKeyDown.emit(e)));
    }
    if (this.mapKeyUp.observers.length > 0) {
      this.handles.push(this.mapView.on('key-up', e => this.mapKeyUp.emit(e)));
    }
    if (this.mapLayerViewCreate.observers.length > 0) {
      this.handles.push(this.mapView.on('layerview-create', e => this.mapLayerViewCreate.emit(e)));
    }
    if (this.mapLayerViewDestroy.observers.length > 0) {
      this.handles.push(this.mapView.on('layerview-destroy', e => this.mapLayerViewDestroy.emit(e)));
    }
    if (this.mapMousewheel.observers.length > 0) {
      this.handles.push(this.mapView.on('mousewheel', e => this.mapMousewheel.emit(e)));
    }
    if (this.mapPointerDown.observers.length > 0) {
      this.handles.push(this.mapView.on('pointer-down', e => this.mapPointerDown.emit(e)));
    }
    if (this.mapPointerEnter.observers.length > 0) {
      this.handles.push(this.mapView.on('pointer-enter', e => this.mapPointerEnter.emit(e)));
    }
    if (this.mapPointerLeave.observers.length > 0) {
      this.handles.push(this.mapView.on('pointer-leave', e => this.mapPointerLeave.emit(e)));
    }
    if (this.mapPointerMove.observers.length > 0) {
      this.handles.push(this.mapView.on('pointer-move', e => this.mapPointerMove.emit(e)));
    }
    if (this.mapPointerUp.observers.length > 0) {
      this.handles.push(this.mapView.on('pointer-up', e => this.mapPointerUp.emit(e)));
    }
    if (this.mapResize.observers.length > 0) {
      this.handles.push(this.mapView.on('resize', e => this.mapResize.emit(e)));
    }
  }
}
