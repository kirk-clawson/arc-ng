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

  onMapReady() {
    console.log('Map is Ready');
  }
}
