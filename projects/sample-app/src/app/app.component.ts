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

  showBasemapGallery = true;

  onMapReady(event: __esri.MapView) {
    console.log('Map is Ready', event);
  }

  onActionClick(actionNum: number) {
    switch (actionNum) {
      case 1:
        this.showBasemapGallery = false;
        break;
      case 2:
        this.showBasemapGallery = true;
    }
  }
}
