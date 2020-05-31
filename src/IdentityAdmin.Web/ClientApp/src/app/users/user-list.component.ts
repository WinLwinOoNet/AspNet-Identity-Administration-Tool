import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { IUser } from './user';
import { ApiResult } from '../base.service';
import { UserService } from './user.service';
import { AlertService } from '../core/alert/alert.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'email'];
  public users: MatTableDataSource<IUser>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "email";
  public defaultSortOrder: string = "asc";

  defaultFilterColumn: string = "email";
  filterQuery: string = null;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

  getData(pageEvent: PageEvent) {
    var sortColumn = (this.sort && this.sort.active) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort && this.sort.active) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;

    this.userService.getData<ApiResult<IUser>>(
      pageEvent.pageIndex,
      pageEvent.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery)
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.users = new MatTableDataSource<IUser>(result.data);
      }, error => this.alertService.danger(error));
  }
}
