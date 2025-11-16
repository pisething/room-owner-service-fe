import { Component, Input } from '@angular/core';
import { Room } from '../../models/room';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-property-card',
  imports: [RouterLink],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css'
})
export class PropertyCardComponent {

  @Input({required: true}) room!: Room

}
