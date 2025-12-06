import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UploadSummary } from '../../models/upload-summary';
import { RoomService } from '../../services/room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-upload',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-upload.component.html',
  styleUrl: './room-upload.component.css'
})
export class RoomUploadComponent {
private roomService = inject(RoomService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  selectedFile: File | null = null;
  dryRun = true; // default validate first
  loading = false;
  error: string | null = null;
  fileError: string | null = null;
  summary: UploadSummary | null = null;

  onFileChange(event: Event): void {
    this.fileError = null;
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.fileError = 'Please select a file.';
      return;
    }

    const file = input.files[0];
    const ext = file.name.toLowerCase();

    if (!ext.endsWith('.xlsx') && !ext.endsWith('.xls')) {
      this.selectedFile = null;
      this.fileError = 'Invalid file type. Please select an Excel file (.xlsx or .xls).';
      return;
    }

    this.selectedFile = file;
  }

  submit(): void {
    this.error = null;

    if (!this.selectedFile) {
      this.fileError = 'Please select an Excel file.';
      return;
    }

    this.loading = true;
    this.summary = null;

    this.roomService.uploadExcel(this.selectedFile, this.dryRun).subscribe({
      next: (res) => {
        this.loading = false;
        this.summary = res;
        this.snackBar.open(
          this.dryRun ? 'Dry run completed' : 'Rooms imported successfully',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      },
      error: (err) => {
        this.loading = false;
        console.error('Upload failed', err);
        this.error = err?.error?.detail || 'Failed to upload Excel file.';
        this.snackBar.open('Failed to upload Excel file', 'Close', {
          duration: 4000,
          panelClass: ['snack-error'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/rooms']);
  }
}
