import { leftPad, NgpDate, ngpDateObjectToDate, NgpDatePipe, NgpDateTime, NgpTime, Optional } from '@pmeig/ng-core';
import { InputValue, InputWeek } from './directive/b-input.directive';
import { RGB } from '@pmeig/ng-material-core';

export type InputValueType = 'ts-date' | 'ngp-date' | 'rgb';

export interface InputMapper {
  input: (item: InputValue) => string;
  value: () => Optional<InputValue>;
}

export const findMapper = (
  valueType: InputValueType,
  input: HTMLInputElement,
  dateParser?: NgpDatePipe,
): InputMapper => {
  switch (input.type) {
    case 'checkbox':
    case 'radio':
      return {
        input: (item) => (item ? JSON.stringify(item) : 'false'),
        value: () => input.checked,
      };
    case 'date':
    case 'datetime-local':
    case 'time':
      return transformSimpleInputDate(
        valueType as 'ts-date' | 'ngp-date',
        input,
        dateParser!!,
      );
    case 'month': {
      if (valueType === 'ngp-date') {
        return mapperMonthNgpDate(input);
      }
      return {
        input: (item) => {
          const date = item as Date | undefined;
          if (date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}`;
          }
          return '';
        },
        value: () => input.valueAsDate,
      };
    }
    case 'week':
      return mapperForWeek(valueType, input, dateParser!!);
    case 'color':
      return mapperForColor(valueType, input);
    default:
      return {
        input: (item) => (item as any).toString(),
        value: () => input.value,
      };
  }
};

const transformSimpleInputDate = (
  dateType: 'ts-date' | 'ngp-date',
  input: HTMLInputElement,
  dateParser: NgpDatePipe,
): InputMapper => {
  let transformDateToDate = (date: Date | undefined | null) =>
    date as Date | undefined | NgpDateTime;
  const type = input.type.replace('-local', '') as 'date' | 'datetime' | 'time';
  if (dateType === 'ngp-date') {
    transformDateToDate = (date) =>
      dateParser.transform(date, 'struct=ngp-date', `type=${type}`) as
        | Date
        | NgpDateTime
        | undefined;
  }
  const value = () => transformDateToDate(input.valueAsDate);
  return {
    input: (item) =>
      dateParser.transform(
        item as Optional<Date | NgpDateTime | NgpDate | NgpTime>,
        `type=${type}`,
        `struct=${dateType}`,
        'format=json',
      ) as string,
    value,
  };
};

const mapperMonthNgpDate = (input: HTMLInputElement): InputMapper => ({
  input: (item) => {
    const date = item as NgpDate | undefined;
    if (!date) return '';
    return `${date.year}-${leftPad(date.month, '0', 2)}`;
  },
  value: () => {
    const date = input.value.split('-');
    if (date.length > 1) {
      return {
        year: parseInt(date[0]),
        month: parseInt(date[1]),
      };
    }
    return undefined;
  },
});

const toNumberWeek = (week: InputWeek): InputWeek | undefined => {
  const monday =
    week.monday instanceof Date
      ? week.monday
      : ngpDateObjectToDate(week.monday!!);
  const firstDayOfYear = new Date(monday.getFullYear(), 0, 1);
  return {
    year: monday.getUTCFullYear(),
    week: (monday.getTime() - firstDayOfYear.getTime()) / 7,
  };
};

const mapperForWeek = (
  valueType: InputValueType,
  element: HTMLInputElement,
  dateParser: NgpDatePipe,
): InputMapper => {
  const input: (item: InputValue) => string = (item) => {
    let week = item as InputWeek | undefined;
    if (week?.monday && week?.sunday) {
      week = toNumberWeek(week);
    }
    if (!week) {
      return '';
    }

    if (week.week && week.year) {
      return `${week.year}-W${week.week}`;
    }
    return '';
  };

  const toDateType =
    valueType === 'ts-date'
      ? (date: Date) => date
      : (date: Date) =>
        dateParser.transform(date, 'struct=ngp-date', 'type=date');
  return {
    input,
    value: () => {
      const date = element.valueAsDate;
      if (!date) {
        return undefined;
      }
      const [year, week] = element.value.split('-W');
      const sunday = new Date(
        new Date(date.getTime()).setDate(date.getDate() + 6),
      );
      return {
        week: Number(week),
        year: Number(year),
        monday: toDateType(date),
        sunday: toDateType(sunday),
      } as InputWeek;
    },
  };
};

const mapperForColor = (
  valueType: InputValueType,
  input: HTMLInputElement,
): InputMapper => {
  if (valueType === 'rgb') {
    return {
      input: (item) => {
        if (!item) {
          return '';
        }
        const rgb = item as RGB;
        return `#${rgb.red.toString(16)}${rgb.green.toString(16)}${rgb.blue.toString(16)}${rgb.alpha ? (rgb.alpha * 100).toString(16) : ''}`;
      },
      value: () => {
        const hex = input.value.slice(1);
        const red = hex.substring(0, 2);
        const green = hex.substring(2, 4);
        const blue = hex.substring(4, 6);
        const alpha =
          hex.length > 6
            ? Number.parseInt(hex.substring(6, 8), 16) / 100
            : undefined;
        return {
          red: Number.parseInt(red, 16),
          green: Number.parseInt(green, 16),
          blue: Number.parseInt(blue, 16),
          alpha,
        };
      },
    };
  }
  return {
    input: (item) => (item ? JSON.stringify(item) : ''),
    value: () => input.value,
  };
};
