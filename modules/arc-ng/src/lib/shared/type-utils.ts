import e = __esri;
import { EventEmitter } from '@angular/core';
import { DependantChildComponent, EsriCloneable } from './dependant-child-component';

/* tslint:disable:no-shadowed-variable */

export type EsriAutoCast<T> =
  T extends e.Color ? e.Color | string | number[] | ColorRGBA :
  T extends e.Basemap ? e.BasemapProperties | string :
  T extends e.Point ? e.PointProperties | number[] :
  T extends e.SpatialReference ? e.SpatialReferenceProperties :
  T extends e.Popup ? e.PopupProperties :
  T extends e.Extent ? e.ExtentProperties :
  T extends e.PortalItem ? e.PortalItemProperties :
  T extends e.TextSymbol ? e.TextSymbol | e.TextSymbolProperties :
  T extends e.LabelSymbol3D ? e.LabelSymbol3DProperties :
  T;

export interface ColorRGBA { r: number; g: number; b: number; a?: number; }
export type AutoCastColor = e.Color | string | number[] | ColorRGBA;

export function isExpandWidget(w: e.Widget): w is e.Expand {
  return w.declaredClass === 'esri.widgets.Expand';
}

export function isDependantChild(c: any): c is DependantChildComponent {
  return c.hasOwnProperty('childChanged') && c.childChanged instanceof EventEmitter;
}

export function isCloneable<T extends any>(c: any): c is EsriCloneable<T> {
  return c.clone != null && typeof c.clone === 'function';
}

export type FeatureishLayerTypes = e.FeatureLayer | e.GeoJSONLayer | e.CSVLayer;
export type VisualLayerTypes = e.GraphicsLayer | FeatureishLayerTypes;
