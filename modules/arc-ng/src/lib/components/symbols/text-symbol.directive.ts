/* tslint:disable:variable-name */
import { Directive, Input, OnInit } from '@angular/core';
import { EsriComponentBase } from '../../shared/component-bases/esri-component-base';
import { HorizontalAlignment, VerticalAlignment } from '../../shared/enums';
import { AutoCastColor, EsriAutoCast } from '../../shared/type-utils';
import { createCtorParameterObject, trimEmptyFields } from '../../shared/utils';

@Directive({
  selector: 'text-symbol'
})
export class TextSymbolDirective extends EsriComponentBase<EsriAutoCast<__esri.TextSymbol>> implements OnInit {
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
    this.setAutoCastField('color', value);
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

  ngOnInit(): void {
    const result: any = createCtorParameterObject(this);
    result.font = trimEmptyFields({
      family: this.__fontFamily,
      style: this.__fontStyle,
      weight: this.__fontWeight,
      size: this.__fontSize
    });
    this.instance = result;
  }
}
