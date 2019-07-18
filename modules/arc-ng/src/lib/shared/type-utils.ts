import e = __esri;
import { EventEmitter } from '@angular/core';
import { DependantChildComponent, EsriCloneable } from './dependant-child-component';

export type AutoCast<T> = T & { type: string };

export type AutoCastColor = AutoCast<e.Color> | string | number[];

function isAccessor(a: any): a is e.Accessor {
  return a.hasOwnProperty('declaredClass') &&
    a.declaredClass != null &&
    typeof a.declaredClass === 'string' &&
    a.declaredClass.startsWith('esri');
}

export function isExpandWidget(w: e.Widget): w is e.Expand {
  return w.declaredClass === 'esri.widgets.Expand';
}

export function isBasemap(b: any): b is e.Basemap {
  return isAccessor(b) && b.declaredClass === 'esri.Basemap';
}

export function isBasemapArray(b: any[]): b is e.Basemap[] {
  return isBasemap(b[0]);
}

export function isDependantChild(c: any): c is DependantChildComponent {
  return c.hasOwnProperty('childChanged') && c.childChanged instanceof EventEmitter;
}

export function isCloneable<T extends any>(c: any): c is EsriCloneable<T> {
  return c.clone != null && typeof c.clone === 'function';
}

export type FeatureishLayerTypes = e.FeatureLayer | e.GeoJSONLayer | e.CSVLayer;
export type FeatureishLayerConstructorTypes = e.FeatureLayerProperties | e.GeoJSONLayerProperties | e.CSVLayerProperties;
export type FeatureishLayerViewTypes = e.FeatureLayerView | e.GeoJSONLayerView | e.CSVLayerView;
export type VisualLayerTypes = e.GraphicsLayer | FeatureishLayerTypes;
export type VisualLayerConstructorTypes = e.GraphicsLayerProperties | FeatureishLayerConstructorTypes;
export type VisualLayerViewTypes = e.GraphicsLayerView | FeatureishLayerViewTypes;
