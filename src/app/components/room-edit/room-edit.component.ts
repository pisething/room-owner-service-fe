import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { RoomFormComponent } from "../room-form/room-form.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-edit',
  imports: [RoomFormComponent],
  templateUrl: './room-edit.component.html',
  styleUrl: './room-edit.component.css'
})
export class RoomEditComponent {
  private roomService = inject(RoomService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // strictly typed signal
  room = signal<Room | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    }
  }

  private load(id: string) {
    this.roomService.getById(id).subscribe({
      next: room => {
        this.room.set(room);
      },
      error: err => {
        console.error('Load failed', err);
      }
    });
  }

  onUpdate(evt: { id: string; body: Room }) {
    this.roomService.update(evt.id, evt.body).subscribe({
      next: () => {

        this.snackBar.open('Room updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });

        this.router.navigate(['/rooms', evt.id]);
      },
      error: err => {
        console.error('Update failed', err);
        
        this.snackBar.open('Failed to update room', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
