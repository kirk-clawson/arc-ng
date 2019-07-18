import { AfterContentInit, Component, ContentChild, EventEmitter, Input } from '@angular/core';
import { EsriAutoCastComponentBase } from '../../shared/component-bases/esri-auto-cast-component-base';
import { DependantChildComponent } from '../../shared/dependant-child-component';
import { SimpleLineSymbolDirective } from './simple-line-symbol.directive';
import { AutoCastColor } from '../../shared/type-utils';

@Component({
  selector: 'simple-fill-symbol',
  template: '<ng-content></ng-content>'
})
export class SimpleFillSymbolComponent
  extends EsriAutoCastComponentBase<__esri.SimpleFillSymbolProperties>
  implements DependantChildComponent, AfterContentInit {

  @Input()
  set color(value: AutoCastColor) {
    this.changeField('color', value);
  }

  @Input()
  set style(value: string) {
    this.changeField('style', value);
  }

  @ContentChild(SimpleLineSymbolDirective, { static: true })
  set textChild(value: SimpleLineSymbolDirective) {
    this.lineDirective = value;
  }

  childChanged: EventEmitter<void>;
  private lineDirective: SimpleLineSymbolDirective;

  constructor() {
    super('simple-fill');
  }

  ngAfterContentInit(): void {
    this.instance.outline = this.lineDirective.instance;
    this.lineDirective.childChanged.subscribe(() => this.changeField('outline', this.lineDirective.instance));
  }

}
