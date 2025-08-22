import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/presentation/app.config';
import { App } from './app/core/presentation/app';
import '@fontsource-variable/nunito-sans';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
