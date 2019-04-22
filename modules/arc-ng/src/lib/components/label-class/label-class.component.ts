import { AfterContentInit, Component, ContentChild, Input } from '@angular/core';
import { EsriAsyncComponentBase } from '../../shared/esri-component-base';
import { LayerComponentBase } from '../../shared/layer-component-base';
import { LayerType, PointLabelPlacement, PolygonPointPlacement, PolylineLabelPlacement } from '../../shared/enums';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { TextSymbolDirective } from '../../directives/features/text-symbol.directive';

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
export class LabelClassComponent extends EsriAsyncComponentBase<__esri.LabelClass> implements AfterContentInit {
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
  private readonly parentLayerType: LayerType;

  @ContentChild(TextSymbolDirective)
  set textChild(value: TextSymbolDirective) {
    this.symbolComponent = value;
  }
  private symbolComponent: TextSymbolDirective;

  constructor(parent: LayerComponentBase<__esri.Layer>) {
    super();
    this.parentLayerType = parent.layerType;
  }

  ngAfterContentInit(): void {
    if (this.symbolComponent != null) {
      this.setAutoCastField('symbol', this.symbolComponent.createInstance());
    }
  }

  async createInstance(): Promise<__esri.LabelClass> {
    console.log('CI');
    type modules = [typeof import ('esri/layers/support/LabelClass')];
    const [ LabelClass ] = await loadEsriModules<modules>(['esri/layers/support/LabelClass']);
    const params = createCtorParameterObject<__esri.LabelClassProperties>(this);
    if (params.symbol == null) {
      params.symbol = DEFAULT_SYMBOL;
    }
    this.instance = new LabelClass(params);
    return this.instance;
  }
}
