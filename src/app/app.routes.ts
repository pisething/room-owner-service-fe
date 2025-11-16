import { Routes } from '@angular/router';
import { SectionComponent } from './components/section/section.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';

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
    { path: 'rooms/new', component: RoomCreateComponent },
    {
        path: '**', redirectTo: 'properties'
    },

];
