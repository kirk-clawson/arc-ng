import { Directive, forwardRef, OnDestroy, OnInit, Optional } from '@angular/core';
import { take } from 'rxjs/operators';
import { ActionDispatcherService } from '../../services/action-dispatcher.service';
import { WidgetBase } from '../../shared/component-bases/widget-base';
import { loadEsriModules } from '../../shared/utils';
import { MapComponent } from '../map/map.component';
import { ExpandDirective } from './expand.directive';

@Directive({
  selector: 'layer-list',
  providers: [{ provide: WidgetBase, useExisting: forwardRef(() => LayerListDirective)}]
})
export class LayerListDirective extends WidgetBase<__esri.LayerList, __esri.LayerListProperties> implements OnInit, OnDestroy {

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
      this.initializer.view = view;
      this.initializer.listItemCreatedFunction = this.listItemCreated.bind(this);
      this.instance = new LayerListWidget(this.initializer);
      this.triggerHandle = this.instance.on('trigger-action', e => this.dispatcherService.toggleAction(e.action.id));
      if (this.expander != null) {
        await this.expander.createInstance(view, this.instance, localContainer);
        this.parent.attachWidget(this.expander.instance, this._uiPosition);
      } else {
        this.parent.attachWidget(this.instance, this._uiPosition);
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
