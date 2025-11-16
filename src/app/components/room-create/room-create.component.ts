import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { RoomFormComponent } from "../room-form/room-form.component";

@Component({
  selector: 'app-room-create',
  imports: [RoomFormComponent],
  templateUrl: './room-create.component.html',
  styleUrl: './room-create.component.css'
})
export class RoomCreateComponent {
private roomService = inject(RoomService);
  private router = inject(Router);

  onCreate(body: Room) {
    
    this.roomService.create(body).subscribe({
      next: created => {
        // navigate to detail page
        this.router.navigate(['/rooms', created.id]); /* /rooms/id */
      },
      error: err => {
        console.error('Create failed', err);
        alert('Failed to create room.');
      }
    });
    
  }
}
