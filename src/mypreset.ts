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

const customSlatePalette = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
};

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: customBluePalette,
    neutral: customSlatePalette,
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
