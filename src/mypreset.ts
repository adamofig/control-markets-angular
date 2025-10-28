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
  components: {
    dialog: {
      colorScheme: {
        dark: {
          root: {
            background: '{stone.800}',
            borderColor: '{surface.700}',
            color: '{text.color}',
          },
        },
      },
    },
    tabs: {
      colorScheme: {
        dark: {
          tablist: {
            background: '{surface.800}',
            borderColor: '{surface.700}',
          },
          tab: {
            background: 'transparent',
            hoverBackground: '{surface.700}',
            activeBackground: '{surface.900}',
            color: '{text.color.secondary}',
            hoverColor: '{text.color}',
            activeColor: '{primary.color}',
          },
          activeBar: {
            background: '{primary.color}',
          },
          tabpanel: {
            background: '{stone.800}',
            color: '{text.color}',
          },
        },
      },
    },
  },
});
