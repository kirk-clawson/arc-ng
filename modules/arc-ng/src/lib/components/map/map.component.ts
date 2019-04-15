import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { loadModules } from '../../shared/utils';

@Component({
  selector: 'arcng-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private map: import ('esri/Map');
  private mapView: import ('esri/views/MapView');

  @Input() baseMap = 'streets';
  @Input() zoom = 10;
  @Input() center = [-83.4255176, 42.432238];

  @Output() mapReady = new EventEmitter();

  @ViewChild('mapContainer') mapContainer: ElementRef;

  constructor() { }

  async initialize() {
    console.log('Starting init');
    type ModuleTypes = [ typeof import ('esri/Map'), typeof import ('esri/views/MapView')];
    const [Map, MapView] = await loadModules<ModuleTypes>(['esri/Map', 'esri/views/MapView']);
    this.map = new Map({
      basemap: this.baseMap
    });
    this.mapView = new MapView({
      map: this.map,
      container: this.mapContainer.nativeElement,
      center: this.center,
      zoom: this.zoom
    });
    return this.mapView.when();
  }

  ngOnInit() {
    this.initialize().then(() => {
      this.mapReady.emit();
    });
  }

}
