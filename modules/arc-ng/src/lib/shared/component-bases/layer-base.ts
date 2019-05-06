import { ContentChildren, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ActionDirective } from '../../components/support/action.directive';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { LayerType, ListMode } from '../enums';
import { EsriEventEmitter } from '../esri-emitters';
import { groupBy } from '../utils';
import { EsriEventedBase } from './esri-component-base';

export interface LayerViewEvent<T extends __esri.LayerView> {
  view: __esri.View;
  layerView: T;
}

export abstract class LayerBase<T extends __esri.Layer = __esri.Layer, V extends __esri.LayerView = __esri.LayerView>
  extends EsriEventedBase<T> implements OnDestroy {
  @Input()
  set id(value: string) {
    this.setField('id', value);
  }
  @Input()
  set listMode(value: ListMode) {
    this.setField('listMode', value);
  }
  @Input()
  set opacity(value: number) {
    this.setField('opacity', value);
  }
  @Input()
  set title(value: string) {
    this.setField('title', value);
  }
  @Input()
  set visible(value: boolean) {
    this.setField('visible', value);
  }

  @Output() layerViewCreated = new EsriEventEmitter<LayerViewEvent<V>>('layerview-create');
  @Output() layerViewDestroyed = new EsriEventEmitter<LayerViewEvent<V>>('layerview-destroyed');

  abstract layerType: LayerType;
  protected destroyed$ = new Subject();

  @ContentChildren(ActionDirective) actions: QueryList<ActionDirective>;

  constructor(dispatcher: ActionDispatcherService) {
    super();
    dispatcher.updateListItem$.pipe(
      filter(li => li.layer === this.instance),
      takeUntil(this.destroyed$)
    ).subscribe(li => this.createListItem(li));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.instance.destroy();
  }

  private createListItem(item: __esri.ListItem): void {
    const groups = groupBy(this.actions.toArray(), 'sectionNumber');
    const groupKeys: number[] = Array.from(groups.keys());
    groupKeys.sort();
    const result = [];
    for (const key of groupKeys) {
      const currentActions = groups.get(key);
      currentActions.sort((a, b) => a.sortOrder - b.sortOrder);
      result.push(currentActions.map(a => a.createInstance()));
    }
    item.actionsSections = result as any;
  }
}
