import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

    constructor(
        public router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        const currentUser = JSON.parse(localStorage.getItem('credentials'));

        if (currentUser) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }

}