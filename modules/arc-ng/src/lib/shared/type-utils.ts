export type ColorNumericArray = [number, number, number] | [number, number, number, number];
export interface ColorRGBA { r: number; g: number; b: number; a?: number; }
export type AutocastColor = __esri.Color | string | ColorNumericArray | ColorRGBA;
