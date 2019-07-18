import { AfterContentInit, ContentChildren, Input, QueryList } from '@angular/core';
import { combineLatest, Observable, race } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LabelClassComponent } from '../../components/layers/support/label-class.component';
import { FeatureishLayerConstructorTypes, FeatureishLayerTypes, FeatureishLayerViewTypes } from '../type-utils';
import { VisualLayerBase } from './visual-layer-base';

export abstract class FeatureishLayerBase<T extends FeatureishLayerTypes,
                                          V extends FeatureishLayerViewTypes,
                                          C extends FeatureishLayerConstructorTypes>
  extends VisualLayerBase<T, V, C>
  implements AfterContentInit {
  @Input()
  set copyright(value: string) {
    if (this.instance == null) {
      this.initializeField('copyright', value);
    } else {
      this.changeField('copyright', value);
    }
  }
  @Input()
  set definitionExpression(value: string) {
    if (this.instance == null) {
      this.initializeField('definitionExpression', value);
    } else {
      this.changeField('definitionExpression', value);
    }
  }
  @Input()
  set labelsVisible(value: boolean) {
    if (this.instance == null) {
      this.initializeField('labelsVisible', value);
    } else {
      this.changeField('labelsVisible', value);
    }
  }
  @Input()
  set objectIdField(value: string) {
    if (this.instance == null) {
      this.initializeField('objectIdField', value);
    } else {
      this.changeField('objectIdField', value);
    }
  }
  @Input()
  set popupEnabled(value: boolean) {
    if (this.instance == null) {
      this.initializeField('popupEnabled', value);
    } else {
      this.changeField('popupEnabled', value);
    }
  }
  @Input()
  set spatialReference(value: __esri.SpatialReferenceProperties) {
    this.initOrChangeConstructedField('spatialReference', value, 'esri/geometry/SpatialReference');
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
