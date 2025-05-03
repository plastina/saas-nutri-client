import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const customGreenPalette = {
  50: '#e9fdf2',
  100: '#c8f7df',
  200: '#a5f1cb',
  300: '#82eab7',
  400: '#5ee4a3',
  500: '#3bde90',
  600: '#2fbe78',
  700: '#239f61',
  800: '#187f4a',
  900: '#0c4025',
  950: '#061e13',
};

const customGrayPalette = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#cbd5e1',
  500: '#94a3b8',
  600: '#64748b',
  700: '#475569',
  800: '#334155',
  900: '#1e293b',
  950: '#0f172a', // Antes era quase preto sólido, agora é azul-cinza escuro
};

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: customGreenPalette,
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
