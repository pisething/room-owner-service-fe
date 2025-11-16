import { Component, signal } from '@angular/core';
import { PropertiesHeaderComponent } from "../properties-header/properties-header.component";
import { PropertiesGridComponent } from "../properties-grid/properties-grid.component";
import { PropertiesListComponent } from "../properties-list/properties-list.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { RoomListParams } from '../../models/room-list-params';

@Component({
  selector: 'app-section',
  imports: [PropertiesHeaderComponent, PropertiesGridComponent, PropertiesListComponent, PaginationComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {

  filter = signal<RoomListParams>({page: 0, size: 4, priceMin: null, priceMax: null});

  onFilterChanged(f: RoomListParams){
    this.filter.set(f);
  }
}
