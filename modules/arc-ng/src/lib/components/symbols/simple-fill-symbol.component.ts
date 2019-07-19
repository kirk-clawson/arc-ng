import { AfterContentInit, AfterViewInit, Component, ContentChild, EventEmitter, Input } from '@angular/core';
import { EsriAutoCastComponentBase } from '../../shared/component-bases/esri-auto-cast-component-base';
import { DependantChildComponent } from '../../shared/dependant-child-component';
import { SimpleLineSymbolDirective } from './simple-line-symbol.directive';
import { AutoCastColor } from '../../shared/type-utils';

export type FillStyles =
  'backward-diagonal' | 'cross' | 'diagonal-cross' |
  'forward-diagonal' | 'horizontal' | 'none' |
  'solid' | 'vertical';

@Component({
  selector: 'simple-fill-symbol',
  template: '<ng-content></ng-content>'
})
export class SimpleFillSymbolComponent
  extends EsriAutoCastComponentBase<__esri.SimpleFillSymbolProperties>
  implements DependantChildComponent, AfterViewInit {

  @Input()
  set color(value: AutoCastColor) {
    this.changeField('color', value);
  }

  @Input()
  set fillStyle(value: FillStyles) {
    this.changeField('style', value);
  }

  @ContentChild(SimpleLineSymbolDirective, { static: true })
  set textChild(value: SimpleLineSymbolDirective) {
    this.lineDirective = value;
  }

  childChanged = new EventEmitter<void>();
  private lineDirective: SimpleLineSymbolDirective;

  constructor() {
    super('simple-fill');
  }

  ngAfterViewInit(): void {
    this.instance.outline = this.lineDirective.instance;
    this.lineDirective.childChanged.subscribe(() => this.changeField('outline', this.lineDirective.instance));
  }

}
