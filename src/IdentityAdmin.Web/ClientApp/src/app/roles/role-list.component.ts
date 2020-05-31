import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { IRole } from './role';
import { ApiResult } from '../base.service';
import { RoleService } from './role.service';
import { AlertService } from '../core/alert/alert.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name'];
  public roles: MatTableDataSource<IRole>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: string = "asc";

  defaultFilterColumn: string = "name";
  filterQuery: string = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private roleService: RoleService,
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
    console.log(this.sort, this.sort.active);
    var sortColumn = (this.sort && this.sort.active) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort && this.sort.active) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;

    this.roleService.getData<ApiResult<IRole>>(
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
        this.roles = new MatTableDataSource<IRole>(result.data);
      }, error => this.alertService.danger(error));
  }
}
