import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import * as esriLoader from 'esri-loader';
import { ILoadScriptOptions } from 'esri-loader';
import { MapComponent } from './components/map/map.component';
import { BasemapGalleryDirective } from './components/widgets/basemap-gallery.directive';
import { ExpandComponent } from './components/widgets/expand.component';
import { FeatureLayerComponent } from './components/layers/feature-layer.component';
import { LayerListDirective } from './components/widgets/layer-list.directive';
import { GroupLayerComponent } from './components/layers/group-layer.component';
import { LabelClassComponent } from './components/layers/support/label-class.component';
import { TextSymbolDirective } from './components/symbols/text-symbol.directive';
import { ActionDirective } from './components/support/action.directive';

const loaderToken = new InjectionToken<ILoadScriptOptions>('ILoadScriptOptions');

export function init(config: ILoadScriptOptions) {
  return async () => {
    try {
      await esriLoader.loadScript(config);
      console.log('Main ArcGIS script loaded');
    } catch (e) {
      console.error('There was an error during the Esri Api bootstrapping process', e);
    }
  };
}

const publicComponents = [
  MapComponent,
  BasemapGalleryDirective,
  ExpandComponent,
  FeatureLayerComponent,
  LayerListDirective,
  GroupLayerComponent,
  LabelClassComponent,
  TextSymbolDirective,
  ActionDirective
];

@NgModule({
  declarations: publicComponents,
  imports: [],
  exports: publicComponents
})
export class ArcNgModule {

  constructor(@Optional() @SkipSelf() parentModule: ArcNgModule) {
    if (parentModule) {
      throw new Error('ArcNgModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(options?: ILoadScriptOptions): ModuleWithProviders<ArcNgModule> {
    return {
      ngModule: ArcNgModule,
      providers: [
        { provide: loaderToken, useValue: options },
        { provide: APP_INITIALIZER, useFactory: init, multi: true, deps: [loaderToken] }
      ]
    };
  }
}
