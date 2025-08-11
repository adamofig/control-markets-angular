// import { definePreset } from '@primeng/themes';
// import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeuix/themes';

import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      dark: {
        primary: {
          50: '{amber.100}',
          100: '{amber.200}',
          200: '{amber.300}',
          300: '{amber.400}',
          400: '{amber.500}',
          500: '{amber.600}',
          600: '{amber.700}',
          700: '{amber.800}',
          800: '{amber.900}',
          900: '{amber.950}',
          950: '{amber.950}',
        },

        card: {
          root: {
            background: '#0b0319',
            color: '{content.color}',
            shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    primary: {
      50: '{amber.100}',
      100: '{amber.200}',
      200: '{amber.300}',
      300: '{amber.400}',
      400: '{amber.500}',
      500: '{amber.600}',
      600: '{amber.700}',
      700: '{amber.800}',
      800: '{amber.900}',
      900: '{amber.950}',
      950: '{amber.950}',
    },
  },
});
