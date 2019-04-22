import { Directive, forwardRef, OnDestroy } from '@angular/core';
import { WidgetComponentBase } from '../../shared/widget-component-base';
import { loadEsriModules } from '../../shared/utils';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';

@Directive({
  selector: 'layer-list',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => LayerListDirective)}]
})
export class LayerListDirective extends WidgetComponentBase<__esri.LayerList> implements OnDestroy {

  private triggerHandle: IHandle;

  constructor(private dispatcherService: ActionDispatcherService) {
    super();
  }

  ngOnDestroy(): void {
    if (this.triggerHandle) this.triggerHandle.remove();
  }

  async createWidget(view: __esri.MapView, isHidden?: boolean): Promise<__esri.LayerList> {
    type modules = [typeof import ('esri/widgets/LayerList')];
    const [ LayerListWidget ] = await loadEsriModules<modules>(['esri/widgets/LayerList']);
    const params: __esri.LayerListProperties = { view };
    params.listItemCreatedFunction = this.listItemCreated.bind(this);
    if (isHidden) {
      params.container = document.createElement('div');
    }
    this.instance = new LayerListWidget(params);
    this.triggerHandle = this.instance.on('trigger-action', e => this.dispatcherService.toggleAction(e.action.id));
    return this.instance;
  }

  private listItemCreated(event: { item: __esri.ListItem }): void {
    this.dispatcherService.updateListItem(event.item);
  }
}
