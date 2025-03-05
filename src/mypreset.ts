//mypreset.ts
import { definePreset } from '@primeng/themes';
// import Aura from '@primeng/themes/aura';

import Lara from '@primeng/themes/lara';

const MyPreset = definePreset(Lara, {
  semantic: {
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

export default MyPreset;
