import { Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements AfterViewInit, OnChanges {
  @Input() displayedColumns: {
      key: string,
      label: string,
      width?: string,
      format?: (value: any, row?: any) => string
   }[] = [];
  @Input() dataSource: any[] = [];
  @Output() rowDoubleClick = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Input() selectedRowInput: any;

  dataSourceTable = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedRow: any;

  ngAfterViewInit() {
    this.dataSourceTable.paginator = this.paginator;
    this.dataSourceTable.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.dataSourceTable.data = this.dataSource;
    }

    if (changes['selectedRowInput']) {
      this.selectedRow = changes['selectedRowInput'].currentValue;
    }
  }

  get columnKeys(): string[] {
    return this.displayedColumns.map(c => c.key);
  }

  onRowDoubleClick(row: any): void {
    this.rowDoubleClick.emit(row);
  }

  onRowClick(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
    this.rowClick.emit(row);
  }

  getNestedValue(obj: any, key: string): any {
    if (!obj || !key) return undefined;
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

}
