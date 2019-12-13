import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import swall from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    let role = next.data['role'] as string;
    console.log('Role: ' + role);

    if (this.authService.hasRole(role)) {
      return true;
    }

    swall.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
    this.router.navigate(['/clientes']);
    return false;
  }
}
