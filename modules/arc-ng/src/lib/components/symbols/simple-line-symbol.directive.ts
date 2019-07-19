import { Directive, EventEmitter, Input, OnInit } from '@angular/core';
import { EsriComponentBase } from '../../shared/component-bases/esri-component-base';
import { DependantChildComponent } from '../../shared/dependant-child-component';
import { AutoCast, AutoCastColor } from '../../shared/type-utils';
import { EsriAutoCastComponentBase } from '../../shared/component-bases/esri-auto-cast-component-base';

@Directive({
  selector: 'simple-line-symbol'
})
export class SimpleLineSymbolDirective
  extends EsriAutoCastComponentBase<__esri.SimpleLineSymbolProperties>
  implements DependantChildComponent, OnInit {

  @Input()
  set color(value: AutoCastColor) {
    this.changeField('color', value);
  }

  @Input()
  set cap(value: __esri.SimpleLineSymbolProperties['cap']) {
    this.changeField('cap', value);
  }

  @Input()
  set join(value: __esri.SimpleLineSymbolProperties['join']) {
    this.changeField('join', value);
  }

  @Input()
  set miterLimit(value: number) {
    this.changeField('miterLimit', value);
  }

  @Input()
  set style(value: string) {
    this.changeField('style', value);
  }

  @Input()
  set width(value: number) {
    this.changeField('width', value);
  }

  constructor() {
    super('simple-line');
  }

  childChanged = new EventEmitter<void>();

  ngOnInit(): void {
  }

}
