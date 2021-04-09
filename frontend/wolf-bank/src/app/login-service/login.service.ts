import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CONFIG from '../CONFIG';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  getToken(username:string, password:string) {
    return this.http.post<any>(CONFIG.LOGIN_URL, {username, password}).toPromise();
  }

  getUserInfo(token:string) {
    return this.http.get<any>(CONFIG.USER_INFO_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).toPromise();
  }

}
