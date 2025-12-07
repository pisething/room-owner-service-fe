import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { RoomListParams } from '../models/room-list-params';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { Room } from '../models/room';
import { HttpClient, HttpParams } from '@angular/common/http';
import { buildParams } from '../core/http/utils';
import { UploadSummary } from '../models/upload-summary';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  // api_url
  // request param
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/rooms`;

  ///room/search/pagination

  constructor() { }

  list(params?: RoomListParams ) : Observable<Page<Room>>{
    return this.http.get<Page<Room>>(this.base, {params: buildParams(params)});
  }

  create(body: any) : Observable<Room>{
    return this.http.post<Room>(this.base, body);
  }

   /** PATCH /rooms/{id} */
  update(id: string, body: Room): Observable<Room> {
    return this.http.patch<Room>(`${this.base}/${id}`, body);
  }

   /** GET /rooms/{id} */
  getById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.base}/${id}`);
  }

  uploadExcel(file: File, dryRun: boolean): Observable<UploadSummary> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new HttpParams().set('dryRun', String(dryRun));

    return this.http.post<UploadSummary>(
      `${this.base}/upload-excel`,
      formData,
      { params }
    );
  }

}
