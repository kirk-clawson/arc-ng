import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample-app';

  onMapReady() {
    console.log('Map is Ready');
  }

  onMapClick(event: __esri.MapViewClickEvent) {
    console.log('Map Clicked', event);
  }

  onMapHit(event: __esri.HitTestResult) {
    console.log('Map Hit', event);
  }
}
