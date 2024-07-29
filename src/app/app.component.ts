import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { CustomersService } from './services/Customers.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    // 'lastName',
    'email',
    // 'adharNumber',
    'registrationDate',
    'planName',
    'planCost',
    'validity',
    'assignedMobileNumber',
    'planStatus',
    'renewalDate',
    "action"
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _CustomersService: CustomersService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getCustomersList();
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCustomersList();
        }
      },
    });
  }

  getCustomersList() {
    this._CustomersService.getCustomersList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        console.log(this.dataSource,'data')
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCustomers(id: number) {
    this._CustomersService.deleteCustomers(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Customer deleted!', 'done');
        this.getCustomersList();
      },
      error: console.log,
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCustomersList();
        }
      },
    });
  }
}
