import { EsriAutoCastComponentBase } from '../../../shared/component-bases/esri-auto-cast-component-base';
import { DependantChildComponent } from '../../../shared/dependant-child-component';
import { EventEmitter } from '@angular/core';

export class RendererBaseComponent<T>
  extends EsriAutoCastComponentBase<T>
  implements DependantChildComponent {

  childChanged = new EventEmitter<void>();

  constructor(autoCastType: string) {
    super(autoCastType);
  }
}
