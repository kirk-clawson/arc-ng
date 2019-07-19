import {
  AfterViewInit,
  Component,
  ContentChild,
  forwardRef,
  Input
} from '@angular/core';
import { SimpleFillSymbolComponent } from '../../symbols/simple-fill-symbol.component';
import { RendererBaseComponent } from './renderer-base.component';

@Component({
  selector: 'simple-renderer',
  template: '<ng-content></ng-content>',
  providers: [{ provide: RendererBaseComponent, useExisting: forwardRef(() => SimpleRendererComponent)}]
})
export class SimpleRendererComponent
  extends RendererBaseComponent<__esri.SimpleRendererProperties>
  implements AfterViewInit  {

  @Input()
  set label(value: string) {
    this.changeField('label', value);
  }

  @ContentChild(SimpleFillSymbolComponent, { static: false })
  set fillChild(value: SimpleFillSymbolComponent) {
    this.fillComponent = value;
    this.changeField('symbol', value.instance);
  }

  private fillComponent: SimpleFillSymbolComponent;

  constructor() {
    super('simple');
  }

  ngAfterViewInit(): void {
    this.changeField('symbol', this.fillComponent.instance);
    this.fillComponent.childChanged.subscribe(() => this.changeField('symbol', this.fillComponent.instance));
  }
}
