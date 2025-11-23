import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { JsonPipe } from '@angular/common';
// ---------- Amenity constants (clean + type-safe) ----------
const AMENITIES = [
  ['hasFan', 'Fan'],
  ['hasAirConditioner', 'Air Conditioner'],
  ['hasParking', 'Parking'],
  ['hasPrivateBathroom', 'Private Bathroom'],
  ['hasBalcony', 'Balcony'],
  ['hasKitchen', 'Kitchen'],
  ['hasFridge', 'Fridge'],
  ['hasWashingMachine', 'Washing Machine'],
  ['hasTV', 'TV'],
  ['hasWiFi', 'WiFi'],
  ['hasElevator', 'Elevator'],
] as const;

type AmenityKey = typeof AMENITIES[number][0];
@Component({
  selector: 'app-room-detail',
  imports: [JsonPipe],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css'
})
export class RoomDetailComponent {
  private roomService = inject(RoomService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  room = signal<Room | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  amenities: ReadonlyArray<{ key: AmenityKey; label: string }> =
    AMENITIES.map(([key, label]) => ({ key, label }));

  hasAmenity = (r: Room | null, k: AmenityKey): boolean => !!(r && r[k]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing room id in route.');
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.roomService.getById(id).subscribe({
      next: (r) => {
        this.room.set(r);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Unable to load room.');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/rooms']); // adjust to your list route if different
  }

  edit(): void {
    const r = this.room();
    if (r?.id) {
      this.router.navigate(['/rooms', r.id, 'edit']);
    }
  }
}
