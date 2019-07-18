import { AfterContentInit, Component, ContentChild, EventEmitter, Input } from '@angular/core';
import { EsriAutoCastComponentBase } from '../../../shared/component-bases/esri-auto-cast-component-base';
import { DependantChildComponent } from '../../../shared/dependant-child-component';
import { SimpleFillSymbolComponent } from '../../symbols/simple-fill-symbol.component';

@Component({
  selector: 'simple-renderer',
  template: '<ng-content></ng-content>'
})
export class SimpleRendererComponent
  extends EsriAutoCastComponentBase<__esri.SimpleRendererProperties>
  implements DependantChildComponent, AfterContentInit  {

  @Input()
  set label(value: string) {
    this.changeField('label', value);
  }

  @ContentChild(SimpleFillSymbolComponent, { static: true })
  set textChild(value: SimpleFillSymbolComponent) {
    this.fillComponent = value;
    this.changeField('symbol', value.instance);
  }

  private fillComponent: SimpleFillSymbolComponent;
  childChanged: EventEmitter<void>;

  constructor() {
    super('simple-renderer');
  }

  ngAfterContentInit(): void {
    this.changeField('symbol', this.fillComponent.instance);
    this.fillComponent.childChanged.subscribe(() => this.changeField('symbol', this.fillComponent.instance));
  }
}
