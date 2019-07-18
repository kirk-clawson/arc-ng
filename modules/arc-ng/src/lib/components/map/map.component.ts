import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input, OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { EsriEventedBase } from '../../shared/component-bases/esri-component-base';
import { LayerBase } from '../../shared/component-bases/layer-base';
import { WidgetBase } from '../../shared/component-bases/widget-base';
import { UIPosition } from '../../shared/enums';
import { EsriEventEmitter, EsriHitTestEmitter } from '../../shared/esri-emitters';
import { isExpandWidget } from '../../shared/type-utils';
import { isEmpty, loadEsriModules, trimEmptyFields } from '../../shared/utils';

export type resizeAlign = 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type baseMapNames = 'topo' | 'streets' | 'satellite' | 'hybrid' | 'dark-gray' | 'gray' | 'national-geographic' | 'oceans' |
                           'osm' | 'terrain' | 'dark-gray-vector' | 'gray-vector' | 'streets-vector' | 'streets-night-vector' |
                           'streets-navigation-vector' | 'topo-vector' | 'streets-relief-vector';

@Component({
  selector: 'arcng-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActionDispatcherService,
  ]
})
export class MapComponent
  extends EsriEventedBase<import ('esri/views/MapView'), __esri.MapViewProperties>
  implements OnInit, AfterContentInit {

  @Input()
  set zoom(value: number) {
    this.initOrChangeValueField('zoom', value);
  }

  @Input()
  set viewpoint(value: __esri.ViewpointProperties) {
    this.initOrChangeConstructedField('viewpoint', value, 'esri/Viewpoint');
  }

  @Input()
  set spatialReference(value: __esri.SpatialReferenceProperties) {
    this.initOrChangeConstructedField('spatialReference', value, 'esri/geometry/SpatialReference');
  }

  @Input()
  set scale(value: number) {
    this.initOrChangeValueField('scale', value);
  }

  @Input()
  set rotation(value: number) {
    this.initOrChangeValueField('rotation', value);
  }

  @Input()
  set resizeAlign(value: resizeAlign) {
    this.initOrChangeValueField('resizeAlign', value);
  }

  @Input()
  set popup(value: __esri.PopupProperties) {
    this.initOrChangeConstructedField('popup', value, 'esri/widgets/Popup');
  }

  @Input()
  set padding(value: __esri.ViewPadding) {
    this.initOrChangeValueField('padding', value);
  }

  @Input()
  set highlightOptions(value: __esri.MapViewHighlightOptionsProperties) {
    if (this.instance == null) {
      this.initializeField('highlightOptions', value);
    } else {
      // temporary
      throw new Error('Highlight Options can only be set once at startup');
    }
  }

  @Input()
  set extent(value: __esri.ExtentProperties) {
    this.initOrChangeConstructedField('extent', value, 'esri/geometry/Extent');
  }

  @Input()
  set constraints(value: __esri.MapViewConstraints) {
    this.initOrChangeValueField('constraints', value);
  }

  @Input()
  set center(value: __esri.PointProperties | number[]) {
    this.initOrChangeConstructedField('center', value, 'esri/geometry/Point');
  }

  @Input()
  set breakpoints(value: __esri.BreakpointsOwnerBreakpoints) {
    this.initOrChangeValueField('breakpoints', value);
  }

  @Input()
  set baseMap(value: __esri.Basemap | baseMapNames) {
    this._baseMap = value;
  }

  @Input() layersReversed = true;

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

  @Output() viewReady            = new EventEmitter<__esri.MapView>();

  private _baseMap: __esri.Basemap | baseMapNames;
  private map: import ('esri/Map');

  @ViewChild('mapContainer', { static: true }) mapContainer: ElementRef;
  @ContentChildren(WidgetBase) childWidgets: QueryList<WidgetBase<__esri.Widget, any>>;
  @ContentChildren(LayerBase) childLayers: QueryList<LayerBase>;

  async ngOnInit() {
    try {
      type ModuleTypes = [ typeof import ('esri/Map'), typeof import ('esri/views/MapView')];
      const [Map, MapView] = await loadEsriModules<ModuleTypes>(['esri/Map', 'esri/views/MapView']);

      const mapParams = trimEmptyFields({ basemap: this._baseMap });
      this.map = isEmpty(mapParams) ? new Map() : new Map(mapParams);
      const viewParams = this.initializer;
      viewParams.map = this.map;
      viewParams.container = this.mapContainer.nativeElement;
      this.instance = isEmpty(viewParams) ? new MapView() : new MapView(viewParams);
      this.configureEsriEvents();

      await this.instance.when();
      this.viewReady.emit(this.instance);
    } catch (e) {
      console.error('There was an error Initializing the Map and MapView.', e);
    }
  }

  ngAfterContentInit() {
    this.getInstance$().pipe(
      take(1)
    ).subscribe(() => {
      const layers = this.childLayers.map(lc => lc.getInstance$());
      this.watchLayerChanges(layers);
      this.setupChildWatchers();
    });
  }

  attachWidget(widget: __esri.Widget, position: UIPosition) {
    const index = this.childWidgets.toArray().findIndex(wc => isExpandWidget(widget)
                                                                          ? wc.instance === widget.content
                                                                          : wc.instance === widget);
    this.instance.ui.add(widget, { index, position });
  }

  detachWidget(widget: __esri.Widget) {
    this.instance.ui.remove(widget);
  }

  private setupChildWatchers(): void {
    this.childLayers.changes.pipe(
      map((layerComponents: LayerBase[]) => layerComponents.map(lc => lc.getInstance$())),
    ).subscribe(layers => {
      this.map.layers.removeAll();
      this.watchLayerChanges(layers);
    });
  }

  private watchLayerChanges(children: Observable<__esri.Layer>[]) {
    combineLatest(children).pipe(
      take(1),
      map(layers => this.layersReversed ? layers.reverse() : layers)
    ).subscribe(layers => this.map.addMany(layers));
  }
}
