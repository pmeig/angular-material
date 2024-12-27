import { StyleElement } from '@pmeig/ng-material-core';

export const NoValidationCss: StyleElement = {
  id: 'b-form-css',
  css: [
    {
      name: '.form-control.decorator-none',
      children: [
        {
          name: ':valid',
          value: {
            'border-color': '#ced4da!important',
            'background-image': 'unset!important',
          },
        },
        {
          name: ':invalid',
          value: {
            'border-color': '#ced4da!important',
            'background-image': 'unset!important',
          },
        },
      ],
    },
  ],
};
