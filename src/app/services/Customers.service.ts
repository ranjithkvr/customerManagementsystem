import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private _http: HttpClient) {}

  addCustomers(data: any): Observable<any> {
    return this._http.post('http://localhost:3000/customers', data);
  }

  updateCustomers(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/customers/${id}`, data);
  }

  getCustomersList(): Observable<any> {
    return this._http.get('http://localhost:3000/customers');
  }

  deleteCustomers(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/customers/${id}`);
  }
}
