import { Directive, EventEmitter, Input } from '@angular/core';
import { DependantChildComponent } from '../../shared/dependant-child-component';
import { HorizontalAlignment, VerticalAlignment } from '../../shared/enums';
import { AutoCastColor } from '../../shared/type-utils';
import { EsriAutoCastComponentBase } from '../../shared/component-bases/esri-auto-cast-component-base';

@Directive({
  selector: 'text-symbol'
})
export class TextSymbolDirective
  extends EsriAutoCastComponentBase<__esri.TextSymbolProperties>
  implements DependantChildComponent {
  @Input()
  set angle(value: number) {
    this.changeField('angle', value);
  }
  @Input()
  set backgroundColor(value: AutoCastColor) {
    this.changeField('backgroundColor', value);
  }
  @Input()
  set borderLineColor(value: AutoCastColor) {
    this.changeField('borderLineColor', value);
  }
  @Input()
  set borderLineSize(value: number) {
    this.changeField('borderLineSize', value);
  }
  @Input()
  set color(value: AutoCastColor) {
    this.changeField('color', value);
  }
  @Input()
  set haloColor(value: AutoCastColor) {
    this.changeField('haloColor', value);
  }
  @Input()
  set haloSize(value: number | string) {
    this.changeField('haloSize', value);
  }
  @Input()
  set horizontalAlignment(value: HorizontalAlignment) {
    this.changeField('horizontalAlignment', value);
  }
  @Input()
  set kerning(value: boolean) {
    this.changeField('kerning', value);
  }
  @Input()
  set rotated(value: boolean) {
    this.changeField('rotated', value);
  }
  @Input()
  set text(value: string) {
    this.changeField('text', value);
  }
  @Input()
  set verticalAlignment(value: VerticalAlignment) {
    this.changeField('verticalAlignment', value);
  }
  @Input()
  set xOffset(value: number | string) {
    this.changeField('xoffset', value);
  }
  @Input()
  set yOffset(value: number | string) {
    this.changeField('xoffset', value);
  }

  @Input()
  set fontFamily(value: string) {
    const newFont: __esri.FontProperties = { ...this.instance.font, family: value };
    this.changeField('font', newFont);
  }
  @Input()
  set fontStyle(value: __esri.FontProperties['style']) {
    const newFont: __esri.FontProperties = { ...this.instance.font, style: value };
    this.changeField('font', newFont);
  }
  @Input()
  set fontWeight(value: __esri.FontProperties['weight']) {
    const newFont: __esri.FontProperties = { ...this.instance.font, weight: value };
    this.changeField('font', newFont);
  }
  @Input()
  set fontSize(value: number | string) {
    const newFont: __esri.FontProperties = { ...this.instance.font, size: value };
    this.changeField('font', newFont);
  }
  @Input()
  set fontDecoration(value: __esri.FontProperties['decoration']) {
    const newFont: __esri.FontProperties = { ...this.instance.font, decoration: value };
    this.changeField('font', newFont);
  }

  childChanged = new EventEmitter<void>();

  constructor() {
    super('text');
  }
}
