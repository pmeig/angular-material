import {isNotBlank} from "@ngp/core";


export const stylesCss = (css: Record<string, string>) => checkCss(';', css, entry => `${entry[0]}: ${entry[1]}`)
export const classesCss = (css: Record<string, any>) => checkCss(' ', css, entry => entry[0]);

export const checkCss = (separator: ';' | ' ', record: Record<string, any>, mapper: (entry: [string, any]) => string) => Object.entries(record)
  .filter(value => isNotBlank(value[1]) && value[1])
  .map(value => mapper(value))
  .join(separator)
