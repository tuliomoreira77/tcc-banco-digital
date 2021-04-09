import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { LoginService } from '../login-service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private isAuth: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private user: any;

  constructor(
    private http: HttpClient,
    private loginService:LoginService,
  ) { }

  persistToken(data:any, userData:any) {
    if (data) {
      document.cookie = `token=${data};max-age=${(3600*3600)};path=/;Secure,HttpOnly`;
      this.user = userData;
      this.isAuth.next(true);
    }
  }

  verifyExistentToken() {
    const token = this.getCookie('token');
    let isValid = this.checkTokenValidation(token);
    return isValid;
  }

  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuth.asObservable();
  }

  checkTokenValidation(token:string): boolean {
    if(!token || token.length == 0) 
      return false;
    var usuario = this.decodeToken(token);
    var expiration = usuario.exp * 1000;
    if(+expiration > +new Date()) {
      this.isAuth.next(true);
      return true;
    } else {
      this.isAuth.next(false);
      return false;
    }
  }

  async getUser() {
    if(!this.user) {
      this.user = await this.loginService.getUserInfo(this.getCookie('token'));
    }
    return this.user;
  }

  deleteCookie(cname) {
    document.cookie = `${cname}=;path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }

  decodeToken(token: string) {
    return JSON.parse(this.b64DecodeUnicode(token.split('.')[1]));
  }

  b64DecodeUnicode(str:string) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  logout() {
    this.deleteCookie('token');
    this.deleteCookie('JSESSIONID');
    this.isAuth.next(false);
    this.user.next('');
    window.location.href = '/'
  }
}
