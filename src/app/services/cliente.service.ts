import {Injectable} from '@angular/core';
import {Cliente} from '../components/clientes/cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Region} from '../components/clientes/Region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // END POINT LOCAL: 'http://localhost:8080/api/clientes';
  // Lo modificacmos por el de Heroku
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  // private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  // IMPORTANTE: si no se usa un interceptor tendremos que enviar el header en la solicitud de cada req, por ejemplo
  // return this.httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()})
  /*
  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }
  */

  // IMPORTANTE: implementado con interceptor para la gestion del response de error del backend
  /*
  private isNoAutorizado(e): boolean {

    if (e.status == 401) {
      // TOKEN EXIRADO: Este caso es cuando vence el token y manda un request y esta autenticado en el frontend
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    if (e.status == 403) {
      swall.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }

    return false;
  }
  */

  getClientes(page: number): Observable<any> {
    // Lo podemos hacer casteando la respuesta
    // return this.httpClient.get<Cliente[]>(this.urlEndPoint);
    // return of(CLIENTES);

    // Otra opcion es usar el operador MAP
    return this.httpClient.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        // El TAP nos permite realizar tareas sin afectar el flujo de datos
        (response.content as Cliente[]).forEach(cliente => {
          console.log('imprimiedo desde el bloque tap: ' + cliente.nombre);
        });
      }),
      map((response: any) => response)
    );
  }

  getClienteById(id): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(err => {
        /*
        if (this.isNoAutorizado(err)) {
          return throwError(err);
        }
        */

        if (err.status != 401 && err.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.log(err.error.mensaje);
        }
        return throwError(err);
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.httpClient.post<any>(this.urlEndPoint, cliente).pipe(
      catchError(err => {
        /*
        if (this.isNoAutorizado(err)) { // para los errore de tipo 401 y 403
          return throwError(err);
        }
        */

        if (err.status == 400) {// Preguntamos si es un bad_request para manejarlo de manera distinta ya que contiene mas errores
          return throwError(err);// como se trata de varios no podemos mandarlo al SWALL
        }

        if (err.error.mensaje) {
          console.error(err.error.mensaje);
        }

        return throwError(err);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.httpClient.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(err => {
        /*
        if (this.isNoAutorizado(err)) {
          return throwError(err);
        }
        */
        if (err.status == 400) {
          return throwError(err);
        }

        if (err.error.mensaje) {
          console.log(err.error.mensaje);
        }

        return throwError(err);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(err => {
        /*
        if (this.isNoAutorizado(err)) {
          return throwError(err);
        }
        */
        if (err.error.mensaje) {
          console.log(err.error.mensaje);
        }

        return throwError(err);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    // Ejemplo de envio de token por FORMDATA
    /*
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if (token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    */
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
      //headers: httpHeaders
    });

    return this.httpClient.request(req);
  }

  getRegiones(): Observable<Region[]> {
    return this.httpClient.get<Region[]>(`${this.urlEndPoint}/regiones`);

    /* Ejemplo con funcion PIPE cuando capturamos el error
    return this.httpClient.get<Region[]>(`${this.urlEndPoint}/regiones`).pipe(
      catchError(e => {
        // this.isNoAutorizado(e);
        return throwError(e);
      })
    );
    */
  }

}
