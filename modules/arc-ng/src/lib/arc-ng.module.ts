import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ArcNgComponent } from './arc-ng.component';
import * as esriLoader from 'esri-loader';
import { ILoadScriptOptions } from 'esri-loader';

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

@NgModule({
  declarations: [ArcNgComponent],
  imports: [
  ],
  exports: [ArcNgComponent]
})
export class ArcNgModule {

  constructor(@Optional() @SkipSelf() parentModule: ArcNgModule) {
    if (parentModule) {
      throw new Error('ArcNgModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(options?: ILoadScriptOptions): ModuleWithProviders {
    return {
      ngModule: ArcNgModule,
      providers: [
        { provide: loaderToken, useValue: options },
        { provide: APP_INITIALIZER, useFactory: init, multi: true, deps: [loaderToken] }
      ]
    };
  }
}
