import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';
import { Role } from './role';

@Injectable({
  providedIn: 'root'
})
export class RoleService
  extends BaseService {

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl);
  }

  getData<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {
    const url = this.baseUrl + 'api/Roles';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery)
    }

    return this.http.get<ApiResult>(url, { params });
  }

  get<Role>(id): Observable<Role> {
    var url = this.baseUrl + 'api/Roles/' + id;
    return this.http.get<Role>(url);
  }

  post<Role>(item): Observable<Role> {
    var url = this.baseUrl + 'api/Roles';
    return this.http.post<Role>(url, item);
  }

  put<Role>(item): Observable<Role> {
    var url = this.baseUrl + 'api/Roles/' + item.id;
    return this.http.post<Role>(url, item);
  }
}
