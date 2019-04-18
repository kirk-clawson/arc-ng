export type UIPositions = 'bottom-leading' | 'bottom-left' | 'bottom-right' | 'bottom-trailing' |
                          'top-leading' | 'top-left' | 'top-right' | 'top-trailing' | 'manual';

export abstract class MapChildBase {
  abstract initMap(parent: __esri.MapView);
}

export abstract class LayerChildComponentBase {
  abstract initLayer(parent: __esri.GroupLayer);
}
