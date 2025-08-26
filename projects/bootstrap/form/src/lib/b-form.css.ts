import { StyleElement } from '@pmeig/ng-material-core';

export const NoValidationCss: StyleElement = {
  id: 'b-form-css',
  css: [{
    name: '.form-validation',
    value: {
      'padding-bottom': '1rem'
    },
    children: [{
      name: ' .feedback-margin',
      value: {
        opacity: 0
      },
    },
      {
        name: '.was-validated ',
        children: [{
          name: ' .feedback-margin',
          value: {
            display: 'none',
          },
        },

        {
          name: ' :valid~ .feedback-margin-valid',
          value: {
            display: 'none'
          }
        },
          {
            name: ' :invalid~ .feedback-margin-invalid',
            value: {
              display: 'none'
            }
          }]
      }
    ]
  },
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
