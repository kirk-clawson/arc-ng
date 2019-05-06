import { Component } from '@angular/core';
import { IconClass, UIPosition } from 'arc-ng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  uiPositions = UIPosition;
  icons = IconClass;
  title = 'sample-app';
  fontSize = 12;
  haloSize = '1px';

  onMapReady(event: __esri.MapView) {
    console.log('Map is Ready', event);
  }

  onActionClick() {
    switch (this.haloSize) {
      case '1px':
        this.haloSize = '2px';
        break;
      case '2px':
        this.haloSize = '3px';
        break;
      case '3px':
        this.haloSize = '1px';
        break;
    }
  }
}
