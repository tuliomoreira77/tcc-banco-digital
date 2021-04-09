import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {  AuthServiceService } from './auth-service.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthServiceService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles:Array<any> = route.data.expectedRoles;
    const user = this.authService.getUser();
    if (!user || expectedRoles.some(role => expectedRoles.includes(role))) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
  
}
