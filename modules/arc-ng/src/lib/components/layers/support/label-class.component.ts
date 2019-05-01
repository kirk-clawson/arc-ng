import { AfterContentInit, Component, ContentChild, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import { EsriAccessorBase } from '../../../shared/component-bases/esri-component-base';
import { LayerBase } from '../../../shared/component-bases/layer-base';
import { LayerType, PointLabelPlacement, PolygonPointPlacement, PolylineLabelPlacement } from '../../../shared/enums';
import { createCtorParameterObject, loadEsriModules } from '../../../shared/utils';
import { TextSymbolDirective } from '../../symbols/text-symbol.directive';

const DEFAULT_SYMBOL = {
  type: 'text',  // auto casts as new TextSymbol()
  color: 'white',
  haloColor: 'black',
  haloSize: '1px',
  xoffset: 3,
  yoffset: 3,
  font: {  // auto cast as new Font()
    size: 12,
    family: 'sans-serif',
    weight: 'bold'
  }
};

@Component({
  selector: 'label-class',
  template: '<ng-content></ng-content>'
})
export class LabelClassComponent extends EsriAccessorBase<__esri.LabelClass> implements AfterContentInit {
  @Input()
  set expression(value: string) {
    if (this.__expression !== value) {
      this.__expression = value;
      switch (this.parentLayerType) {
        case LayerType.FeatureLayer:
          this.setField('labelExpressionInfo', { expression: value });
          break;
        case LayerType.MapImageLayer:
          this.setField('labelExpression', value);
          break;
      }
    }
  }
  @Input()
  set labelPlacement(value: PointLabelPlacement | PolylineLabelPlacement | PolygonPointPlacement) {
    this.setField('labelPlacement', value);
  }
  @Input()
  set maxScale(value: number) {
    this.setField('maxScale', value);
  }
  @Input()
  set minScale(value: number) {
    this.setField('minScale', value);
  }
  @Input()
  set symbol(value: __esri.TextSymbolProperties | __esri.LabelSymbol3DProperties) {
    this.setAutoCastField('symbol', value);
  }
  @Input()
  set useCodedValues(value: boolean) {
    this.setField('useCodedValues', value);
  }
  @Input()
  set where(value: string) {
    this.setField('where', value);
  }

  // tslint:disable-next-line:variable-name
  private __expression: string;
  private textDirective: TextSymbolDirective;
  private readonly parentLayerType: LayerType;

  @ContentChild(TextSymbolDirective)
  set textChild(value: TextSymbolDirective) {
    this.textDirective = value;
  }

  constructor(parent: LayerBase) {
    super();
    this.parentLayerType = parent.layerType;
  }

  async ngAfterContentInit() {
    type modules = [typeof import ('esri/layers/support/LabelClass')];
    const [ LabelClass ] = await loadEsriModules<modules>(['esri/layers/support/LabelClass']);
    this.textDirective.getInstance$().pipe(
      take(1)
    ).subscribe(() => {
      const params = createCtorParameterObject<__esri.LabelClassProperties>(this);
      params.symbol = this.textDirective.instance || DEFAULT_SYMBOL;
      this.instance = new LabelClass(params);
    });
  }
}
