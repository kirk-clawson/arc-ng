import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArcNgModule } from 'arc-ng';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ArcNgModule.forRoot({ css: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
