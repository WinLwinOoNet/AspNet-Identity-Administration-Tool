import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService
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
    const url = this.baseUrl + 'api/Users';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if(filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery)
    }

    return this.http.get<ApiResult>(url, { params });
  }

  get<User>(id: number): Observable<User> {
    var url = this.baseUrl + 'api/Users/' + id;
    return this.http.get<User>(url);
  }

  post<User>(item): Observable<User> {
    var url = this.baseUrl + 'api/Users';
    return this.http.post<User>(url, item);
  }

  put<User>(item): Observable<User> {
    var url = this.baseUrl + 'api/Users/' + item.id;
    return this.http.post<User>(url, item);
  }
}
