import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const customGreenPalette = {
  50: '#e4f8f0',
  100: '#bdedd9',
  200: '#91e2c1',
  300: '#65d7a9',
  400: '#4cdb9c',
  500: '#4ad395',
  600: '#3fc385',
  700: '#32b174',
  800: '#259f63',
  900: '#187f48',
  950: '#0c2d1f',
};

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: customGreenPalette,

    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#071a13',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          950: '{zinc.950}',
        },
      },
      dark: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#000000',
          hoverColor: '{primary.400}',
          activeColor: '{primary.300}',
        },
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          950: '{slate.950}',
        },
      },
    },
  },
});
