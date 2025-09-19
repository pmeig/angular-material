import { isBlank, Nullable } from '@pmeig/ng-core';

export type ColorAttribute = Nullable<Color | RGB | string>
export type Color = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'secondary';

export interface RGB {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

export interface ColorConfig {
  style: ColorAttribute;
  rgb?: string;
  color?: string;
}

export const isColor = (color: ColorAttribute): color is Color => color === 'dark' || color === 'info'
  || color === 'light' || color === 'danger' || color === 'primary'
  || color === 'success' || color === 'warning' || color === 'secondary';
export const colorAttributeToString = (colorAttribute: ColorAttribute, prefix?: string) => {
  if (isBlank(colorAttribute)) {
    return '';
  }
  if (isColor(colorAttribute)) {
    return colorToString(colorAttribute, prefix);
  }
  return rgbToString(toRGB(colorAttribute));
};
export const colorToString = (color: Nullable<Color>, prefix?: string) => {
  if (isBlank(color)) {
    return '';
  }
  return `${prefix ? `${prefix}-` : ''}${color}`;
};
export const toRGB = (rgb: string | RGB | undefined) => typeof rgb === 'string'
  ? rgb.startsWith('{')
    ? JSON.parse(rgb) as RGB
    : undefined
  : rgb;
export const rgbToString = (rgb: RGB | undefined) => {
  if (rgb) {
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${rgb.alpha || 1})`;
  }
  return '';
};

export const colorAttribute = (color: ColorAttribute, prefix?: string): ColorConfig =>  {
  if (isBlank(color)) {
    return {
      style: color,
    };
  }
  if (isColor(color)) {
    return {
      color: colorAttributeToString(color, prefix),
      style: color
    };
  }
  const rgb = toRGB(color);
  return {
    rgb: rgbToString(rgb),
    style: color
  }
}
