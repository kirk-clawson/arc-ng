import { AfterContentInit, ContentChildren, Input, QueryList } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LabelClassComponent } from '../../components/layers/support/label-class.component';
import { FeatureishLayerTypes } from '../type-utils';
import { VisualLayerBase } from './visual-layer-base';

export abstract class FeatureishLayerBase<T extends FeatureishLayerTypes, V extends __esri.LayerView>
  extends VisualLayerBase<T, V>
  implements AfterContentInit {
  @Input()
  set copyright(value: string) {
    this.setField('copyright', value);
  }
  @Input()
  set definitionExpression(value: string) {
    this.setField('definitionExpression', value);
  }
  @Input()
  set labelsVisible(value: boolean) {
    this.setField('labelsVisible', value);
  }
  @Input()
  set objectIdField(value: string) {
    this.setField('objectIdField', value);
  }
  @Input()
  set popupEnabled(value: boolean) {
    this.setField('popupEnabled', value);
  }
  @Input()
  set spatialReference(value: __esri.SpatialReference) {
    this.setField('spatialReference', value);
  }

  @ContentChildren(LabelClassComponent) labelingInfo: QueryList<LabelClassComponent>;

  ngAfterContentInit() {
    this.getInstance$().pipe(
      take(1)
    ).subscribe(() => {
      const labels = this.labelingInfo.map(lc => lc.getInstance$());
      if (this.instance.labelingInfo == null) this.instance.labelingInfo = [];
      this.setupLabelInstances(labels);
      this.setupLabelingWatcher();
    });
  }

  private setupLabelingWatcher(): void {
    this.labelingInfo.changes.pipe(
      map((labelComponents: LabelClassComponent[]) => labelComponents.map(lc => lc.getInstance$()))
    ).subscribe(labels => {
      this.instance.labelingInfo = [];
      this.setupLabelInstances(labels);
    });
  }

  private setupLabelInstances(children: Observable<__esri.LabelClass>[]): void {
    combineLatest(children).pipe(take(1)).subscribe(labels => this.instance.labelingInfo.push(...labels));
  }
}
