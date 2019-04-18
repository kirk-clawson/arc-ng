/* tslint:disable:variable-name */
import { UIPosition } from './enums';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface MapViewReadyProvider {
  mapViewReady: Subject<__esri.MapView>;
}

export abstract class WidgetBase {

  protected __index?: number;
  protected __position: UIPosition = UIPosition.Manual;

  protected constructor(provider: MapViewReadyProvider) {
    provider.mapViewReady.pipe(
      take(1)
    ).subscribe(view => this.afterMapViewReady(view));
  }

  protected getPosition(): string | __esri.UIAddPosition {
    return this.__index == null ? this.__position : { position: this.__position, index: this.__index };
  }

  protected async abstract afterMapViewReady(view: __esri.MapView);
}
