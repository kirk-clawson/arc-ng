import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output, QueryList,
  ViewChild,
} from '@angular/core';
import { createCtorParameterObject, isEmpty, loadEsriModules, trimEmptyFields } from '../../shared/utils';
import { EsriEventEmitter } from '../../shared/esri-event-emitter';
import { widgetBuilder, WidgetComponentBase } from '../../shared/widget-component-base';
import { map } from 'rxjs/operators';
import { layerBuilder, LayerComponentBase } from '../../shared/layer-component-base';

export class EsriHitTestEmitter<T = __esri.HitTestResult> extends EsriEventEmitter<__esri.HitTestResult> {
  init(source: __esri.MapView) {
    if (this.observers.length > 0) {
      this.handleCleanup();
      this.handle = source.on(this.esriEventName, e => {
        source.hitTest(e).then(r => this.emit(r));
      });
    }
  }
}

export type resizeAlign = 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type baseMapNames = 'topo' | 'streets' | 'satellite' | 'hybrid' | 'dark-gray' | 'gray' | 'national-geographic' | 'oceans' |
                           'osm' | 'terrain' | 'dark-gray-vector' | 'gray-vector' | 'streets-vector' | 'streets-night-vector' |
                           'streets-navigation-vector' | 'topo-vector' | 'streets-relief-vector';

@Component({
  selector: 'arcng-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterContentInit {
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

  @Output() mapReady             = new EventEmitter<__esri.MapView>();
  @Output() mapBlur              = new EsriEventEmitter<__esri.MapViewBlurEvent>('blur');
  @Output() mapClick             = new EsriEventEmitter<__esri.MapViewClickEvent>('click');
  @Output() mapClickHit          = new EsriHitTestEmitter('click');
  @Output() mapDoubleClick       = new EsriEventEmitter<__esri.MapViewDoubleClickEvent>('double-click');
  @Output() mapDoubleClickHit    = new EsriHitTestEmitter('double-click');
  @Output() mapDrag              = new EsriEventEmitter<__esri.MapViewDragEvent>('drag');
  @Output() mapDragHit           = new EsriHitTestEmitter('drag');
  @Output() mapFocus             = new EsriEventEmitter<__esri.MapViewFocusEvent>('focus');
  @Output() mapHold              = new EsriEventEmitter<__esri.MapViewHoldEvent>('hold');
  @Output() mapHoldHit           = new EsriHitTestEmitter('hold');
  @Output() mapImmediateClick    = new EsriEventEmitter<__esri.MapViewImmediateClickEvent>('immediate-click');
  @Output() mapImmediateClickHit = new EsriHitTestEmitter('immediate-click');
  @Output() mapKeyDown           = new EsriEventEmitter<__esri.MapViewKeyDownEvent>('key-down');
  @Output() mapKeyUp             = new EsriEventEmitter<__esri.MapViewKeyUpEvent>('key-up');
  @Output() mapLayerViewCreate   = new EsriEventEmitter<__esri.MapViewLayerviewCreateEvent>('layerview-create');
  @Output() mapLayerViewDestroy  = new EsriEventEmitter<__esri.MapViewLayerviewDestroyEvent>('layerview-destroy');
  @Output() mapMousewheel        = new EsriEventEmitter<__esri.MapViewMouseWheelEvent>('mousewheel');
  @Output() mapMousewheelHit     = new EsriHitTestEmitter('mousewheel');
  @Output() mapPointerDown       = new EsriEventEmitter<__esri.MapViewPointerDownEvent>('pointer-down');
  @Output() mapPointerDownHit    = new EsriHitTestEmitter('pointer-down');
  @Output() mapPointerEnter      = new EsriEventEmitter<__esri.MapViewPointerEnterEvent>('pointer-enter');
  @Output() mapPointerEnterHit   = new EsriHitTestEmitter('pointer-enter');
  @Output() mapPointerLeave      = new EsriEventEmitter<__esri.MapViewPointerLeaveEvent>('pointer-leave');
  @Output() mapPointerLeaveHit   = new EsriHitTestEmitter('pointer-leave');
  @Output() mapPointerMove       = new EsriEventEmitter<__esri.MapViewPointerMoveEvent>('pointer-move');
  @Output() mapPointerMoveHit    = new EsriHitTestEmitter('pointer-move');
  @Output() mapPointerUp         = new EsriEventEmitter<__esri.MapViewPointerUpEvent>('pointer-up');
  @Output() mapPointerUpHit      = new EsriHitTestEmitter('pointer-up');
  @Output() mapResize            = new EsriEventEmitter<__esri.MapViewResizeEvent>('resize');

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
  @ContentChildren(WidgetComponentBase) childWidgets: QueryList<WidgetComponentBase<__esri.Widget>>;
  @ContentChildren(LayerComponentBase) childLayers: QueryList<LayerComponentBase<__esri.Layer>>;

  constructor() { }

  async ngAfterContentInit() {
    type ModuleTypes = [ typeof import ('esri/Map'), typeof import ('esri/views/MapView')];
    try {
      const [Map, MapView] = await loadEsriModules<ModuleTypes>(['esri/Map', 'esri/views/MapView']);
      const mapParams = trimEmptyFields({ basemap: this._baseMap });
      this.map = isEmpty(mapParams) ? new Map() : new Map(mapParams);
      const viewParams = this.createConstructorParameters();
      this.mapView = isEmpty(viewParams) ? new MapView() : new MapView(viewParams);
      await this.setupLayers();
      await this.mapView.when();
      this.createSubscribedHandlers();
      await this.setupWidgets();
      this.mapReady.emit(this.mapView);
    } catch (e) {
      console.error('There was an error Initializing the Map and MapView.', e);
    }
  }

  private createConstructorParameters(): __esri.MapViewProperties {
    const result = createCtorParameterObject<__esri.MapViewProperties>(this);
    result.map = this.map;
    result.container = this.mapContainer.nativeElement;
    return result;
  }

  private createSubscribedHandlers(): void {
    Object.values(this).forEach(v => {
      if (v instanceof EsriEventEmitter) {
        v.init(this.mapView);
      }
    });
  }

  private async setupLayers() {
    await Promise.all(this.childLayers.map(layerBuilder(this.map)));
  }

  private async setupWidgets() {
    await this.createWidgets(this.childWidgets.toArray());
    this.childWidgets.changes.pipe(
      map((widgets: WidgetComponentBase<__esri.Widget>[]) => this.createWidgets(widgets.filter(w => !w.isAttached)))
    ).subscribe();
  }

  private async createWidgets(widgetComponents: WidgetComponentBase<__esri.Widget>[]) {
    await Promise.all(widgetComponents.map(widgetBuilder(this.mapView)));
  }
}
