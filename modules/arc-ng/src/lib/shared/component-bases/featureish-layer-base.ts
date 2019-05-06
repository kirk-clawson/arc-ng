import { AfterContentInit, ContentChildren, Input, QueryList } from '@angular/core';
import { combineLatest, Observable, race } from 'rxjs';
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
  get labelsChanged$(): Observable<LabelClassComponent[]> {
    const observables = [
      ...this.labelingInfo.map(lc => lc.childChanged),
      this.labelingInfo.changes
    ];
    return race(...observables).pipe(
      map(() => this.labelingInfo.toArray()),
      take(1),
    );
  }

  ngAfterContentInit() {
    this.getInstance$().pipe(
      take(1)
    ).subscribe(() => {
      if (this.instance.labelingInfo == null) this.instance.labelingInfo = [];
      this.setupLabelInstances(this.labelingInfo.toArray());
      this.setupLabelingWatcher();
    });
  }

  private setupLabelingWatcher(): void {
    this.labelsChanged$.subscribe(components => {
      this.instance.labelingInfo = [];
      this.setupLabelInstances(components);
      this.setupLabelingWatcher();
    });
  }

  private setupLabelInstances(childComponents: LabelClassComponent[]): void {
    const children = childComponents.map(lc => lc.getInstance$());
    combineLatest(children).pipe(
      take(1)
    ).subscribe(labels => {
      this.instance.labelingInfo.push(...labels);
    });
  }
}
