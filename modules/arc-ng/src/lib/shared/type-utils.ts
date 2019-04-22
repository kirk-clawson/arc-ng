export type ColorNumericArray = [number, number, number] | [number, number, number, number];
export interface ColorRGBA { r: number; g: number; b: number; a?: number; }
export type AutoCastColor = __esri.Color | string | ColorNumericArray | ColorRGBA;

export function autoCastToColor(c: AutoCastColor): c is __esri.Color {
  return true;
}
