import { Component } from '@angular/core';
import { IconClass, UIPosition } from 'arc-ng';
import { FillStyles } from 'arc-ng/lib/components/symbols/simple-fill-symbol.component';

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
  fillStyle: FillStyles = 'cross';

  onMapReady(event: __esri.MapView) {
    console.log('Map is Ready', event);
  }

  onActionClick() {
    if (this.fillStyle === 'cross') {
      this.fillStyle = 'diagonal-cross';
    } else {
      this.fillStyle = 'cross';
    }
  }
}
