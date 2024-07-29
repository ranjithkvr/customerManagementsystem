import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { CustomersService } from '../services/Customers.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
  providers: [DatePipe]
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  selected = '';
  currentDateAndTime:any;
  planCost: string = '';
  validity: string = '';
  planStatus: string = 'Inactive';
  renewalDate: any;

  plans: string[] = [
    'Platinum 365',
    'Gold 180',
    'Silver 90',
  ];
 
  constructor(
    private _fb: FormBuilder,
    private _CustomersService: CustomersService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
    private datePipe: DatePipe
  ) {
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      adharNumber: '',
      registrationDate: '',
      assignedMobileNumber: '',
      planName: '',
      planCost: '',
      validity: '',
      planStatus: '',
      renewalDate: ''
    });
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
    this.currentDateAndTime = new Date();
  }

  planSelection(plan: string){

    if(plan === 'Platinum 365'){
      this.empForm.controls['planCost'].setValue('999');
      this.empForm.controls['validity'].setValue('365');
      this.empForm.controls['planStatus'].setValue('Active');
    }else if(plan === 'Gold 180'){
      this.empForm.controls['planCost'].setValue('699');
      this.empForm.controls['validity'].setValue('180');
      this.empForm.controls['planStatus'].setValue('Active');

    }else if(plan === 'Silver 90'){
      this.empForm.controls['planCost'].setValue('399');
      this.empForm.controls['validity'].setValue('90');
      this.empForm.controls['planStatus'].setValue('Active');

    } else{
      this.empForm.controls['planCost'].setValue('');
      this.empForm.controls['validity'].setValue('');
      this.empForm.controls['planStatus'].setValue('InActive');

    }
    
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
      

        console.log(this.data.id, 'this.data.id');
        console.log(this.empForm, 'empForm');
        
        this._CustomersService
          .updateCustomers(this.data.id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Customer detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this.empForm.controls['registrationDate'].setValue(this.currentDateAndTime);
       
                // Get the current date
        const currentDate: Date = new Date();

        // Create a new date object for validity days later
        const futureDate: Date = new Date(currentDate);
        futureDate.setDate(currentDate.getDate() +  Number(this.empForm.controls['validity'].value));

        // Format the future date to ISO string
        const isoString: string = futureDate.toISOString();


        this.empForm.controls['renewalDate'].setValue(isoString);
        this._CustomersService.addCustomers(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Customer added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
