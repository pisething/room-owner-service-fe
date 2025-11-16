import { Routes } from '@angular/router';
import { SectionComponent } from './components/section/section.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'properties', pathMatch: 'full'
    },
    {
        path: 'properties', component: SectionComponent
    },
    {
        path: 'properties/:id', component: PropertyDetailsComponent
    },
    {
        path: '**', redirectTo: 'properties'
    },

];
