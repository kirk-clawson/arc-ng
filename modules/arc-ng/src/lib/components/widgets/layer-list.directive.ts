import { Directive, forwardRef, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { WidgetComponentBase } from '../../shared/widget-component-base';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { ViewContainer, viewContainerToken } from '../../shared/esri-component-base';
import { take } from 'rxjs/operators';
import { ExpandDirective } from './expand.directive';

@Directive({
  selector: 'layer-list',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => LayerListDirective)}]
})
export class LayerListDirective extends WidgetComponentBase<__esri.LayerList> implements OnInit, OnDestroy {

  private triggerHandle: IHandle;

  constructor(@Inject(viewContainerToken) private viewContainer: ViewContainer,
              private dispatcherService: ActionDispatcherService,
              @Optional() private expander?: ExpandDirective) {
    super();
  }

  async ngOnInit() {
    type modules = [typeof import ('esri/widgets/LayerList')];
    const [ LayerListWidget ] = await loadEsriModules<modules>(['esri/widgets/LayerList']);

    this.viewContainer.viewConstructed$.pipe(
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
        const expander = await this.expander.createInstance(view, this.instance, localContainer);
        view.ui.add(expander, this.getPosition());
      } else {
        view.ui.add(this.instance, this.getPosition());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.triggerHandle) this.triggerHandle.remove();
    this.instance.destroy();
  }

  private listItemCreated(event: { item: __esri.ListItem }): void {
    this.dispatcherService.updateListItem(event.item);
  }
}
