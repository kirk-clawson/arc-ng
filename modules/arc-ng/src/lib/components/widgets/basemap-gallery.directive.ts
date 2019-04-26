import { Directive, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { WidgetComponentBase } from '../../shared/widget-component-base';
import { createCtorParameterObject, loadEsriModules } from '../../shared/utils';
import { IconClass } from '../../shared/enums';
import { EsriWatchEmitter } from '../../shared/esri-watch-emitter';
import { ViewContainer, viewContainerToken } from '../../shared/esri-component-base';
import { take } from 'rxjs/operators';
import { ExpandDirective } from './expand.directive';

@Directive({
  selector: 'basemap-gallery',
  providers: [{ provide: WidgetComponentBase, useExisting: forwardRef(() => BasemapGalleryDirective)}]
})
export class BasemapGalleryDirective extends WidgetComponentBase<__esri.BasemapGallery> implements OnInit, OnDestroy {
  @Input()
  set label(value: string) {
    this.setField('label', value);
  }
  @Input()
  set iconClass(value: IconClass) {
    this.setField('iconClass', value);
  }
  @Input()
  set activeBasemap(value: __esri.Basemap) {
    this.setField('activeBasemap', value);
  }
  @Output() activeBasemapChange = new EsriWatchEmitter<__esri.Basemap>('activeBasemap');

  constructor(@Inject(viewContainerToken) private viewContainer: ViewContainer, @Optional() private expander?: ExpandDirective) {
    super();
  }

  async ngOnInit() {
    type modules = [typeof import ('esri/widgets/BasemapGallery')];
    const [ BaseMapGallery ] = await loadEsriModules<modules>(['esri/widgets/BasemapGallery']);

    this.viewContainer.viewConstructed$.pipe(
      take(1)
    ).subscribe(async view => {
      // tslint:disable-next-line:no-string-literal
      const localContainer = this['_container'];
      if (this.expander != null) {
        this.container = document.createElement('div');
      }
      const params = createCtorParameterObject<__esri.BasemapGalleryProperties>(this);
      params.view = view;
      this.instance = new BaseMapGallery(params);
      this.createWatchedHandlers();
      if (this.expander != null) {
        const expander = await this.expander.createInstance(view, this.instance, localContainer);
        view.ui.add(expander, this.getPosition());
      } else {
        view.ui.add(this.instance, this.getPosition());
      }
    });
  }

  ngOnDestroy(): void {
    this.instance.destroy();
  }
}
