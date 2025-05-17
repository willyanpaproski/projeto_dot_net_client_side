import { Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements AfterViewInit, OnChanges {
  @Input() displayedColumns: { key: string, label: string, width?: string, format?: (value: any) => string }[] = [];
  @Input() dataSource: any[] = [];
  @Output() rowDoubleClick = new EventEmitter<any>();

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
  }

  get columnKeys(): string[] {
    return this.displayedColumns.map(c => c.key);
  }

  onRowDoubleClick(row: any): void {
    this.rowDoubleClick.emit(row);
  }

  onRowClick(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }
}
