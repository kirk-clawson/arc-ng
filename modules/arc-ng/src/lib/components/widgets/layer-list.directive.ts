import { Directive, forwardRef, OnDestroy, OnInit, Optional } from '@angular/core';
import { take } from 'rxjs/operators';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { WidgetComponentBase } from '../../shared/widget-component-base';
import { MapComponent } from '../map/map.component';
import { ExpandDirective } from './expand.directive';

@Directive({
  selector: 'layer-list',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => LayerListDirective)}]
})
export class LayerListDirective extends WidgetComponentBase<__esri.LayerList> implements OnInit, OnDestroy {

  private triggerHandle: IHandle;

  constructor(private parent: MapComponent,
              private dispatcherService: ActionDispatcherService,
              @Optional() private expander?: ExpandDirective) {
    super();
  }

  async ngOnInit() {
    type modules = [typeof import ('esri/widgets/LayerList')];
    const [ LayerListWidget ] = await loadEsriModules<modules>(['esri/widgets/LayerList']);

    this.parent.getInstance$().pipe(
      take(1)
    ).subscribe(async view => {
      // tslint:disable-next-line:no-string-literal
      const localContainer = this['_container'];
      if (this.expander != null) {
        this.container = document.createElement('div');
      }
      const params: __esri.LayerListProperties = createCtorParameterObject(this);
      params.view = view;
      params.listItemCreatedFunction = this.listItemCreated.bind(this);
      this.instance = new LayerListWidget(params);
      this.triggerHandle = this.instance.on('trigger-action', e => this.dispatcherService.toggleAction(e.action.id));
      if (this.expander != null) {
        await this.expander.createInstance(view, this.instance, localContainer);
        this.parent.attachWidget(this.expander.instance, this.__uiPosition);
      } else {
        this.parent.attachWidget(this.instance, this.__uiPosition);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.triggerHandle) this.triggerHandle.remove();
    if (this.expander != null) {
      this.parent.detachWidget(this.expander.instance);
    } else {
      this.parent.detachWidget(this.instance);
    }
    this.instance.destroy();
  }

  private listItemCreated(event: { item: __esri.ListItem }): void {
    this.dispatcherService.updateListItem(event.item);
  }
}
