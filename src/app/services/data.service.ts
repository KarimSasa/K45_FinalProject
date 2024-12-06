import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL = 'http://167.99.123.194/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAIInnovationsData(): Observable<any> {
    return this.http.get(`${this.API_URL}/ai-innovations`, {
      headers: this.getHeaders()
    });
  }

  getAIAdoptionData(): Observable<any> {
    return this.http.get(`${this.API_URL}/ai-adoption`, {
      headers: this.getHeaders()
    });
  }

  getDashboardContent(): Observable<any> {
    return this.http.get(`${this.API_URL}/dashboard-content`, {
      headers: this.getHeaders()
    });
  }
}
