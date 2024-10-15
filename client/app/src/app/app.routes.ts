import { Routes } from '@angular/router';
import { CvViewerComponent } from './cv-viewer/cv-viewer.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
    path: 'cv/show/:id',
    component: CvViewerComponent
}];
