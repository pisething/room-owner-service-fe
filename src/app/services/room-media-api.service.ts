import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface RoomResponse {
  id: string;
  photoUrls?: string[];
  // add other fields if you want
}

@Injectable({ providedIn: 'root' })
export class RoomMediaApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/rooms`;

  uploadPhotos(roomId: string, files: File[]): Observable<RoomResponse> {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f, f.name));
    return this.http.post<RoomResponse>(`${this.base}/${roomId}/photos`, fd);
  }

  deletePhoto(roomId: string, objectKey: string): Observable<RoomResponse> {
    const params = new HttpParams().set('objectKey', objectKey);
    return this.http.delete<RoomResponse>(`${this.base}/${roomId}/photos`, { params });
  }

  getPhotos(roomId: string): Observable<RoomResponse> {
    return this.http.get<RoomResponse>(`${this.base}/${roomId}/photos`);
  }
}
