import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from '../../models/page';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-list',
  imports: [],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  private roomService = inject(RoomService);
  private router = inject(Router);

  // UI state
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Paging + filters
  pageIndex = signal<number>(0);   // 0-based
  pageSize  = signal<number>(10);
  nameQuery = signal<string>('');
  status    = signal<string>('');  // <-- fully typed union

  // Data
  page = signal<Page<Room> | null>(null);

  ngOnInit(): void {
    this.load();
  }

  // Called by template (no casts inside template)
  onStatusChange(val: string): void {
    this.status.set(val);
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    const params: any = {
      page: this.pageIndex(),
      size: this.pageSize()
    };
    const name = this.nameQuery().trim();
    if (name) { params.name = name; }
    if (this.status()) { params.status = this.status(); }

    this.roomService.list(params).subscribe({
      next: (p) => {
        this.page.set(p);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load rooms.');
        this.loading.set(false);
      }
    });
  }

  // Actions
  createNew(): void {
    this.router.navigate(['/rooms', 'new']);
  }
  view(r: Room): void {
    if (r.id) { this.router.navigate(['/rooms', r.id]); }
  }
  edit(r: Room): void {
    if (r.id) { this.router.navigate(['/rooms', r.id, 'edit']); }
  }

  // Pagination helpers 
  private lastPageIndex(): number {
    const p = this.page();
    const total = p?.totalPage ?? 0;
    return Math.max(0, total - 1);
  }

  first(): void {
    if (this.pageIndex() > 0) {
      this.pageIndex.set(0);
      this.load();
    }
  }
  prev(): void {
    if (this.pageIndex() > 0) {
      this.pageIndex.set(this.pageIndex() - 1);
      this.load();
    }
  }
  next(): void {
    const last = this.lastPageIndex();
    if (this.pageIndex() < last) {
      this.pageIndex.set(this.pageIndex() + 1);
      this.load();
    }
  }
  last(): void {
    const last = this.lastPageIndex();
    if (last >= 0) {
      this.pageIndex.set(last);
      this.load();
    }
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.load();
  }

  applyFilters(): void {
    this.pageIndex.set(0);
    this.load();
  }

  clearFilters(): void {
    this.nameQuery.set('');
    this.status.set('');     
    this.pageIndex.set(0);
    this.load();
  }
}
