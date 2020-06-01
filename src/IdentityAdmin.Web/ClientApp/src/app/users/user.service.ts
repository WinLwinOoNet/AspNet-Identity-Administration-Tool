import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from '../base.service';
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

    if (filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery)
    }

    return this.http.get<ApiResult>(url, { params });
  }

  get<IUser>(id): Observable<IUser> {
    var url = this.baseUrl + 'api/Users/' + id;
    return this.http.get<IUser>(url);
  }

  post<IUser>(item): Observable<IUser> {
    var url = this.baseUrl + 'api/Users';
    return this.http.post<IUser>(url, item);
  }

  put<IUser>(item): Observable<IUser> {
    var url = this.baseUrl + 'api/Users/' + item.id;
    return this.http.put<IUser>(url, item);
  }
}
