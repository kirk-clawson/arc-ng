import e = __esri;

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

export type FeatureishLayerTypes = e.FeatureLayer | e.GeoJSONLayer | e.CSVLayer;
export type VisualLayerTypes = e.GraphicsLayer | FeatureishLayerTypes;
