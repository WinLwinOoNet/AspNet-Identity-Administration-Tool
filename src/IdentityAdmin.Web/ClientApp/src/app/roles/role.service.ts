import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';

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

  get<IRole>(id): Observable<IRole> {
    var url = this.baseUrl + 'api/Roles/' + id;
    return this.http.get<IRole>(url);
  }

  post<IRole>(item): Observable<IRole> {
    var url = this.baseUrl + 'api/Roles';
    return this.http.post<IRole>(url, item);
  }

  put<IRole>(item): Observable<IRole> {
    var url = this.baseUrl + 'api/Roles/' + item.id;
    return this.http.put<IRole>(url, item);
  }

  delete<IRole>(id): Observable<IRole> {
    var url = this.baseUrl + 'api/Roles/' + id;
    return this.http.delete<IRole>(url);
  }
}
