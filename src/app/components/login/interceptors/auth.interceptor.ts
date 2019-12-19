import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import swall from 'sweetalert2';
import {AuthService} from '../../../services/auth.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(e => {
        if (e.status == 401) {
          console.log('AuthInterceptor: Redirigiendo al login')
          // TOKEN EXIRADO: Este caso es cuando vence el token y manda un request y esta autenticado en el frontend
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }

        if (e.status == 403) {
          console.log('AuthInterceptor: sin permisos');
          swall.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
          this.router.navigate(['/clientes']);
        }

        return throwError(e);
      })
    );
  }
}
