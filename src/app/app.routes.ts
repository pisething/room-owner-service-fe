import { Routes } from '@angular/router';
import { SectionComponent } from './components/section/section.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { RoomCreateComponent } from './components/room-create/room-create.component';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';
import { RoomEditComponent } from './components/room-edit/room-edit.component';
import { RoomListComponent } from './components/room-list/room-list.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'rooms', pathMatch: 'full'
    },
    { path: 'rooms', component: RoomListComponent },
    { path: 'rooms/new', component: RoomCreateComponent },
    { path: 'rooms/:id', component: RoomDetailComponent },
    { path: 'rooms/:id/edit', component: RoomEditComponent },
    {
        path: '**', redirectTo: 'properties'
    },

];
