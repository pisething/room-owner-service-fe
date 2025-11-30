import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { RoomFormComponent } from "../room-form/room-form.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-create',
  imports: [RoomFormComponent],
  templateUrl: './room-create.component.html',
  styleUrl: './room-create.component.css'
})
export class RoomCreateComponent {
private roomService = inject(RoomService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  onCreate(body: Room) {
    
    this.roomService.create(body).subscribe({
      next: created => {
        // show success toast
        this.snackBar.open('Room created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        // navigate to detail page
        this.router.navigate(['/rooms', created.id]); /* /rooms/id */
      },
      error: err => {
        console.error('Create failed', err);
        // error toast
        this.snackBar.open('Failed to create room', 'Close', {
          duration: 4000,
          panelClass: ['snack-error'], // optional custom style
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
    
  }
}
