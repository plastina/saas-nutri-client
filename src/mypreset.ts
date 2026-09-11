import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const customBluePalette = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
};

const customGrayPalette = {
  50: '#f7f8f3',
  100: '#eef0e6',
  200: '#dde1d1',
  300: '#c9cdbe',
  400: '#a9af9c',
  500: '#8b9080',
  600: '#5b6153',
  700: '#454a3d',
  800: '#2e3227',
  900: '#1c2117',
  950: '#14170f',
};

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: customBluePalette,
    neutral: customGrayPalette,
    input: {
      background: '#2a2d32', // Fundo preto acinzentado
      color: '#f0f2f5', // Texto claro
      borderColor: '#3b3f45', // Borda discreta
      focusBorderColor: '{primary.500}', // Realce na borda ao focar
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        surface: {
          0: '#ffffff',
          50: '#ffffff',
          100: '#ffffff',
          950: '{neutral.100}',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '#000000',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        surface: {
          0: '#ffffff',
          50: '{neutral.800}',
          950: '{neutral.950}',
        },
      },
    },
  },
});
