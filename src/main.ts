import { usePreset } from '@primeng/themes';
import { MyPreset } from './mypreset'; // ou './app/mypreset' dependendo da localização real

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

usePreset(MyPreset); // <- isso aplica seu tema antes da inicialização

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
