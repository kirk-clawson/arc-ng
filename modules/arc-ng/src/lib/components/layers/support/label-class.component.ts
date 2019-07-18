import { AfterContentInit, Component, ContentChild, EventEmitter, Input } from '@angular/core';
import { EsriEventedBase } from '../../../shared/component-bases/esri-component-base';
import { LayerBase } from '../../../shared/component-bases/layer-base';
import { DependantChildComponent } from '../../../shared/dependant-child-component';
import { LayerType, PointLabelPlacement, PolygonPointPlacement, PolylineLabelPlacement } from '../../../shared/enums';
import { loadEsriModules } from '../../../shared/utils';
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
export class LabelClassComponent
  extends EsriEventedBase<__esri.LabelClass, __esri.LabelClassProperties>
  implements AfterContentInit, DependantChildComponent {

  @Input()
  set expression(value: string) {
    switch (this.parentLayerType) {
      case LayerType.GeoJSONLayer:
      case LayerType.FeatureLayer:
        this.initOrChangeValueField('labelExpressionInfo', { expression: value });
        break;
      case LayerType.MapImageLayer:
        this.initOrChangeValueField('labelExpression', value);
        break;
    }
  }
  @Input()
  set labelPlacement(value: PointLabelPlacement | PolylineLabelPlacement | PolygonPointPlacement) {
    this.initOrChangeValueField('labelPlacement', value);
  }
  @Input()
  set maxScale(value: number) {
    this.initOrChangeValueField('maxScale', value);
  }
  @Input()
  set minScale(value: number) {
    this.initOrChangeValueField('minScale', value);
  }
  @Input()
  set symbol(value: __esri.TextSymbolProperties) {
    // TODO: add 3D capability
    this.initOrChangeConstructedField('symbol', value, 'esri/symbols/TextSymbol');
  }
  @Input()
  set useCodedValues(value: boolean) {
    this.initOrChangeValueField('useCodedValues', value);
  }
  @Input()
  set where(value: string) {
    this.initOrChangeValueField('where', value);
  }

  private textDirective: TextSymbolDirective;
  private readonly parentLayerType: LayerType;

  childChanged = new EventEmitter<void>();

  @ContentChild(TextSymbolDirective, { static: true })
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

    this.initializer.symbol = this.textDirective.instance || DEFAULT_SYMBOL;
    this.instance = new LabelClass(this.initializer);
    this.textDirective.childChanged.subscribe(() => this.childChanged.emit());
  }
}
