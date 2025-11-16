import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { RoomListParams } from '../models/room-list-params';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { Room } from '../models/room';
import { HttpClient, HttpParams } from '@angular/common/http';
import { buildParams } from '../core/http/utils';

export enum AdminLevel{
  PROVINCE = 'PROVINCE',
  DISTRICT = 'DISTRICT',
  COMMUNE = 'COMMUNE',
  VILLAGE = 'VILLAGE'
}

export interface AdminAreaResponse{
  code: string;
  nameEn: string;
  level: AdminLevel;
  parentCode?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  // api_url
  // request param
  private http = inject(HttpClient);
  private base = `${environment.addressApiUrl}/api/admin-areas/slim`;

  ///room/search/pagination

  constructor() { }

  getProvinces() : Observable<AdminAreaResponse[]>{
    const param = new HttpParams().set('level',AdminLevel.PROVINCE);
    return this.http.get<AdminAreaResponse[]>(this.base,{params: param});
  }

  getDistricts(provinceCode: string) : Observable<AdminAreaResponse[]>{
    const param = new HttpParams()
      .set('level',AdminLevel.DISTRICT)
      .set('parentCode', provinceCode);
    return this.http.get<AdminAreaResponse[]>(this.base,{params: param});
  }

  getCommunes(districtCode: string) : Observable<AdminAreaResponse[]>{
    const param = new HttpParams()
      .set('level',AdminLevel.COMMUNE)
      .set('parentCode', districtCode);
    return this.http.get<AdminAreaResponse[]>(this.base,{params: param});
  }

  getVillages(communeCode: string) : Observable<AdminAreaResponse[]>{
    const param = new HttpParams()
      .set('level',AdminLevel.VILLAGE)
      .set('parentCode', communeCode);
    return this.http.get<AdminAreaResponse[]>(this.base,{params: param});
  }

  list(params?: RoomListParams ) : Observable<Page<Room>>{
    return this.http.get<Page<Room>>(this.base + "/api/rooms/search/pagination", {params: buildParams(params)});
  }
}
