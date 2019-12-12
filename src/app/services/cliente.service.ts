import {Injectable} from '@angular/core';
import {Cliente} from '../components/clientes/cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import swall from 'sweetalert2';
import {Region} from '../components/clientes/Region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  private isNoAutorizado(e): boolean {

    if (e.status == 401 || e.status == 403) {
      this.router.navigate(['/login']);
      return true;
    }

    return false;
  }

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
        if (this.isNoAutorizado(err)) {
          return throwError(err);
        }
        swall.fire(
          'Error al editar',
          err.error.mensaje,
          'error'
        );
        this.router.navigate(['/clientes']);
        console.log(err.error.mensaje);
        return throwError(err);
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.httpClient.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(err => {
        if (this.isNoAutorizado(err)) { // para los errore de tipo 401 y 403
          return throwError(err);
        }
        if (err.status == 400) {// Preguntamos si es un bad_request para manejarlo de manera distinta ya que contiene mas errores
          return throwError(err);// como se trata de varios no podemos mandarlo al SWALL
        }
        swall.fire(
          'Error al crear cliente',
          err.error.mensaje,
          'error'
        );
        console.error(err.error.mensaje);
        return throwError(err);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.httpClient.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(err => {
        if (this.isNoAutorizado(err)) {
          return throwError(err);
        }
        if (err.status == 400) {
          return throwError(err);
        }
        console.log(err.error.mensaje);
        swall.fire(
          'error al actualizar cliente',
          err.error.mensaje,
          'error'
        );
        return throwError(err);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(err => {
        if (this.isNoAutorizado(err)) {
          return throwError(err);
        }
        console.log(err.error.mensaje);
        swall.fire(
          'error al eliminar cliente',
          err.error.mensaje,
          'error'
        );
        return throwError(err);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.httpClient.request(req).pipe(
      catchError(err => {
        this.isNoAutorizado(err);
        return throwError(err);
      })
    );
  }

  getRegiones(): Observable<Region[]> {
    return this.httpClient.get<Region[]>(`${this.urlEndPoint}/regiones`).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

}
