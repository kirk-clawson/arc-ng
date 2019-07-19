import { Directive, Input } from '@angular/core';
import { EsriAutoCastComponentBase } from '../../shared/component-bases/esri-auto-cast-component-base';

export type VariableTypes = 'color' | 'opacity' | 'rotation' | 'size';

@Directive({
  selector: 'visual-variable'
})
export class VisualVariableDirective extends EsriAutoCastComponentBase<__esri.VisualVariableProperties> {

  @Input()
  set variableType(value: VariableTypes) {
    this.changeField('type', value);
  }

  // @Input()

  constructor() {
    super('color');
  }

}
