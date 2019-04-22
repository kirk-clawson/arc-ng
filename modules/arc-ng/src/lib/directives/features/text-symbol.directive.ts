/* tslint:disable:variable-name */
import { Directive, Input } from '@angular/core';
import { EsriAutoCastComponentBase } from '../../shared/esri-component-base';
import { AutoCastColor, autoCastToColor } from '../../shared/type-utils';
import { HorizontalAlignment, VerticalAlignment } from '../../shared/enums';
import { createCtorParameterObject, trimEmptyFields } from '../../shared/utils';

@Directive({
  selector: 'text-symbol'
})
export class TextSymbolDirective extends EsriAutoCastComponentBase<__esri.TextSymbol> {
  @Input()
  set angle(value: number) {
    this.setField('angle', value);
  }
  @Input()
  set backgroundColor(value: AutoCastColor) {
    this.setAutoCastField('backgroundColor', value);
  }
  @Input()
  set borderLineColor(value: AutoCastColor) {
    this.setAutoCastField('borderLineColor', value);
  }
  @Input()
  set borderLineSize(value: number) {
    this.setField('borderLineSize', value);
  }
  @Input()
  set color(value: AutoCastColor) {
    if (autoCastToColor(value)) this.setField('color', value);
  }
  @Input()
  set haloColor(value: AutoCastColor) {
    this.setAutoCastField('haloColor', value);
  }
  @Input()
  set haloSize(value: number) {
    this.setField('haloSize', value);
  }
  @Input()
  set horizontalAlignment(value: HorizontalAlignment) {
    this.setField('horizontalAlignment', value);
  }
  @Input()
  set kerning(value: boolean) {
    this.setField('kerning', value);
  }
  @Input()
  set rotated(value: boolean) {
    this.setField('rotated', value);
  }
  @Input()
  set text(value: string) {
    this.setField('text', value);
  }
  @Input()
  set verticalAlignment(value: VerticalAlignment) {
    this.setField('verticalAlignment', value);
  }
  @Input()
  set xOffset(value: number | string) {
    this.setAutoCastField('xoffset', value);
  }
  @Input()
  set yOffset(value: number | string) {
    this.setAutoCastField('yoffset', value);
  }

  @Input()
  set fontFamily(value: string) {
    this.__fontFamily = value;
  }
  @Input()
  set fontStyle(value: string) {
    this.__fontStyle = value;
  }
  @Input()
  set fontWeight(value: string) {
    this.__fontWeight = value;
  }
  @Input()
  set fontSize(value: number | string) {
    this.__fontSize = value;
  }
  private __fontFamily: string;
  private __fontStyle: string;
  private __fontWeight: string;
  private __fontSize: number | string;

  // noinspection JSUnusedLocalSymbols
  private _type = 'text';

  createInstance(): __esri.TextSymbolProperties {
    const result: any = createCtorParameterObject(this);
    result.font = trimEmptyFields({
      family: this.__fontFamily,
      style: this.__fontStyle,
      weight: this.__fontWeight,
      size: this.__fontSize
    });
    return result;
  }
}
